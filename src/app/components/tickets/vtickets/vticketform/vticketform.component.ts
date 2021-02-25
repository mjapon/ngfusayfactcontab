import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {UiService} from '../../../../services/ui.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {VentaticketService} from '../../../../services/ventaticket.service';
import {FechasService} from '../../../../services/fechas.service';

@Component({
    selector: 'app-vticketform',
    templateUrl: './vticketform.component.html'
})
export class VticketformComponent implements OnInit {
    tiposList: any;
    cuentasList: any;
    form: any;
    cuentasel: any;
    tiposel: any;
    currentDate = new Date();
    fechaRegistro = new Date();

    datafile: any;
    filepreview: any;
    base64data: any = null;
    adjisimage = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private vtService: VentaticketService,
                private swalService: SwalService,
                private uiService: UiService,
                private fechasService: FechasService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.form = {};
        this.tiposList = [];
        this.cuentasList = [];
        this.tiposel = {};
        this.vtService.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.tiposList = res.tipos;
                this.cuentasList = res.cuentas;
                this.tiposel = this.tiposList[0];
            }
        });
        this.uiService.setFocusById('tipoInput', 600);
    }


    guardar() {
        if (this.cuentasel === null || this.cuentasel === undefined) {
            this.swalService.fireError('Debe seleccionar el tipo de registro');
            return;
        } else if (this.form.vt_monto == null || this.form.vt_monto.toString().trim().length === 0) {
            this.swalService.fireError('Debe ingresar el monto');
            return;
        } else {
            if (!this.fechaRegistro) {
                this.swalService.fireToastWarn('Debe ingresar la fecha del registro');
            } else {
                const fechaRegistroStr = this.fechasService.formatDate(this.fechaRegistro);
                this.form.vt_tipo = this.cuentasel;
                this.form.vt_fecha = fechaRegistroStr;
                this.loadingUiService.publishBlockMessage();

                let filetopost = null;
                if (this.datafile && this.base64data) {
                    filetopost = {
                        rxd_filename: this.datafile.name,
                        archivo: this.base64data
                    };
                }
                const formtopost = {
                    form: this.form,
                    archivo: null
                };

                if (filetopost) {
                    formtopost.archivo = filetopost;
                }

                this.vtService.guardar(formtopost).subscribe(res => {
                    this.swalService.fireToastSuccess(res.msg);
                    if (res.status === 200) {
                        this.router.navigate(['vtickets']);
                    }
                });
            }
        }
    }

    cancelar() {
        this.router.navigate(['vtickets']);
    }

    onrubrosel($event: any) {
        this.uiService.setFocusById('costoInput', 400);
        if (this.form.vt_monto === 0) {
            this.form.vt_monto = '';
        }
    }

    ontiposel($event: any) {
        if (this.tiposel) {
            const tipoidsel = this.tiposel;
            this.cuentasel = null;
            this.vtService.getCuentas(tipoidsel).subscribe(res => {
                if (res.status === 200) {
                    this.cuentasList = res.cuentas;
                }
            });
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

}
