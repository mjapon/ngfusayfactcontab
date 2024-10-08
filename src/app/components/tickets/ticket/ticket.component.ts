import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TicketService} from '../../../services/ticket.service';
import {parse} from 'date-fns';
import {SwalService} from '../../../services/swal.service';
import {FechasService} from '../../../services/fechas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {MenuItem} from 'primeng/api';
import {MenuNavigateAppService} from '../../../services/shared/menu-navigate-app.service';
import {FautService} from '../../../services/faut.service';

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html'
})
export class TicketComponent implements OnInit {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    dia: Date;
    enableBtns: boolean;

    itemsCtxMenu: MenuItem[];
    total: any;
    desde: Date;
    hasta: Date;
    servicios: Array<any>;
    selectedServices: Array<any>;
    selectedSection: any;
    secciones: Array<any>;
    isLoading = false;
    form: any;
    isShowDetTk = false;
    tksel: any = {};
    rows = 12;
    page = 0;

    constructor(private router: Router,
                private swalService: SwalService,
                private fautService: FautService,
                private menuNavigateService: MenuNavigateAppService,
                private fechasService: FechasService,
                private ticketService: TicketService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit() {
        this.form = {desde: new Date(), hasta: new Date(), desdestr: '', hastastr: ''};
        this.selectedServices = [];
        this.selectedSection = 0;
        this.items = [];
        this.cols = [];
        this.servicios = [];
        this.total = 0.0;

        this.isLoading = true;
        this.ticketService.getFormListado().subscribe(res => {
            this.dia = parse(res.dia, 'd/M/yyyy', new Date());
            this.desde = parse(res.desde, 'd/M/yyyy', new Date());
            this.hasta = parse(res.hasta, 'd/M/yyyy', new Date());

            this.form.desde = this.desde;
            this.form.hasta = this.hasta;
            this.form.desdestr = res.desde;
            this.form.hastastr = res.hasta;
            this.selectedSection = res.sec_def;
            this.secciones = res.secciones;
            this.servicios = res.prods;
            this.isLoading = false;
            this.loadGrid();
        });

        this.itemsCtxMenu = [
            {label: 'Imprimir', icon: 'fa fa-print', command: (event) => this.imprimirRow(this.selectedItem)},
            {label: 'Anular', icon: 'fa fa-trash', command: (event) => this.anularRow(this.selectedItem)}
        ];

        const menuItem = {label: 'Listado', icon: 'fa-solid fa-rectangle-list', route: '/tickets', id: 'tk_list'};
        this.menuNavigateService.addItem(menuItem);
        this.fautService.publishMessageAddNavigate();

    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    loadGrid() {
        this.isLoading = true;
        const diaStr = this.fechasService.formatDate(this.dia);
        const servicios = this.selectedServices ? this.selectedServices.toString() : '';
        this.ticketService.listar(diaStr, this.form.desdestr, this.form.hastastr, this.selectedSection, servicios).subscribe(res => {
            this.cols = res.res.cols;
            this.items = res.res.data;
            this.total = res.suma;
            this.isLoading = false;
        });
    }

    nuevo() {
        this.router.navigate(['ticket', 'form']);
    }

    imprimir() {
        if (this.selectedItem) {
            this.ticketService.imprimir(this.selectedItem.tk_id);
        }
    }

    verDetalles(row) {
        this.tksel = row;
        this.showModalTicket();
    }

    imprimirRow(row) {
        this.ticketService.imprimir(row.tk_id);
    }

    anular() {
        if (this.selectedItem) {
            this.swalService.fireDialog('¿Confirma que desea anular este ticket?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.ticketService.anular(this.selectedItem.tk_id).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.loadGrid();
                            }
                        });
                    }
                }
            );
        }
    }

    anularRow(row) {
        this.tksel = row;
        this.showModalTicket();
        this.swalService.fireDialog('¿Confirma que desea anular este ticket?', '').then(confirm => {
                if (confirm.value) {
                    this.loadingUiService.publishBlockMessage();
                    this.ticketService.anular(row.tk_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadGrid();
                        }
                    });
                }
            }
        );
    }

    onDesdeChange($event: any) {
        this.form.desdestr = this.fechasService.formatDate(this.form.desde);
    }

    onHastaChange($event: any) {
        this.form.hastastr = this.fechasService.formatDate(this.form.hasta);
    }

    onTipoFiltroChange() {
        this.onDesdeChange(null);
        this.onHastaChange(null);
        this.loadGrid();
    }

    closeModalTicket() {
        this.isShowDetTk = false;
    }

    showModalTicket() {
        this.isShowDetTk = true;
    }

    onRowDblClick(rowData) {
        this.verDetalles(rowData);
    }

    protected readonly Math = Math;
}
