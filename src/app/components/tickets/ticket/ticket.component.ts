import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../../services/ticket.service";
import {parse} from "date-fns";
import {DateFormatPipe} from "../../../pipes/date-format.pipe";
import {SwalService} from "../../../services/swal.service";
import {FechasService} from "../../../services/fechas.service";
import {MenuItem} from "primeng";
import {LoadingUiService} from "../../../services/loading-ui.service";

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    dia: Date;

    es: any;
    enableBtns: boolean;

    itemsCtxMenu: MenuItem[];
    total: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private fechasService: FechasService,
                private ticketService: TicketService,
                private dateFormatPipe: DateFormatPipe,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit() {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.es = this.fechasService.getLocaleEsForPrimeCalendar();
        this.total = 0.0;
        this.ticketService.getFormListado().subscribe(res => {
            this.dia = parse(res.dia, 'd/M/yyyy', new Date());
            this.loadGrid();
        });

        this.itemsCtxMenu = [
            {label: 'Imprimir', icon: 'fa fa-print', command: (event) => this.imprimirRow(this.selectedItem)},
            {label: 'Anular', icon: 'fa fa-trash', command: (event) => this.anularRow(this.selectedItem)}
        ];

    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    loadGrid() {
        const diaStr = this.dateFormatPipe.transform(this.dia);
        this.ticketService.listar(diaStr).subscribe(res => {
            this.cols = res.res.cols;
            this.items = res.res.data;
            this.total = res.suma;
        });
    }

    selectItem(item: any) {
        this.selectedItem = item;
    }


    nuevo() {
        this.router.navigate(['ticket', 'form']);
    }

    imprimir() {
        if (this.selectedItem) {
            this.ticketService.imprimir(this.selectedItem.tk_id);
        }
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

    rubros() {
        this.router.navigate(['vtickets']);
    }
}
