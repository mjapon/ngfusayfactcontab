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
import {AsientoService} from '../../../services/asiento.service';
import {BaseComponent} from '../../shared/base.component';

@Component({
    selector: 'app-cobroagua',
    templateUrl: './cobroagua.component.html'
})
export class CobroaguaComponent extends BaseComponent implements OnInit {
    isLoading = false;
    form: any = {};
    currentStep = 0;
    steps: MenuItem[] = [];
    medidores: Array<any> = [];
    consumos: Array<any> = [];
    medsel: any = {};
    hasPagosPend = false;
    hasLecturas = false;
    lastPago: any = {};
    msgEstadoPago = '';
    facturaPago: any = {};
    isShowFact = false;
    tipoBusqueda = 1;

    constructor(private ctes: CtesAguapService,
                private swalService: SwalService,
                private domService: DomService,
                private loadingServ: LoadingUiService,
                private lectoMedServ: LectomedaguaService,
                private personaService: PersonaService,
                private contratoAguaService: ContratoaguaService,
                private cobroAguaServ: CobroaguaService,
                private asientoService: AsientoService,
                private lectomedService: LectomedaguaService,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.loadForm();
    }

    setDatosMedToForm() {
        this.form.mdg_num = this.medsel.mdg_num;
        this.form.mdg_id = this.medsel.mdg_id;
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
        this.hasLecturas = false;
        this.form.montos.formcab = null;
    }

    anularConsumo(consumo) {

    }

    loadConsumosInpagos() {
        this.loadingServ.publishBlockMessage();
        this.clearEstadoPago();
        this.lectoMedServ.getConsumosPend(this.medsel.mdg_id).subscribe(res => {
            if (this.isResultOk(res)) {
                this.form.montos.formcab = {};
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
                        this.loadUltPago();
                    }
                }
            }
        });
    }

    loadUltPago() {
        this.asientoService.getDoc(this.lastPago.trn_codigo).subscribe(res => {
            if (this.isResultOk(res)) {
                this.facturaPago = res.doc;
            }
        });
    }

    loadDatosPagos() {
        this.loadingServ.publishBlockMessage();
        this.form.lecturas = this.cobroAguaServ.getIds(this.consumos);
        this.cobroAguaServ.getDatosPago(this.form.lecturas).subscribe(res => {
            if (this.isResultOk(res)) {
                this.form.montos = res.datospago;
            }
        });
    }

    doCancel() {
        this.router.navigate([this.ctes.rutaHome]);
    }

    getParamsComproAgua(trn) {
        const params = {
            trn,
            pexceso: this.form.montos?.consumo_exceso,
            pvconsumo: this.form.montos?.costobase + this.form.montos?.comision_mavil,
            pvexceso: this.form.montos?.costoexceso,
            pvsubt: this.form.montos?.costobase + this.form.montos?.costoexceso,
            pvdesc: this.form.montos?.descuento,
            pvmulta: this.form.montos?.multa,
            pvtotal: this.form.montos?.total,
            pfechamaxpago: this.form.montos?.fecha_max_pago
        };
        return params;
    }

    doSave() {
        this.swalService.fireDialog(this.ctes.msgConfirmSave).then(confirm => {
            if (confirm.value) {
                this.loadingServ.publishBlockMessage();
                this.cobroAguaServ.crearFactura(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadConsumosInpagos();
                        this.swalService.fireDialog(res.msg, '').then(confprint => {
                            if (confprint.value) {
                                this.asientoService.imprimirComproAgua(this.getParamsComproAgua(res.trncod));
                            }
                        });
                    }
                });
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

    verFactura() {
        this.isShowFact = true;
    }

    closeDetFact() {
        this.isShowFact = false;
    }

    doFinish() {
        this.currentStep = 0;
        this.loadForm();
    }

    imprimirComproAgua() {
        this.cobroAguaServ.getDetallesPago(this.lastPago.trn_codigo).subscribe(res => {
            if (this.isResultOk(res)) {
                const params = res.datospago.pg_json_obj;
                params.trncod = this.lastPago.trn_codigo;
                this.asientoService.imprimirComproAgua(params);
            }
        });
    }

    anularCobro() {
        this.swalService.fireDialog(this.ctes.msgSureWishAnulRecord).then(confirm => {
            if (confirm.value) {
                this.loadingServ.publishBlockMessage();
                this.cobroAguaServ.anular(this.lastPago.pg_id).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadConsumosInpagos();
                    }
                });
            }
        });
    }


    anulaLectura(fila: any) {
        this.swalService.fireDialog(this.ctes.msgSureWishAnulRecord).then(confirm => {
            if (confirm.value) {
                this.lectomedService.anular(fila).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadConsumosInpagos();
                    }
                });
            }
        });
    }
}
