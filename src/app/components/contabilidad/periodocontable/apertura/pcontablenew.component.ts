import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "src/app/components/shared/base.component";
import {AsientoService} from "src/app/services/asiento.service";
import {PeriodoContableService} from "src/app/services/contable/periodocontab.service";
import {DomService} from "src/app/services/dom.service";
import {FechasService} from "src/app/services/fechas.service";
import {LoadingUiService} from "src/app/services/loading-ui.service";
import {SwalService} from "src/app/services/swal.service";
import {NumberService} from "src/app/services/number.service";

@Component({
    selector: 'app-pcontablenew',
    templateUrl: './pcontablenew.component.html'
})
export class PcontableNewComponent extends BaseComponent implements OnInit {
    pactual: any = { pc_id: 0 };
    panterior: any = { pc_id: 0 };
    form: any = {
        desde: '', desde_obj: new Date(),
        hasta: '', hasta_obj: new Date()
    }
    isLoading = false;

    loadedSaldos = false;

    datosbalance: any;
    resultadoejercicio = 0.0;
    ctas_activo = [];
    ctas_pasivo = [];
    ctas_patrimonio = [];
    cta_contab_result = '0';
    fila_resultados: any = {};
    fila_util_acum: any = {};

    formasiento: any;
    formref: any;
    formdet: any;

    asiIni: any = {
        formcab: {},
        formref: {},
        detalles: []
    };

    totales = { debe: 0.0, haber: 0.0 };
    isOpenCurrenPer = false;


    constructor(
        private fechasService: FechasService,
        private loadingUiServ: LoadingUiService,
        private swalService: SwalService,
        private numberServ: NumberService,
        private domService: DomService,
        private periodoContableServ: PeriodoContableService,
        private asientoService: AsientoService
    ) {
        super();
    }
    ngOnInit(): void {

        this.loadPeriodoActual();
    }

    sumarAnio() {
        const initDate = new Date(this.form.desde_obj);
        const hasta =
            this.fechasService.getEndYearDate(initDate);
        this.form.hasta_obj = hasta;

    }
    loadPeriodoActual() {

        this.sumarAnio();
        this.periodoContableServ.getCurrent().subscribe(res => {
            console.log('res', res);
            if (res.periodo) {
                this.pactual = res.periodo;
                this.isOpenCurrenPer = true;
                this.swalService.fireInfo('Ya existe un periodo contable activo');
            }
        });
        this.periodoContableServ.getAnterior().subscribe(resa => {
            if (resa.existe) {
                this.panterior = resa.periodo;
                const newInitDate = this.fechasService.parseString(this.panterior.pc_hasta);
                this.form.desde_obj = this.fechasService.sumarDias(newInitDate, 1);
                this.fila_util_acum = resa.info_cta_util_acum;
                this.sumarAnio();
            }
        });

    }


    loadSaldos() {
        this.loadedSaldos = true;
        this.loadingUiServ.publishBlockMessage();
        const desdestr = this.panterior.pc_desde;
        const hastastr = this.panterior.pc_hasta;

        this.asientoService.getBalanceGeneral(desdestr, hastastr, '0').subscribe(res => {
            this.cta_contab_result = res.cta_contab_result;
            this.datosbalance = res.balance;
            this.resultadoejercicio = res.resultado_ejercicio;
            this.filterBalanceInfo();
            this.crearAsientosApertura();
        });

    }

    filterOnlyChilds(ctasList, ctastr) {
        return ctasList.filter(it => it.ic_code.startsWith(ctastr) && it.total != 0);
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
        ctas.forEach(cta => newItemsAsi.push(this.createItemAsiento(cta, dt_debito, cta.total)));
        return newItemsAsi;

    }
    crearAsientosApertura() {

        this.asientoService.getAsientoForm().subscribe(res => {
            if (res.status === 200) {
                this.formasiento = res.form.formasiento;
                this.formref = res.form.formref;
                this.formdet = res.form.formdet;

                let filaUtilAcumuladas = this.createItemAsiento(this.fila_util_acum, -1, this.resultadoejercicio);

                this.asiIni.formref = this.domService.clonarObjeto(this.formref);
                this.asiIni.formcab = this.domService.clonarObjeto(this.formasiento);
                this.asiIni.formcab.trn_observ = 'p/r Estado de situacion inicial';
                const detActivos = this.createItemsAsiento(this.ctas_activo, 1);
                const detPasivo = this.createItemsAsiento(this.ctas_pasivo, -1);
                const detPatrimonio = this.createItemsAsiento(this.ctas_patrimonio, -1);
                detPatrimonio.push(filaUtilAcumuladas);
                detActivos.push(...detPasivo);
                detActivos.push(...detPatrimonio);

                this.asiIni.detalles = detActivos;

                this.totales = this.totalizar(this.asiIni.detalles);

                if (this.totales.debe !== this.totales.haber) {
                    this.swalService.fireToastWarn('No coinciden los saldos, favor verificar');
                }
                else{
                    this.swalService.fireToastSuccess('Saldos iguales')
                }
            }
        });
    }

    guardar(){

        this.swalService.fireDialog('¿Confirma que desea aperturar periodo contable?')
        .then(confirm=>{
            if (confirm.value){
                const fechaAsientoStr = this.fechasService.formatDate(this.form.desde_obj);
                this.asiIni.formcab.trn_fecreg = fechaAsientoStr;

                this.form.desde = this.fechasService.formatDate(this.form.desde_obj);
                this.form.hasta = this.fechasService.formatDate(this.form.hasta_obj);
                this.form.asiento = this.asiIni;
                
                this.loadingUiServ.publishBlockMessage();
                this.periodoContableServ.abrir(this.form).subscribe(res=>{
                    this.loadingUiServ.publishUnblockMessage();
                    if (res.status === 200){
                        this.swalService.fireSuccess(res.msg);
                        this.isOpenCurrenPer = true;
                    }
                    else if (res.msg){
                        this.swalService.fireError(res.msg);
                    }
                });

            }

        });
    
    }


}