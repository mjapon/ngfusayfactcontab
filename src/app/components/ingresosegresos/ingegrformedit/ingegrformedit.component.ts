import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomService} from '../../../services/dom.service';
import {NumberService} from '../../../services/number.service';
import {FechasService} from '../../../services/fechas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {BilleteramovService} from '../../../services/billeteramov.service';
import {CtesService} from '../../../services/ctes.service';
import {SwalService} from '../../../services/swal.service';

@Component({
    selector: 'app-ingegrformedit',
    templateUrl: './ingegrformedit.component.html'
})
export class IngegrformEditComponent implements OnInit {

    @Input() tiporouting = 1;
    @Input() titulo = 'Ingreso';
    @Input() codmov = 0;

    form: any = {};
    formasiento: any = {};
    currentDate = new Date();
    isLoading = false;
    datafile: any;
    filepreview: any;
    base64data: any = null;
    adjisimage = false;
    cuentasformov: Array<any> = [];
    billeteras: Array<any> = [];

    @Output() cancelarEv = new EventEmitter<any>();
    @Output() guardarEv = new EventEmitter<any>();

    constructor(private domService: DomService,
                private numberService: NumberService,
                private fechasService: FechasService,
                private loadingService: LoadingUiService,
                private arrayService: ArrayutilService,
                private billMovService: BilleteramovService,
                private ctes: CtesService,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.setTitle();
        this.loadForm();
    }

    loadPreviusTransacc() {
        this.isLoading = true;
        this.billMovService.getDatosMov(this.codmov).subscribe(res => {
                this.isLoading = false;
                if (res.status === 200) {
                    const datosmov = res.datosmov.datosmov;
                    const asiento = res.datosmov.asiento;
                    this.tiporouting = datosmov.bmo_clase;

                    this.auxGetForm(() => {
                        const detalles = asiento.detalles;
                        const creditos = detalles.filter(row => row.dt_debito === 1);
                        const debitos = detalles.filter(row => row.dt_debito === -1);
                        console.log('Tipo rounting:', this.tiporouting);
                        if (this.tiporouting === 1) { // Ingresos
                            this.form.billeteras = this.createTransaccBill(creditos);
                            this.form.cuentas = this.createTransaccBill(debitos);
                        } else if (this.tiporouting === 2) { // Gastos
                            this.form.billeteras = this.createTransaccBill(debitos);
                            this.form.cuentas = this.createTransaccBill(creditos);
                        } else {// Transferencias
                            this.form.billeteras = this.createTransaccBill(creditos);
                            this.form.cuentas = this.createTransaccBill(debitos);
                        }
                        this.form.bmo_fechatransaccobj = this.fechasService.parseString(datosmov.bmo_fechatransacc);
                        this.form.bmo_fechatransacc = datosmov.bmo_fechatransacc;
                        this.form.bmo_monto = datosmov.bmo_monto;
                        this.form.bmo_obs = datosmov.trn_observ;
                        this.setTitle();
                    });
                }
            }
        );
    }

    createTransaccBill(rows) {
        return rows.map(row => {
            return {cta_codigo: row.cta_codigo, dt_valor: row.dt_valor};
        });
    }

    setTitle() {
        if (this.tiporouting === 1) {
            this.titulo = 'Ingreso';
        } else if (this.tiporouting === 2) {
            this.titulo = 'Gasto';
        } else if (this.tiporouting === 3) {
            this.titulo = 'Transferencia';
        }
    }

    guardar() {
        // Validar los monto ingresados
        const montotal = this.form.bmo_monto;
        if (this.numberService.round2(montotal) <= 0) {
            this.swalService.fireToastError(this.ctes.msgMontoIncVerif);
            return;
        }

        let totalcuentas = Number(0.0);
        let totalbill = Number(0.0);
        this.form.cuentas.forEach(cuenta => {
            totalcuentas += Number(cuenta.dt_valor);
        });

        this.form.billeteras.forEach(bill => {
            totalbill += Number(bill.dt_valor);
        });

        // Verificar fecha ingresada
        if (!this.form.bmo_fechatransaccobj) {
            this.swalService.fireToastError('Debe ingresar la fecha de la transacción');
            return;
        }
        this.form.bmo_fechatransacc = this.fechasService.formatDate(this.form.bmo_fechatransaccobj);

        if (this.numberService.round2(totalcuentas) !== this.numberService.round2(totalbill)) {
            this.swalService.fireToastError('Los valores no coinciden, favor verificar');
        } else {
            if (this.numberService.round2(montotal) === this.numberService.round2(totalcuentas)) {

                let filetopost = null;
                if (this.datafile && this.base64data) {
                    filetopost = {
                        adj_filename: this.datafile.name,
                        archivo: this.base64data
                    };
                }
                const formtopost = {
                    form: this.form,
                    formasiento: this.formasiento,
                    archivo: null,
                    bmo_id: 0
                };

                if (filetopost) {
                    formtopost.archivo = filetopost;
                }
                let message = '¿Confirma que desea crear este registro?';
                if (this.codmov && this.codmov > 0) {
                    message = '¿Confirma que desea actualizar este registro?';
                }
                this.swalService.fireDialog(message, '').then(confirm => {
                    if (confirm.value) {
                        this.loadingService.publishBlockMessage();
                        let promise = null;
                        if (this.codmov && this.codmov > 0) {
                            formtopost.bmo_id = this.codmov;
                            promise = this.billMovService.actualizar(formtopost);

                        } else {
                            promise = this.billMovService.crear(formtopost);
                        }
                        promise.subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.guardarEv.emit(true);
                            }
                        });
                    }
                });

            } else {
                this.swalService.fireToastError('Los montos ingresados no coinciden, favor verificar');
            }
        }
    }

    cancelar() {
        this.cancelarEv.emit(true);
    }

    ontiposel(tipo: any, $event: any) {
        const idx = this.form.cuentas.indexOf(tipo);
        const inputid = `tipo_valor_${idx}`;
        this.domService.setFocusTm(inputid);
        tipo.dt_valor = this.auxGetMontoFila(this.form.cuentas, idx);
        if (this.tiporouting === 3) {
            this.billeteras = this.billeteras.filter(ibil => ibil.ic_id !== tipo.cta_codigo);
        }
    }

    auxGetMontoFila(thearray, idx) {
        return this.arrayService.getMontoFila(thearray, idx, this.form.bmo_monto);
    }

    onbillsel(fila: any, $event: any) {
        const idx = this.form.billeteras.indexOf(fila);
        this.domService.setFocusTm(`bill_valor_${idx}`, 100);
        fila.dt_valor = this.auxGetMontoFila(this.form.billeteras, idx);
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

    auxGetForm(fnthen: any) {
        this.billMovService.getForm(this.tiporouting).subscribe(res => {
            if (res.status === 200) {
                this.form = res.form.formbillmov;
                this.form.bmo_fechatransaccobj = this.fechasService.parseString(this.form.bmo_fechatransacc);
                this.cuentasformov = res.form.cuentasformov;
                this.billeteras = res.form.billeterasformov;
                this.formasiento = res.form.formasiento;
                this.domService.setFocusTm('bmo_monto', 300);
                if (fnthen) {
                    fnthen();
                }
            }
            this.isLoading = false;

        });
    }

    loadForm() {
        this.isLoading = true;
        if (this.codmov && this.codmov > 0) {
            this.loadPreviusTransacc();
        } else {
            this.auxGetForm(null);
        }
    }

    addcuentas() {
        this.form.cuentas.push({cta_codigo: 0, dt_valor: 0.0});
    }

    removeCuenta(fila) {
        this.arrayService.removeElement(this.form.cuentas, fila);
    }

    addbilleteras() {
        this.form.billeteras.push({cta_codigo: 0, dt_valor: 0.0});
    }

    removeBilletera(fila) {
        this.arrayService.removeElement(this.form.billeteras, fila);
    }

    onFocusOut() {
        if (this.codmov && this.codmov > 0) {
            if (this.form.cuentas.length === 1 && this.form.billeteras.length === 1) {
                this.form.cuentas[0].dt_valor = Number(this.form.bmo_monto);
                this.form.billeteras[0].dt_valor = Number(this.form.bmo_monto);
            }
        }
    }

    onMontoEnter() {
        this.domService.setFocusTm('tipo_valor_0', 100);
    }
}
