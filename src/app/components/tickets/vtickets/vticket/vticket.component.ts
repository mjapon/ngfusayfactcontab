import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {VentaticketService} from '../../../../services/ventaticket.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';

@Component({
    selector: 'app-vticket',
    templateUrl: './vticket.component.html',
    styleUrls: ['./vticket.component.css']
})
export class VticketComponent implements OnInit {
    items: Array<any>;
    selectedItem: any;
    cols: Array<any>;
    itemsCtxMenu: MenuItem[];
    total: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private vtServie: VentaticketService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.loadGrid();

        this.itemsCtxMenu = [
            {label: 'Confirmar', icon: 'fa fa-check', command: (event) => this.confirmarRow(this.selectedItem)},
            {label: 'Anular', icon: 'fa fa-trash', command: (event) => this.anularRow(this.selectedItem)}
        ];
    }

    nuevo() {
        this.router.navigate(['vticket', 'form']);
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    confirmarRow(rowData) {
        if (rowData.vt_estado === 0) {
            this.swalService.fireDialog('¿Confirmar este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.vtServie.confirmar(rowData.vt_id).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.loadGrid();
                            }
                        });
                    }
                }
            );
        } else {
            this.swalService.fireToastError('No es posible');
        }


    }

    loadGrid() {
        this.vtServie.listar().subscribe(res => {
            this.cols = res.res.cols;
            this.items = res.res.data;
            this.total = res.suma;
        });
    }

    anularRow(rowData) {
        if (rowData.vt_estado === 0) {
            this.swalService.fireDialog('¿Confirma que desea anular este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.vtServie.anular(rowData.vt_id).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.loadGrid();
                            }
                        });
                    }
                }
            );
        } else {
            this.swalService.fireToastError('No es posible');
        }
    }
}
