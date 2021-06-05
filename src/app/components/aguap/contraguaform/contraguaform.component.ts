import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {FechasService} from '../../../services/fechas.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {DomService} from '../../../services/dom.service';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {BaseComponent} from '../../shared/base.component';

@Component({
    selector: 'app-contraguaform',
    templateUrl: './contraguaform.component.html'
})
export class ContraguaformComponent extends BaseComponent implements OnInit {
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

    constructor(private router: Router,
                private fechasService: FechasService,
                private domService: DomService,
                private swalService: SwalService,
                private personService: PersonaService,
                private loadingService: LoadingUiService,
                private ctes: CtesAguapService,
                private contraService: ContratoaguaService) {
        super();
    }

    ngOnInit(): void {
        this.loadForm();
    }

    gotomain() {
        this.router.navigate([this.ctes.rutaHome]);
    }

    cancelar() {
        this.gotomain();
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
                this.domService.setFocus(this.ctes.cna_tarifa);
            } else {
                this.domService.setFocus(this.ctes.per_nombres);
            }
            this.isRefSearched = false;
        });
    }

    loadContratosRef() {
        this.contraService.findByRef(this.formref.per_id).subscribe(res => {
            if (res.items && res.items.length > 0) {
                this.swalService.fireToastInfo(this.ctes.msgRefTieneMed);
                this.contratosPrevios = res.items;
            }
        });
    }

    calcularEdad() {
        this.personService.setPerEdad(this.formref, true);
        this.isTercedad = this.personService.isTercedad(this.formref, this.teredad);
        this.form.cna_teredad = this.isTercedad;
        if (this.isTercedad) {
            this.swalService.fireToastInfo(this.ctes.msgAplTarfTercedad);
        }
    }

    toggleTercedad() {
        this.form.cna_teredad = !this.form.cna_teredad;
    }

    guardar() {
        const vfieldref = this.personService.getBasicValidFieldList();
        const isValidRef = this.domService.validFormData(this.formref, vfieldref);

        if (!isValidRef) {
            return;
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
        const form = {
            form: this.form,
            formref: this.formref,
            formmed: this.formmed
        };
        this.loadingService.publishBlockMessage();
        this.swalService.fireDialog(this.ctes.msgConfirmSave, '').then(confirm => {
            if (confirm.value) {
                this.loadingService.publishBlockMessage();
                this.contraService.crear(form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.gotomain();
                    }
                });
            }
        });
    }
}
