import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {TicketService} from '../../../services/ticket.service';
import {SwalService} from '../../../services/swal.service';

@Component({
    selector: 'app-ticketview',
    templateUrl: './ticketview.component.html'
})
export class TicketviewComponent implements OnChanges {

    @Input() tkid: number;
    @Output() evCerrar = new EventEmitter<any>();
    @Output() evReload = new EventEmitter<any>();

    datostk: any = {};
    detalles: Array<any> = [];
    isLoading = false;

    form: any = {};
    formcli: any = {};
    servicios: any = {};
    isEdit = false;

    constructor(private tkService: TicketService,
                private swalService: SwalService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const tkchange = changes.tkid;
        if (tkchange.currentValue) {
            this.loadDatosTicket();
        }
    }

    loadDatosTicket() {
        this.isEdit = false;
        this.isLoading = true;
        this.tkService.getDetalles(this.tkid).subscribe(res => {
            this.isLoading = false;
            this.datostk = res.datosticket.datosticket;
            this.detalles = res.datosticket.servicios;
        });
    }

    doCerrar() {
        this.evCerrar.emit('');
    }

    editar() {
        this.isLoading = true;
        this.tkService.getFormEdit(this.tkid).subscribe(res => {
            this.isLoading = false;
            this.isEdit = true;
            this.form = res.form;
            this.servicios = res.servicios;
        });
    }

    actualizar() {
        if (this.tkService.isDataValid(this.form, this.form, this.swalService)) {
            const codservicios = this.tkService.getCodServicios(this.servicios);
            this.form.tk_servicios = codservicios;
            this.tkService.actualizar(this.form).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.isEdit = false;
                    this.loadDatosTicket();
                    this.evReload.emit('');
                }
            });
        }
    }

    doDelete() {
        const msg = '¿Confirma que desea anular este ticket?';
        if (confirm(msg)) {
            this.isLoading = true;
            this.tkService.anular(this.tkid).subscribe(res => {
                this.isLoading = false;
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.evReload.emit('');
                    this.evCerrar.emit('');
                }
            });
        }
    }

    doPrint() {
        this.tkService.imprimir(this.tkid);
    }

    cancelEdit() {
        this.isEdit = false;
    }
}
