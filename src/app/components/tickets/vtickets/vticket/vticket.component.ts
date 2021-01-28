import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {VentaticketService} from '../../../../services/ventaticket.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';

@Component({
    selector: 'app-vticket',
    templateUrl: './vticket.component.html'
})
export class VticketComponent implements OnInit {
    items: Array<any>;
    selectedItem: any;
    cols: Array<any>;
    itemsCtxMenu: MenuItem[];
    total: any;

    tipos: Array<any>;
    cuentas: Array<any>;
    tipoSel: any;
    cuentaSel: any;
    isShowDetalleRubro = false;
    codvticektsel: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private vtService: VentaticketService,
                private arrayServ: ArrayutilService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.tipos = new Array<any>();
        this.cuentas = new Array<any>();

        this.vtService.getFormListar().subscribe(res => {
            if (res.status === 200) {
                this.tipos = res.tipos;
                this.cuentas = res.cuentas;
                this.tipoSel = this.tipos[0].value;
                this.loadGrid();
            }
        });

        this.itemsCtxMenu = [
            {label: 'Confirmar', icon: 'fa fa-check', command: (event) => this.confirmarRow(this.selectedItem)},
            {label: 'Anular', icon: 'fa fa-trash', command: (event) => this.anularRow(this.selectedItem)},
            {label: 'Ver detalles', icon: 'fa fa-eye', command: (event) => this.verDetalles(this.selectedItem)}
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
                        this.vtService.confirmar(rowData.vt_id).subscribe(res => {
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
        const tipoIdSel = this.tipoSel;
        let cuentaIdSel = 0;
        if (this.cuentaSel) {
            cuentaIdSel = this.cuentaSel.ic_id;
        }
        this.loadingUiService.publishBlockMessage();
        this.vtService.listar(tipoIdSel, cuentaIdSel).subscribe(res => {
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
                        this.vtService.anular(rowData.vt_id).subscribe(res => {
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

    onTipoCuentaChange($event: any) {
        if (this.tipoSel) {
            this.cuentaSel = null;
            this.vtService.getCuentas(this.tipoSel).subscribe(res => {
                if (res.status === 200) {
                    this.cuentaSel = null;
                    this.cuentas = res.cuentas;
                }
            });
            this.loadGrid();
        }
    }

    onCuentaChange($event: any) {
        this.loadGrid();
    }

    goTipos() {
        this.router.navigate(['rubros']);
    }

    verDetalles(rowData) {
        this.codvticektsel = rowData.vt_id;
        this.isShowDetalleRubro = true;
    }

    closeModalDet($event: any) {
        this.isShowDetalleRubro = false;
    }

    onConfirmaView($event) {
        this.isShowDetalleRubro = false;
        this.loadGrid();
    }

    onAnulaView($event) {
        this.isShowDetalleRubro = false;
        this.loadGrid();
    }

}
