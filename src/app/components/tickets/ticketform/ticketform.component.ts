import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketService} from '../../../services/ticket.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {UiService} from '../../../services/ui.service';
import {LoadingUiService} from '../../../services/loading-ui.service';

@Component({
    selector: 'app-ticketform',
    templateUrl: './ticketform.component.html',
    styleUrls: ['./ticketform.component.css']
})
export class TicketformComponent implements OnInit {

    servicios: Array<any>;
    form: any;
    formcli: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private ticketService: TicketService,
                private swalService: SwalService,
                private uiService: UiService,
                private personaService: PersonaService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit() {
        this.servicios = new Array<any>();
        this.formcli = {};
        this.form = {};

        this.ticketService.getFormCrea().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.formcli = res.formcli;
            }
        });

        this.ticketService.getProdsForTickets().subscribe(res2 => {
            if (res2.status === 200) {
                this.servicios = res2.items;
            }
        });

        this.uiService.setFocusById('ciPasInput');
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
                }
            });
        }
    }

    setFocus(inputid) {
        this.uiService.setFocusById(inputid);
    }

    selectService(item: any) {
        item.ic_marca = !item.ic_marca;
    }

    cancelar() {
        this.router.navigate(['tickets']);
    }

    guardar() {
        let filtrados = this.servicios.filter(item => {
            return item.ic_marca;
        });

        let codigos = filtrados.map(e => {
            return e.ic_id;
        });

        let codservicios: string = codigos.toString();
        this.form.tk_servicios = codservicios;

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
            this.ticketService.guardar(this.form, this.formcli).subscribe(res => {
                this.swalService.fireToastSuccess(res.msg);
                if (res.status === 200) {
                    this.ticketService.imprimir(res.tk_id);
                    this.router.navigate(['tickets']);
                }
            });
        }


    }

}
