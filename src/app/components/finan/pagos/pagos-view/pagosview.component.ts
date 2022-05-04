import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BaseComponent } from "src/app/components/shared/base.component";
import { CtesService } from "src/app/services/ctes.service";
import { FinanCreditosService } from "src/app/services/finan/finacreditos.service";
import { FinanPagosService } from "src/app/services/finan/finapagos.service";
import { NumberService } from "src/app/services/number.service";
import { RxdocsService } from "src/app/services/rxdocs.service";
import { SwalService } from "src/app/services/swal.service";

@Component({
    selector: 'app-finpagosview',
    templateUrl: './pagosview.component.html'
})
export class FinanPagosViewComponent extends BaseComponent implements OnInit, OnChanges {

    @Input() cred: number = 0;
    gridpagos: any = {};
    datoscred: any = {};
    isModalPagosVisible = false;
    isModalAnulaVisible = false;
    isModalDatosPagoVisible = false;
    formcobro: any = {};
    formanul: any = { obs: '' };
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

    constructor(private swalService: SwalService,
        private credService: FinanCreditosService,
        private ctes: CtesService,
        private adjService: RxdocsService,
        private numberService: NumberService,
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

    loadDatosPagosCred() {
        this.loadTablaPagos();
        this.loadDatosCredito();
    }

    initGridPagos() {
        this.gridpagos = { cols: [], tabla: [] };
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
                }
            })
    }

    oncuentachange(event: any) {
        this.formcobro.cta_pago = this.ctapagosel.ic_code;
    }

    showModalCobrar() {
        const cuotas = this.selectedCuotas.map(function (c: any) {
            return { 'cre_id': c.cre_id, 'amo_id': c.amo_id };
        });
        this.showInputAbono = false;
        this.pagosService.getFormPago(cuotas).subscribe(res => {
            if (this.isResultOk(res)) {
                console.log('Valor de res', res);
                this.formcobro = res.form;
                this.aux_pgc_total = this.formcobro.pgc_total;
                this.isModalPagosVisible = true;
                if (this.formcobro.cta_pagos.length > 0) {
                    this.ctapagosel = this.formcobro.cta_pagos[0];
                }
            }
        });
    }

    cancelPago() {
        this.isModalPagosVisible = false;
    }

    guardarPago() {
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
                this.pagosService.guardarPago(this.formcobro).subscribe(res => {
                    if (this.isResultOk(res)) {
                        console.log('Valor de res es', res);
                        this.swalService.fireToastSuccess(res.msg);
                        this.isModalPagosVisible = false;
                        this.loadDatosPagosCred();
                        this.selectedCuotas = [];
                    }
                });
            }
        });
    }

    cancelAnulaPago() {
        this.isModalAnulaVisible = false;
    }

    onAbonoCapitalChange() {
        const numberadelanto = Number(this.formcobro.pgc_adelanto);
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
        this.datosPago = {}
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

}