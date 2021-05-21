import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {BilleteramovService} from '../../../services/billeteramov.service';
import {DomService} from '../../../services/dom.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {NumberService} from '../../../services/number.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {FechasService} from '../../../services/fechas.service';
import {CtesService} from '../../../services/ctes.service';

@Component({
    selector: 'app-ingegrform',
    templateUrl: './ingegrform.component.html'
})
export class IngegrformComponent implements OnInit {
    titulo = 'Ingreso';
    tiporouting = 1;
    isLoading = false;

    datafile: any;
    filepreview: any;
    base64data: any = null;
    adjisimage = false;
    cuentasformov: Array<any> = [];
    billeteras: Array<any> = [];

    form: any = {};
    formasiento: any = {};
    currentDate = new Date();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private domService: DomService,
                private numberService: NumberService,
                private fechasService: FechasService,
                private loadingService: LoadingUiService,
                private arrayService: ArrayutilService,
                private billMovService: BilleteramovService,
                private ctes: CtesService,
                private swalService: SwalService) {
        this.route.paramMap.subscribe(params => {
            this.tiporouting = parseInt(params.get('tipo'), 10);
            this.setTitle();
            this.loadForm();
        });
    }

    ngOnInit(): void {

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
                        rxd_filename: this.datafile.name,
                        archivo: this.base64data
                    };
                }
                const formtopost = {
                    form: this.form,
                    formasiento: this.formasiento,
                    archivo: null
                };

                if (filetopost) {
                    formtopost.archivo = filetopost;
                }
                this.swalService.fireDialog('¿Confirma que desea crear este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingService.publishBlockMessage();
                        this.billMovService.crear(formtopost).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.gotolist();
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
        this.gotolist();
    }

    gotolist() {
        this.router.navigate(['vtickets']);
    }

    ontiposel(tipo: any, $event: any) {
        const idx = this.form.cuentas.indexOf(tipo);
        const inputid = `tipo_valor_${idx}`;
        this.domService.setFocusTm(inputid, 100);
        tipo.dt_valor = this.auxGetMontoFila(this.form.cuentas, idx);
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
            this.swalService.fireError('Este tipo de archivo no esta admitido');
        }
    }

    onFileChange(fileInput: any) {
        this.datafile = fileInput.target.files[0];
        this.adjisimage = false;
        if (this.datafile) {
            const length = (this.datafile.size / 1024) / 1024;
            if (length > 10) {
                this.clearFile();
                this.swalService.fireError('El tamaño del archivo es muy grande, elija otro (Tamaño máximo 10MB)');
            } else {
                this.processFile();
            }
        } else {
            this.filepreview = null;
            this.base64data = null;
        }
    }

    loadForm() {
        this.isLoading = true;
        this.billMovService.getForm(this.tiporouting).subscribe(res => {
            if (res.status === 200) {
                this.form = res.form.formbillmov;
                this.form.bmo_fechatransaccobj = this.fechasService.parseString(this.form.bmo_fechatransacc);
                this.cuentasformov = res.form.cuentasformov;
                this.billeteras = res.form.billeterasformov;
                this.formasiento = res.form.formasiento;
                this.domService.setFocusTm('bmo_monto', 300);
            }
            this.isLoading = false;
        });
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

    onMontoEnter() {
        this.domService.setFocusTm('tipo_valor_0', 100);
    }
}
