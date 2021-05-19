import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {FechasService} from '../../../services/fechas.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {DomService} from '../../../services/dom.service';
import {CtesAguapService} from '../utils/ctes-aguap.service';

@Component({
    selector: 'app-contraguaform',
    templateUrl: './contraguaform.component.html'
})
export class ContraguaformComponent implements OnInit {
    isLoading = false;
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
    }

    ngOnInit(): void {
        this.loadForm();
    }

    gotomain() {
        this.router.navigate([this.ctes.rutaContra()]);
    }

    cancelar() {
        this.gotomain();
    }

    loadForm() {
        this.isLoading = true;
        this.contraService.getForm(this.tipoContra).subscribe(res => {
            this.isLoading = false;
            this.form = res.form.form;
            this.formref = res.form.formper;
            this.tarifas = res.form.tarifas;
            this.comunidades = res.form.comunidades;
            this.formmed = res.form.formmed;
            this.teredad = res.form.teredad;
            this.validfl = res.form.validfl;
            this.domService.setFocusTimeout(this.ctes.lblPerCirucInput(), 100);
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
            if (res.status === 200) {
                this.swalService.fireToastSuccess('Referente registrado');
                this.personService.loadDataToform(this.formref, res.persona);
                this.loadContratosRef();
                this.calcularEdad();
                this.domService.setFocus('cna_tarifa');
            } else {
                this.domService.setFocus('per_nombres');
            }
            this.isRefSearched = false;
        });
    }

    loadContratosRef() {
        this.contraService.findByRef(this.formref.per_id).subscribe(res => {
            if (res.items && res.items.length > 0) {
                this.swalService.fireToastInfo('El referente ya tiene registrado medidores');
                this.contratosPrevios = res.items;
            }
        });
    }

    calcularEdad() {
        this.personService.setPerEdad(this.formref, true);
        this.isTercedad = this.personService.isTercedad(this.formref, this.teredad);
        this.form.cna_teredad = this.isTercedad;
        if (this.isTercedad) {
            this.swalService.fireToastInfo('Aplica tarifa tercera edad');
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
        this.swalService.fireDialog('¿Confirma que desea registrar la información ingresada?', '').then(confirm => {
            if (confirm.value) {
                this.loadingService.publishBlockMessage();
                this.contraService.crear(form).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.gotomain();
                    }
                });
            }
        });
    }
}
