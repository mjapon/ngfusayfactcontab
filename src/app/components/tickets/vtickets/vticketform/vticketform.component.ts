import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {UiService} from '../../../../services/ui.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {VentaticketService} from '../../../../services/ventaticket.service';
import {FechasService} from '../../../../services/fechas.service';

@Component({
    selector: 'app-vticketform',
    templateUrl: './vticketform.component.html',
    styleUrls: ['./vticketform.component.css']
})
export class VticketformComponent implements OnInit {
    tiposList: any;
    cuentasList: any;
    form: any;
    cuentasel: any;
    tiposel: any;
    currentDate = new Date();
    fechaRegistro = new Date();

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
        this.uiService.setFocusById('costoInput', 1000);
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
                this.form.vt_tipo = this.cuentasel.ic_id;
                this.form.vt_fecha = fechaRegistroStr;
                this.loadingUiService.publishBlockMessage();
                this.vtService.guardar(this.form).subscribe(res => {
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
            const tipoidsel = this.tiposel.value;
            this.cuentasel = null;
            this.vtService.getCuentas(tipoidsel).subscribe(res => {
                if (res.status === 200) {
                    this.cuentasList = res.cuentas;
                }
            });
        }
    }
}
