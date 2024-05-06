import { Component, OnInit } from "@angular/core";
import { PeriodoContableService } from "src/app/services/contable/periodocontab.service";
import { FechasService } from "src/app/services/fechas.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../../../shared/base.component";
import { LoadingUiService } from "src/app/services/loading-ui.service";
import { AsientoService } from "src/app/services/asiento.service";
import { DomService } from "src/app/services/dom.service";
import { NumberService } from "src/app/services/number.service";
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-pcontablecierre',
    templateUrl: './pcontablecierre.component.html',
    styles: [
        `.haberl {
            margin-left: 70px;
        }
        `]
})
export class PcontableCierreComponent extends BaseComponent implements OnInit {

    isLoading = false;
    form = { fecha_cierre_obj: new Date(), fecha_cierre:'', pc_id:0, asientos:[]};
    pactual: any = {};
    currentdate = new Date();
    fechacierre = new Date();

    formasiento: any;
    formref: any;
    formdet: any;

    datosbalance: any;
    resultadoejercicio = 0.0;

    datosresultados: any;

    ctas_activo = [];
    ctas_pasivo = [];
    ctas_patrimonio = [];
    ctas_gasto = [];
    ctas_ingreso = [];

    cta_contab_result = '0';
    fila_resultados: any = {};
    loadedSaldos = false;
    closedCurrentPer = false;

    totales = {
        activo: { debe: 0.0, haber: 0.0 },
        pasivo: { debe: 0.0, haber: 0.0 },
        patrimonio: { debe: 0.0, haber: 0.0 },
        ingreso: { debe: 0.0, haber: 0.0 },
        gasto: { debe: 0.0, haber: 0.0 },
    }

    asiActivo: any = {
        formcab: {},
        formref: {},
        detalles: []
    };
    asiPasivo: any = {
        formcab: {},
        formref: {},
        detalles: []
    };
    asiPatrimonio: any = {
        formcab: {},
        formref: {},
        detalles: []
    };
    asiIngresos: any = {
        formcab: {},
        formref: {},
        detalles: []
    };
    asiGastos: any = {
        formcab: {},
        formref: {},
        detalles: []
    };

    constructor(private fechasService: FechasService,
        private swalService: SwalService,
        private domService: DomService,
        private numberServ: NumberService,
        private loadingUiServ: LoadingUiService,
        private asientoService: AsientoService,
        private periodoContabService: PeriodoContableService
    ) {
        super();

    }

    ngOnInit(): void {
        this.loadPeriodoActual();
    }

    loadPeriodoActual() {
        this.turnOnLoading();
        this.periodoContabService.getCurrent().subscribe(res => {
            this.turnOffLoading();
            if (res.periodo) {
                this.pactual = res.periodo;
                console.log('res', this.pactual, res.periodo, res);
                this.form.fecha_cierre_obj = this.fechasService.parseString(this.pactual.pc_hasta);
                this.form.pc_id=this.pactual.pc_id;
                this.fechacierre = this.fechasService.sumarDias(
                    this.fechasService.parseString(this.pactual.pc_hasta)    , 1);
            }
            else{
                this.swalService.fireWarning('No existe un periodo contable activo');
            }
        });
    }

    createItemAsiento(cta, dt_debito, total) {
        let newAsiRow = this.domService.clonarObjeto(this.formdet)
        newAsiRow.cta_codigo = cta.ic_id;
        newAsiRow.ic_nombre = cta.ic_nombre;
        newAsiRow.ic_code = cta.ic_code;
        newAsiRow.per_codigo = 0;
        newAsiRow.dt_cant = 1;
        newAsiRow.dt_valor = Math.abs(total);
        newAsiRow.dt_debito = dt_debito;
        return newAsiRow;
    }

    createItemsAsiento(ctas, dt_debito) {
        let newItemsAsi = [];
        let filaResult = this.createItemAsiento(this.fila_resultados, dt_debito * -1, 0);
        ctas.forEach(cta => newItemsAsi.push(this.createItemAsiento(cta, dt_debito, cta.total)));
        const totales = this.totalizar(newItemsAsi);

        if (ctas.length > 0) {
            if (dt_debito === 1) {
                filaResult.dt_valor = Math.abs(totales.debe);
                newItemsAsi.push(filaResult);
            }
            else {
                filaResult.dt_valor = Math.abs(totales.haber);
                const auxNewItemsAsi = [];
                auxNewItemsAsi.push(filaResult);
                auxNewItemsAsi.push.apply(auxNewItemsAsi, newItemsAsi);
                newItemsAsi = auxNewItemsAsi;
            }
        }
        return newItemsAsi;

    }

    totalizar(detalles) {
        let totaldebe = 0.0;
        let totalhaber = 0.0;
        detalles.forEach(item => {
            if (item.dt_debito === 1) {
                totaldebe += Number(item.dt_valor);
            } else {
                totalhaber += Number(item.dt_valor);
            }
        });
        let totales = { debe: 0.0, haber: 0.0 }
        totales.debe = this.numberServ.round2(totaldebe);
        totales.haber = this.numberServ.round2(totalhaber);
        return totales;
    }

    crearAsientosCierre() {

        this.asientoService.getAsientoForm().subscribe(res => {
            if (res.status === 200) {
                this.formasiento = res.form.formasiento;
                this.formref = res.form.formref;
                this.formdet = res.form.formdet;

                //activo
                this.asiActivo.formref = this.domService.clonarObjeto(this.formref);
                this.asiActivo.formcab = this.domService.clonarObjeto(this.formasiento);
                this.asiActivo.formcab.trn_observ = 'p/r Cierre de cuentas del activo'
                this.asiActivo.detalles = this.createItemsAsiento(this.ctas_activo, -1);
                this.totales.activo = this.totalizar(this.asiActivo.detalles);

                //pasivo
                this.asiPasivo.formref = this.domService.clonarObjeto(this.formref);
                this.asiPasivo.formcab = this.domService.clonarObjeto(this.formasiento);
                this.asiPasivo.formcab.trn_observ = 'p/r Cierre de cuentas del pasivo'
                this.asiPasivo.detalles = this.createItemsAsiento(this.ctas_pasivo, 1);
                this.totales.pasivo = this.totalizar(this.asiPasivo.detalles);

                //patrimonio
                this.asiPatrimonio.formref = this.domService.clonarObjeto(this.formref);
                this.asiPatrimonio.formcab = this.domService.clonarObjeto(this.formasiento);
                this.asiPatrimonio.formcab.trn_observ = 'p/r Cierre de cuentas del patrimonio'
                this.asiPatrimonio.detalles = this.createItemsAsiento(this.ctas_patrimonio, 1);
                this.totales.patrimonio = this.totalizar(this.asiPatrimonio.detalles);

                //ingreso
                this.asiIngresos.formref = this.domService.clonarObjeto(this.formref);
                this.asiIngresos.formcab = this.domService.clonarObjeto(this.formasiento);
                this.asiIngresos.formcab.trn_observ = 'p/r Cierre de cuentas de ingreso'
                this.asiIngresos.detalles = this.createItemsAsiento(this.ctas_ingreso, 1);
                this.totales.ingreso = this.totalizar(this.asiIngresos.detalles);

                //gasto
                this.asiGastos.formref = this.domService.clonarObjeto(this.formref);
                this.asiGastos.formcab = this.domService.clonarObjeto(this.formasiento);
                this.asiGastos.formcab.trn_observ = 'p/r Cierre de cuentas de gasto'
                this.asiGastos.detalles = this.createItemsAsiento(this.ctas_gasto, -1);
                this.totales.gasto = this.totalizar(this.asiGastos.detalles);
            }
        });

    }

    loadSaldos() {
        this.loadedSaldos =true;
        this.loadingUiServ.publishBlockMessage();
        const desdestr = this.pactual.pc_desde;
        const hastastr = this.fechasService.formatDate(this.form.fecha_cierre_obj);

        const promiseBalance = this.asientoService.getBalanceGeneral(desdestr, hastastr);
        const promiseResultados = this.asientoService.getEstadoResultados(desdestr, hastastr);

        forkJoin([promiseBalance, promiseResultados]).subscribe(res => {
            this.loadingUiServ.publishUnblockMessage();
            const res0 = res[0];
            const res1 = res[1];
            if (res0.status === 200) {
                this.cta_contab_result = res0.cta_contab_result;
                this.datosbalance = res0.balance;
                this.resultadoejercicio = res0.resultado_ejercicio;
                this.filterBalanceInfo();
            }
            if (res1.status === 200) {
                this.datosresultados = res1.reporte_list;
                this.filterResultsBalanceInfo();
            }

            this.crearAsientosCierre();
        });
    }

    filterOnlyChilds(ctasList, ctastr) {
        return ctasList.filter(it => it.ic_code.startsWith(ctastr) && it.total != 0);
    }

    filterBalanceInfo() {
        if (this.datosbalance) {
            const filaResult = this.datosbalance.filter(it => it.ic_code === this.cta_contab_result);
            if (filaResult && filaResult.length > 0) {
                this.fila_resultados = filaResult[0];
            }
            const onlychilds = this.datosbalance.filter(it => !it.ic_haschild && it.ic_code !== this.cta_contab_result);
            this.ctas_activo = this.filterOnlyChilds(onlychilds, '1.');
            this.ctas_pasivo = this.filterOnlyChilds(onlychilds, '2.');
            this.ctas_patrimonio = this.filterOnlyChilds(onlychilds, '3.');
        }
    }

    filterResultsBalanceInfo() {
        if (this.datosresultados) {
            const onlychilds = this.datosresultados.filter(it => !it.ic_haschild);
            this.ctas_gasto = this.filterOnlyChilds(onlychilds, '4.');
            this.ctas_ingreso = this.filterOnlyChilds(onlychilds, '5.');
        }

    }

    cerrarPeriodo(){
        this.swalService.fireDialog('¿Seguro que desea cerrar el periodo contable actual?')
        .then(confirm=>{
            if (confirm.value) {
                const asientos = [];
                let fechaAsiento = new Date(this.fechacierre);
                const fechaCierreStr = this.fechasService.formatDate(fechaAsiento);

                if (this.asiActivo.detalles.length > 0) {
                    this.asiActivo.formcab.trn_fecreg = fechaCierreStr;
                    asientos.push(this.asiActivo);
                }

                if (this.asiPasivo.detalles.length > 0) {
                    this.asiPasivo.formcab.trn_fecreg = fechaCierreStr;
                    asientos.push(this.asiPasivo);
                }
                if (this.asiPatrimonio.detalles.length > 0) {
                    this.asiPatrimonio.formcab.trn_fecreg = fechaCierreStr;
                    asientos.push(this.asiPatrimonio);
                }
                if (this.asiIngresos.detalles.length > 0) {
                    this.asiIngresos.formcab.trn_fecreg = fechaCierreStr;
                    asientos.push(this.asiIngresos);
                }
                if (this.asiGastos.detalles.length > 0) {
                    this.asiGastos.formcab.trn_fecreg = fechaCierreStr;
                    asientos.push(this.asiGastos);
                }
                this.form.fecha_cierre = this.fechasService.formatDate(this.form.fecha_cierre_obj);
                this.form.asientos = asientos;
                this.loadingUiServ.publishBlockMessage();
                    this.periodoContabService.cerrar(this.form).subscribe(res=>{
                        this.loadingUiServ.publishUnblockMessage();
                        if (res.status===200){
                            this.swalService.fireSuccess(res.msg);
                            this.closedCurrentPer = true;
                        }
                    });
            }
        });
    }
}