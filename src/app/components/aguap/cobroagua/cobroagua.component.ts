import {Component, OnInit} from '@angular/core';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {Router} from '@angular/router';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {DomService} from '../../../services/dom.service';
import {MenuItem} from 'primeng/api';
import {CobroaguaService} from '../../../services/agua/cobroagua.service';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {LectomedaguaService} from '../../../services/agua/lectomedagua.service';

@Component({
    selector: 'app-cobroagua',
    templateUrl: './cobroagua.component.html'
})
export class CobroaguaComponent implements OnInit {
    isLoading = false;
    form: any = {};
    personFiltered: Array<any> = [];
    currentStep = 0;
    steps: MenuItem[] = [];
    medidores: Array<any> = [];
    consumos: Array<any> = [];
    medsel: any = {};
    hasPagosPend = false;
    hasLecturas = false;
    lastPago = {};
    msgEstadoPago = '';

    constructor(private ctes: CtesAguapService,
                private swalService: SwalService,
                private domService: DomService,
                private loadingServ: LoadingUiService,
                private lectoMedServ: LectomedaguaService,
                private personaService: PersonaService,
                private contratoAguaService: ContratoaguaService,
                private cobroAguaServ: CobroaguaService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.isLoading = true;
        this.cobroAguaServ.getForm().subscribe(res => {
            this.isLoading = false;
            this.form = res.form.form;
            this.steps = res.form.steps;
            this.domService.setFocusTm(this.ctes.refAutoCom, 100);
        });
    }

    loadMedidores() {
        this.loadingServ.publishBlockMessage();
        this.contratoAguaService.findByRef(this.form.referente.per_id).subscribe(res => {
            this.medidores = res.items;
            if (this.medidores.length === 1) {
                this.medsel = this.medidores[0];
            }
        });
    }

    clearEstadoPago() {
        this.consumos = [];
        this.hasPagosPend = false;
        this.msgEstadoPago = '';
    }

    loadConsumosInpagos() {
        this.loadingServ.publishBlockMessage();
        this.clearEstadoPago();
        this.lectoMedServ.getConsumosPend(this.medsel.mdg_id).subscribe(res => {
            if (res.status === 200) {
                this.msgEstadoPago = res.msg;
                this.hasLecturas = res.has_lecturas;
                if (!this.hasLecturas) {
                    this.swalService.fireToastWarn(res.msg);
                } else {
                    this.consumos = res.lecturaspend;
                    this.hasPagosPend = res.has_pagos_pend;
                    this.lastPago = res.lastpago;
                    if (this.hasPagosPend) {
                        this.swalService.fireToastWarn(this.msgEstadoPago);
                        this.loadDatosPagos();
                    } else {
                        this.swalService.fireToastSuccess(this.msgEstadoPago);
                    }
                }
            }
        });
    }

    loadDatosPagos() {
        this.loadingServ.publishBlockMessage();
        this.form.lecturas = this.cobroAguaServ.getIds(this.consumos);
        this.cobroAguaServ.getDatosPago(this.form.lecturas).subscribe(res => {
            if (res.status === 200) {
                this.form.montos = res.datospago;
            }
        });
    }

    doCancel() {
        this.router.navigate([this.ctes.rutaHome]);
    }

    doSave() {
        this.swalService.fireDialog(this.ctes.msgConfirmSave).then(confirm => {
            if (confirm.value) {
                this.form.datosmed = this.medsel;

                console.log('Logica creacion de factura de pago de agua');
            }
        });
    }

    findRefs($event: any) {
        this.personaService.buscarPorNomapelCiPag($event.query, 0).subscribe(res => {
            if (res.status === 200) {
                this.personFiltered = res.items;
            }
        });
    }

    onRefSelect() {
        this.domService.setFocusTm(this.ctes.btnNextS('1'), 100);
        this.doNext(1);
    }

    doNext(step: any) {
        this.currentStep = step;
        if (this.currentStep === 1) {
            this.loadMedidores();
        } else if (this.currentStep === 2) {
            this.loadConsumosInpagos();
        }
    }

    doBack(step: number) {
        this.currentStep = step;
    }

    onEnterRef() {
        if (this.cobroAguaServ.validaPaso1(this.form)) {
            this.doNext(1);
        }
    }

    onSelectMed($event: any) {
        this.medsel = $event;
        this.doNext(2);
    }
}
