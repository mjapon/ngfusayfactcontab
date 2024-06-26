import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseComponent} from 'src/app/components/shared/base.component';
import {CtesService} from 'src/app/services/ctes.service';
import {FechasService} from 'src/app/services/fechas.service';
import {FinanCreditosService} from 'src/app/services/finan/finacreditos.service';
import {FinanPagosService} from 'src/app/services/finan/finapagos.service';
import {NumberService} from 'src/app/services/number.service';
import {RxdocsService} from 'src/app/services/rxdocs.service';
import {SwalService} from 'src/app/services/swal.service';
import {Router} from '@angular/router';
import {CtesFinanService} from '../../ctesfina.service';

@Component({
    selector: 'app-finpagosview',
    templateUrl: './pagosview.component.html'
})
export class FinanPagosViewComponent extends BaseComponent implements OnInit, OnChanges {

    @Input() cred = 0;
    gridpagos: any = {};
    datoscred: any = {};
    isModalPagosVisible = false;
    isModalAnulaVisible = false;
    isModalDatosPagoVisible = false;
    isModalMarcaPagadosVisible = false;
    formcobro: any = {};
    formcalcobro: any = {};
    formanul: any = {obs: ''};
    pagoAnulSel: any = {};
    selectedCuotas: Array<any> = [];
    puedeCambiarPagos = false;
    datosPago: any = {};
    ctapagosel: any = {};
    showInputAbono = false;

    datafile: any;
    filepreview: any;
    base64data: any = null;
    adjisimage = false;
    aux_pgc_total = 0.0;
    isSavingPago = false;
    loadingInfoPago = false;
    saldo_total = 0.0;
    isShowDetAsi = false;
    trn_codigo_pago = 0;
    filapagosel = {};
    datosCancelacion = {};

    constructor(private swalService: SwalService,
                private credService: FinanCreditosService,
                private ctes: CtesService,
                private router: Router,
                private ctesFinanServ: CtesFinanService,
                private adjService: RxdocsService,
                private numberService: NumberService,
                private fechasService: FechasService,
                private pagosService: FinanPagosService) {
        super();

        this.isRowSelectable = this.isRowSelectable.bind(this);

    }

    ngOnInit(): void {
        this.initGridPagos();
    }

    ngOnChanges(changes: SimpleChanges) {
        const changeCred = changes.cred;
        if (changeCred.currentValue) {
            this.loadDatosPagosCred();
        }
    }

    calcularAbonoTotalPend() {
        let totalcapital = 0.0;
        this.formcobro.cuotaspagar.forEach(cuota => {
            totalcapital += cuota.pg_capital;
        });
        this.formcobro.pgc_adelanto = this.numberService.round2(this.datoscred.cre_saldopend - totalcapital);
        this.onAbonoCapitalChange();
    }

    loadDatosPagosCred() {
        this.loadTablaPagos();
        this.loadDatosCredito();
    }

    hideDetAsi() {
        this.isShowDetAsi = false;
    }

    verAsientoPago() {
        this.trn_codigo_pago = this.datosPago.trncod;
        this.isShowDetAsi = true;
    }

    initGridPagos() {
        this.gridpagos = {cols: [], tabla: []};
    }

    loadDatosCredito() {
        this.puedeCambiarPagos = true;
        this.credService.getDatosCred(this.cred).subscribe(res => {
            if (this.isResultOk(res)) {
                this.datoscred = res.datoscred;
                if (this.datoscred.cre_estado === 4 || this.datoscred.cre_estado === 5) {
                    this.puedeCambiarPagos = false;
                }
            }
        });
    }

    isRowSelectable(event) {
        return this.isCuotaImpagaPend(event.data);
    }

    isCuotaImpagaPend(data) {
        return data.pg_id == 0 && data.enablepago;
    }

    loadTablaPagos() {
        this.initGridPagos();
        this.turnOnLoading();
        this.gridpagos =
            this.pagosService.getTablaPagos(this.cred).subscribe(res => {
                this.turnOffLoading();
                if (this.isResultOk(res)) {
                    this.gridpagos = res.tblpagos;
                    this.calcularSaldoTotal();
                }
            });
    }

    oncuentachange(event: any) {
        this.formcobro.cta_pago = this.ctapagosel.ic_code;
    }

    calcularSaldoTotal() {
        this.saldo_total = 0.0;
        this.datosCancelacion = {};
        const firstAmortRow = this.gridpagos.tabla.find(el => el.pg_id === 0);
        if (firstAmortRow) {
            const cuotas = [{cre_id: firstAmortRow.cre_id, amo_id: firstAmortRow.amo_id}];

            this.pagosService.getFormCalcPagos().subscribe(res1 => {
                if (this.isResultOk(res1)) {
                    const formcobro = res1.form;
                    console.log('res1:', res1);
                    const fecpago = formcobro.fecpagoobj;
                    this.pagosService.calcularValoresPagar(cuotas, fecpago).subscribe(res2 => {
                        if (this.isResultOk(res2)) {
                            console.log('res2:', res2);
                            this.datosCancelacion = res2.form;
                            const saldopend = Number(this.datoscred.cre_saldopend);
                            const adelanto = this.numberService.round2(saldopend - res2.form.pgc_total_capital);
                            this.saldo_total = this.numberService.round2(res2.form.pgc_total + adelanto);
                        }
                    });
                }
            });
        }
    }

    showModalCobrar() {
        this.isSavingPago = false;
        this.formcalcobro = {};
        this.showInputAbono = false;
        this.loadingInfoPago = true;
        this.pagosService.getFormCalcPagos().subscribe(res => {
            if (this.isResultOk(res)) {
                this.formcalcobro = res.form;
                this.formcalcobro.fecpagoobj = this.fechasService.parseString(this.formcalcobro.fecpago);
                const cuotas = this.selectedCuotas.map(function (c: any) {
                    return {cre_id: c.cre_id, amo_id: c.amo_id};
                });
                const fecpago = this.fechasService.formatDate(this.formcalcobro.fecpagoobj);
                this.pagosService.calcularValoresPagar(cuotas, fecpago).subscribe(res => {
                    this.loadingInfoPago = false;
                    if (this.isResultOk(res)) {
                        this.formcobro = res.form;
                        this.aux_pgc_total = this.formcobro.pgc_total;
                        this.isModalPagosVisible = true;
                        if (this.formcobro.cta_pagos.length > 0) {
                            this.ctapagosel = this.formcobro.cta_pagos[0];
                        }
                    }
                });
            } else {
                this.loadingInfoPago = false;
            }
        });
    }

    updateFechaPago() {
        this.loadingInfoPago = true;
        const cuotas = this.selectedCuotas.map(function (c: any) {
            return {cre_id: c.cre_id, amo_id: c.amo_id};
        });
        const fecpago = this.fechasService.formatDate(this.formcalcobro.fecpagoobj);
        this.pagosService.calcularValoresPagar(cuotas, fecpago).subscribe(res => {
            this.loadingInfoPago = false;
            if (this.isResultOk(res)) {
                this.formcobro = res.form;
                this.aux_pgc_total = this.formcobro.pgc_total;
                if (this.formcobro.cta_pagos.length > 0) {
                    this.ctapagosel = this.formcobro.cta_pagos[0];
                }
            }
        });
    }

    cancelPago() {
        this.isModalPagosVisible = false;
    }

    onPagoAbonoCapChange() {
        console.log('on pago abono cap change', this.showInputAbono);
        this.formcobro.pgc_adelanto = 0.0;
        this.onAbonoCapitalChange();
    }

    guardarPago() {
        this.isSavingPago = true;
        const msg = '¿Seguro que desea registrar el pago?';
        let filetopost = null;
        if (this.datafile && this.base64data) {
            filetopost = {
                adj_filename: this.datafile.name,
                archivo: this.base64data
            };
        }
        if (filetopost) {
            this.formcobro.archivo = filetopost;
        }
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.isSavingPago = true;
                this.formcobro.pgc_fechapago = this.fechasService.formatDate(this.formcalcobro.fecpagoobj);
                this.pagosService.guardarPago(this.formcobro).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.isSavingPago = false;
                        this.swalService.fireToastSuccess(res.msg);
                        this.isModalPagosVisible = false;
                        this.loadDatosPagosCred();
                        this.selectedCuotas = [];
                    }
                });
            } else {
                this.isSavingPago = false;
            }
        });
    }

    cancelAnulaPago() {
        this.isModalAnulaVisible = false;
    }

    onAbonoCapitalChange() {
        const numberadelanto = Number(this.formcobro.pgc_adelanto);
        console.log('Valor de adelanto:', numberadelanto);
        let valadelanto = 0;
        if (numberadelanto >= 0) {
            valadelanto = numberadelanto;
        }

        this.formcobro.pgc_total = this.numberService.round2(this.aux_pgc_total + valadelanto);
    }

    guardaAnularPago() {
        const msg = '¿Seguro que desea anular el pago?';
        this.formanul.pgc_id = this.pagoAnulSel.pgc_id;
        this.swalService.fireDialog(msg).then((confirm) => {
            if (confirm.value) {
                this.pagosService.anularPago(this.formanul).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.isModalAnulaVisible = false;
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadDatosPagosCred();
                    }
                });
            }
        });
    }

    anularPago(pago) {
        this.pagoAnulSel = pago;
        this.formanul.obs = '';
        this.isModalAnulaVisible = true;
    }

    onFileChange(fileInput: any) {
        this.datafile = fileInput.target.files[0];
        this.adjisimage = false;
        if (this.datafile) {
            const length = (this.datafile.size / 1024) / 1024;
            if (length > 10) {
                this.clearFile();
                this.swalService.fireError(this.ctes.msgTamanioArchivo);
            } else {
                this.processFile();
            }
        } else {
            this.filepreview = null;
            this.base64data = null;
        }
    }

    clearFile() {
        this.filepreview = null;
        this.base64data = null;
    }

    processFile() {
        const mimeType = this.datafile.type;
        const rega = /image|pdf|document/;
        const regimg = /image/;
        this.adjisimage = regimg.test(mimeType);
        if (rega.test(mimeType)) {
            const reader = new FileReader();
            reader.readAsDataURL(this.datafile);
            reader.onload = (e) => {
                this.filepreview = reader.result;
                this.base64data = this.filepreview;
            };
        } else {
            this.clearFile();
            this.swalService.fireError(this.ctes.msgTipoArchivoNoAdm);
        }
    }

    showModalDatosPago(pago) {
        this.datosPago = {};
        this.filapagosel = pago;
        this.pagosService.getDetallesPago(pago.pgc_id).subscribe(res => {
            if (this.isResultOk(res)) {
                this.isModalDatosPagoVisible = true;
                this.datosPago = res.datospago;
            }
        });
    }

    cerrarModalDatosPago() {
        this.isModalDatosPagoVisible = false;
    }

    showAdjunto() {
        this.adjService.openWindows(this.adjService.getDownloadAdjUrlNode(this.datosPago));
    }

    showModalMarcaPagados() {
        this.isSavingPago = false;
        this.formcobro = {};
        this.pagosService.getFormCalcPagos().subscribe(res => {
            if (this.isResultOk(res)) {
                this.formcalcobro = res.form;
                this.formcalcobro.fecpagoobj = this.fechasService.parseString(this.formcalcobro.fecpago);
            }
            const cuotas = this.selectedCuotas.map(function (c: any) {
                return {cre_id: c.cre_id, amo_id: c.amo_id};
            });
            this.pagosService.getFormMarcaPagado(cuotas).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.formcobro = res.form;
                    this.isModalMarcaPagadosVisible = true;
                }
            });
        });
    }

    guardarMarcaPago() {
        this.isSavingPago = true;
        const msg = '¿Seguro que desea registrar estas cuotas como Pagadas?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.isSavingPago = true;
                this.formcobro.pgc_fechapago = this.fechasService.formatDate(this.formcalcobro.fecpagoobj);
                this.pagosService.guardarMarcarPagados(this.formcobro).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.isSavingPago = false;
                        this.swalService.fireToastSuccess(res.msg);
                        this.isModalMarcaPagadosVisible = false;
                        this.loadDatosPagosCred();
                        this.selectedCuotas = [];
                    }
                });
            } else {
                this.isSavingPago = false;
            }
        });
    }

    cancelMarcaPago() {
        this.isModalMarcaPagadosVisible = false;
    }

    gotoList() {
        this.router.navigate([this.ctesFinanServ.rutaHome]);
    }
}
