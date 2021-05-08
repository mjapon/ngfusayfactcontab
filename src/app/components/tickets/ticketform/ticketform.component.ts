import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketService} from '../../../services/ticket.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {LugarService} from '../../../services/lugar.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {forkJoin} from 'rxjs';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-ticketform',
    templateUrl: './ticketform.component.html'
})
export class TicketformComponent implements OnInit {

    servicios: Array<any>;
    form: any;
    formcli: any;
    seccion: any;
    lugares: Array<any>;
    isLoading = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private tkService: TicketService,
                private swalService: SwalService,
                private domService: DomService,
                private personaService: PersonaService,
                private arrayUtil: ArrayutilService,
                private lugarService: LugarService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.servicios = new Array<any>();
        this.formcli = {};
        this.form = {};
        this.seccion = {};

        const formCreaObs = this.tkService.getFormCrea();
        const servObs = this.tkService.getProdsForTickets();
        const lugsObs = this.lugarService.listarTodos();

        forkJoin([formCreaObs, servObs, lugsObs]).subscribe(res => {
            if (res[0].status === 200) {
                this.form = res[0].form;
                this.formcli = res[0].formcli;
                this.seccion = res[0].seccion;
            }
            if (res[1].status === 200) {
                this.servicios = res[1].items;
            }
            if (res[2].status === 200) {
                this.lugares = res[2].items;
            }
            this.isLoading = false;
            this.domService.setFocusTimeout('ciPasInput', 300);
        });
    }

    buscarPersona() {
        if (this.formcli.per_ciruc && this.formcli.per_ciruc.trim().length > 4) {
            this.loadingUiService.publishBlockMessage();
            this.personaService.buscarPorCi(this.formcli.per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    this.formcli.per_id = res.persona.per_id;
                    this.formcli.per_nombres = res.persona.per_nombres;
                    this.formcli.per_apellidos = res.persona.per_apellidos;
                    this.formcli.per_movil = res.persona.per_movil;
                    this.formcli.per_email = res.persona.per_email;
                    this.formcli.per_lugresidencia = null;
                    this.formcli.per_direccion = res.persona.per_direccion;
                    if (res.persona.per_lugresidencia) {
                        this.formcli.per_lugresidencia = this.arrayUtil.getFirstResult(
                            this.lugares, el => {
                                return el.lug_id === res.persona.per_lugresidencia;
                            }
                        );
                    }
                }
            });
        }
    }

    setFocus(inputid) {
        this.domService.setFocus(inputid);
    }

    selectService(item: any) {
        item.ic_marca = !item.ic_marca;
    }

    cancelar() {
        this.router.navigate(['tickets']);
    }

    guardar() {
        const codservicios = this.tkService.getCodServicios(this.servicios);
        this.form.tk_servicios = codservicios;

        if (this.tkService.isDataValid(this.form, this.formcli, this.swalService)) {
            this.loadingUiService.publishBlockMessage();
            this.tkService.guardar(this.form, this.formcli).subscribe(res => {
                this.swalService.fireToastSuccess(res.msg);
                if (res.status === 200) {
                    this.tkService.imprimir(res.tk_id);
                    this.router.navigate(['tickets']);
                }
            });
        }


        /*
        if (this.form.tk_nro === null || this.form.tk_nro.toString().trim().length === 0) {
            this.swalService.fireError('Debe ingresar el número del ticket');
            return;
        } else if (this.form.tk_costo == null || this.form.tk_costo.toString().trim().length === 0) {
            this.swalService.fireError('Debe ingresar el precio del ticket');
            return;
        } else if (this.formcli.per_nombres == null || this.formcli.per_nombres.trim().length === 0) {
            this.swalService.fireError('Debe ingresar el nombre del paciente');
            return;
        } else {
            this.loadingUiService.publishBlockMessage();
            this.tkService.guardar(this.form, this.formcli).subscribe(res => {
                this.swalService.fireToastSuccess(res.msg);
                if (res.status === 200) {
                    this.tkService.imprimir(res.tk_id);
                    this.router.navigate(['tickets']);
                }
            });
        }
         */
    }
}
