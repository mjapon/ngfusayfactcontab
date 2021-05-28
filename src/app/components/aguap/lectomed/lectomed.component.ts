import {Component, OnInit} from '@angular/core';
import {LectomedaguaService} from '../../../services/agua/lectomedagua.service';
import {SwalService} from '../../../services/swal.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {DomService} from '../../../services/dom.service';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {MenuItem} from 'primeng/api';
import {PersonaService} from '../../../services/persona.service';
import {BaseComponent} from '../../shared/base.component';
import {CobroaguaService} from '../../../services/agua/cobroagua.service';


@Component({
    selector: 'app-lectomed',
    templateUrl: './lectomed.component.html'
})
export class LectomedComponent extends BaseComponent implements OnInit {
    isLoading = false;
    form: any = {};
    meses: Array<any> = [];
    anios: Array<any> = [];
    validfl: Array<any> = [];
    lastlectomed: any = null;
    previulectomed: any = null;
    medsel: any = {};
    currentStep = 0;
    tipoBusqueda = 1;
    steps: MenuItem[] = [];
    medidores: Array<any> = [];

    constructor(private lectomedService: LectomedaguaService,
                private contraguaServ: ContratoaguaService,
                private cobroAguaServ: CobroaguaService,
                private loadingServ: LoadingUiService,
                private personaService: PersonaService,
                private router: Router,
                private domService: DomService,
                private ctes: CtesAguapService,
                private swalService: SwalService) {
        super();
    }

    ngOnInit(): void {
        this.loadForm();
    }

    onEnterRef() {
        if (this.cobroAguaServ.validaPaso1(this.form)) {
            this.doNext(1);
        }
    }

    onRefSelect() {
        this.domService.setFocusTm(this.ctes.btnNextS('1'), 100);
        this.doNext(1);
    }

    loadMedidores() {
        this.loadingServ.publishBlockMessage();
        this.contraguaServ.findByRef(this.form.referente.per_id).subscribe(res => {
            this.medidores = res.items;
            if (this.medidores.length === 1) {
                this.medsel = this.medidores[0];
                this.setDatosMedToForm();
            }
        });
    }

    onSelectMed($event: any) {
        this.medsel = $event;
        this.doNext(2);
    }

    doNext(step: any) {
        this.currentStep = step;
        if (this.currentStep === 1) {
            this.loadMedidores();
        } else if (this.currentStep === 2) {
            this.loadLastLectoMed();
            this.loadPreviusLectoMed();
        }
    }

    doBack(step: number) {
        this.currentStep = step;
    }

    setDatosMedToForm() {
        this.form.mdg_num = this.medsel.mdg_num;
        this.form.mdg_id = this.medsel.mdg_id;
    }

    loadForm() {
        this.isLoading = true;
        this.lectomedService.getForm().subscribe(res => {
            this.isLoading = false;
            this.form = res.form.form;
            this.meses = res.form.meses;
            this.anios = res.form.anios;
            this.validfl = res.form.vfl;
            this.steps = res.form.steps;
            this.domService.setFocusTm(this.ctes.refAutoCom);
        });
    }

    loadLastLectoMed() {
        this.lastlectomed = null;
        this.loadingServ.publishBlockMessage();
        this.lectomedService.getLast(this.form.mdg_num).subscribe(res => {
            if (this.isResultOk(res)) {
                this.lastlectomed = res.lectomed;
            }
        });
    }

    loadPreviusLectoMed() {
        this.previulectomed = null;
        this.form.lmd_valorant = 0;
        this.loadingServ.publishBlockMessage();
        this.lectomedService.getPrevius(this.medsel.mdg_num, this.form.lmd_anio, this.form.lmd_mes).subscribe(res => {
            if (this.isResultOk(res)) {
                this.previulectomed = res.lectomed;
                this.form.lmd_valorant = this.previulectomed.lmd_valor;
                this.domService.setFocusTm(this.ctes.lmd_valor);
            } else {
                this.domService.setFocusTm(this.ctes.lmd_valorant);
            }
        });
    }

    doSave() {
        const isValidMed = this.domService.validFormData(this.form, this.validfl);
        if (!isValidMed) {
            return;
        }
        this.swalService.fireDialog(this.ctes.msgConfirmSave, '').then(confirm => {
            if (confirm.value) {
                this.loadingServ.publishBlockMessage();
                this.lectomedService.guardar(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.clear();
                    }
                });
            }
        });
    }

    clear() {
        this.currentStep = 0;
        this.loadForm();
    }

    calculaConsumo() {
        this.form.lmd_consumo = this.lectomedService.generaConsumo(this.form);
    }

    gotoMain() {
        this.router.navigate([this.ctes.rutaHome]);
    }

    doCancel() {
        this.gotoMain();
    }

    onAnioChange() {
        this.loadPreviusLectoMed();
    }

    onMesChange() {
        this.loadPreviusLectoMed();
    }

    onEnterMed() {
        console.log('On enter med--->');
    }

    onSelMedFromBus() {
        this.medsel = this.form.medidor;
        this.setDatosMedToForm();
        this.loadingServ.publishBlockMessage();
        this.personaService.buscarPorCod(this.medsel.per_id).subscribe(res => {
            if (this.isResultOk(res)) {
                this.form.referente = res.persona;
                this.medidores = [this.medsel];
                this.currentStep = 1;
            }
        });
    }

    changeFocusBusca($ev) {
        this.tipoBusqueda = $ev;
        if (this.tipoBusqueda === 1) {
            this.domService.setFocusTm(this.ctes.refAutoCom);
        } else {
            this.domService.setFocusTm(this.ctes.medAutoCom);
        }
    }
}
