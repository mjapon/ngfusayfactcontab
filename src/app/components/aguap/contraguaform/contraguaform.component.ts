import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ContratoaguaService } from '../../../services/agua/contratoagua.service';
import { PersonaService } from '../../../services/persona.service';
import { SwalService } from '../../../services/swal.service';
import { LoadingUiService } from '../../../services/loading-ui.service';
import { DomService } from '../../../services/dom.service';
import { BaseComponent } from '../../shared/base.component';
import { CtesService } from '../../../services/ctes.service';
import { CtesAguapService } from '../utils/ctes-aguap.service';

@Component({
    selector: 'app-contraguaform',
    templateUrl: './contraguaform.component.html'
})
export class ContraguaformComponent extends BaseComponent implements OnInit, OnChanges {
    form: any = {};
    formref: any = {};
    formmed: any = {};
    tipoContra = 1;
    tarifas: Array<any> = [];
    comunidades: Array<any> = [];
    contratosPrevios: Array<any> = [];
    currentDate = new Date();
    teredad = 0;
    isTercedad = false;
    isRefSearched = false;
    validfl: Array<any> = [];

    @Input() codref;
    @Input() modotab = false;
    isShowFormCrea = true;

    constructor(private router: Router,
        private domService: DomService,
        private swalService: SwalService,
        private personService: PersonaService,
        private loadingService: LoadingUiService,
        private ctesAgua: CtesAguapService,
        private ctes: CtesService,
        private contraService: ContratoaguaService) {
        super();
    }


    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.codref;
        if (chng.currentValue) {
            this.formref.per_id = this.codref;
            this.loadContratosRef();
        } else {

        }

        const changeModoTab = changes.modotab;
        if (changeModoTab.currentValue) {
            this.isShowFormCrea = false;
        }
    }

    ngOnInit(): void {
        this.loadForm();
    }

    gotomain() {
        if (!this.modotab) {
            this.router.navigate([this.ctesAgua.rutaHome]);
        } else {
            this.loadContratosRef();
            this.isShowFormCrea = false;
        }
    }

    cancelar() {
        if (this.modotab) {
            this.isShowFormCrea = false;
        } else {
            this.gotomain();
        }
    }

    loadForm() {
        this.turnOnLoading();
        this.contraService.getForm(this.tipoContra).subscribe(res => {
            this.turnOffLoading();
            this.form = res.form.form;
            this.formref = res.form.formper;
            this.tarifas = res.form.tarifas;
            this.comunidades = res.form.comunidades;
            this.formmed = res.form.formmed;
            this.teredad = res.form.teredad;
            this.validfl = res.form.validfl;
            this.domService.setFocusTm(this.ctes.perCirucInput, 100);
        });
    }

    verifiRefRegistrado() {
        if (!this.isRefSearched) {
            this.buscarReferente();
        }
    }

    buscarReferente() {
        this.isRefSearched = true;
        this.loadingService.publishBlockMessage();
        this.personService.buscarPorCifull(this.formref.per_ciruc).subscribe(res => {
            if (this.isResultOk(res)) {
                this.swalService.fireToastSuccess(this.ctes.msgRefRegistered);
                this.personService.loadDataToform(this.formref, res.persona);
                this.loadContratosRef();
                this.calcularEdad();
                this.domService.setFocus(this.ctesAgua.cna_tarifa);
            } else {
                this.domService.setFocus(this.ctes.per_nombres);
            }
            this.isRefSearched = false;
        });
    }

    loadContratosRef() {
        this.contratosPrevios = [];
        this.contraService.findByRef(this.formref.per_id).subscribe(res => {
            if (res.items && res.items.length > 0) {
                this.swalService.fireToastInfo(this.ctesAgua.msgRefTieneMed);
                this.contratosPrevios = res.items;
            }
        });
    }

    calcularEdad() {
        this.personService.setPerEdad(this.formref, true);
        this.isTercedad = this.personService.isTercedad(this.formref, this.teredad);
        if (!this.form.cna_teredad) {
            this.form.cna_teredad = this.isTercedad;
        }
        if (this.isTercedad) {
            this.swalService.fireToastInfo(this.ctesAgua.msgAplTarfTercedad);
        }
    }

    toggleTercedad() {
        this.form.cna_teredad = !this.form.cna_teredad;
    }

    toggleDisca() {
        this.form.cna_discapacidad = !this.form.cna_discapacidad;
    }

    guardar() {
        const vfieldref = this.personService.getBasicValidFieldList();
        if (!this.modotab) {
            const isValidRef = this.domService.validFormData(this.formref, vfieldref);
            if (!isValidRef) {
                return;
            }
        }

        const isValidContra = this.domService.validFormData(this.form, this.validfl);
        if (!isValidContra) {
            return;
        }
        const isValidMed = this.domService.validFormData(this.formmed, this.validfl);
        if (!isValidMed) {
            return;
        }

        this.personService.parsePerFechanac(this.formref);
        const edcrearef = !this.modotab;

        if (!edcrearef) {
            this.formref.per_id = this.codref;
        }

        const form = {
            form: this.form,
            formref: this.formref,
            formmed: this.formmed,
            edcrearef
        };
        this.loadingService.publishBlockMessage();
        this.swalService.fireDialog(this.ctes.msgConfirmSave, '').then(confirm => {
            if (confirm.value) {
                this.loadingService.publishBlockMessage();
                if (this.form.cna_id > 0) {
                    this.contraService.editar(form).subscribe(res => {
                        if (this.isResultOk(res)) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.gotomain();
                        }
                    });
                } else {
                    this.contraService.crear(form).subscribe(res => {
                        if (this.isResultOk(res)) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.gotomain();
                        }
                    });
                }
            }
        });
    }

    onEdit($event: any) {
        this.turnOnLoading();
        this.contraService.getFormEdit($event.cna_id).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.form = res.form.form;
                this.formmed = res.form.formmed;
                this.personService.loadDataToform(this.formref, res.form.formper);
                this.isShowFormCrea = true;
                this.calcularEdad();
            }
        });
    }

    onAnula($event: any) {
        this.swalService.fireDialog(this.ctes.msgSureWishAnulRecord, '').then(confirm => {
            if (confirm.value) {
                this.contraService.anular({ form: $event }).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadContratosRef();
                    }
                });
            }
        });
    }

    showFormCrea() {
        this.isShowFormCrea = true;
    }

}
