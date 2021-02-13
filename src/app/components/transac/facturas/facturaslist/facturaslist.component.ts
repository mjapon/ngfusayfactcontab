import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';

@Component({
    selector: 'app-facturaslist',
    templateUrl: './facturaslist.component.html'
})
export class FacturaslistComponent implements OnInit {
    title: any;
    filtro: string;
    isLoading: boolean;
    grid: any;
    selectedItem: any;
    isShowDetallesFactura: boolean;
    codFacturaSel: number;

    constructor(private router: Router,
                private asientoService: AsientoService,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.title = 'Ventas';
        this.filtro = '';
        this.isLoading = true;
        this.grid = {};
        this.isShowDetallesFactura = false;

        this.listar();
    }

    doFilter($event: KeyboardEvent) {

    }

    listar() {
        this.isLoading = true;
        this.asientoService.listarGridVentas().subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
            }
            this.isLoading = false;
        });
    }

    goToForm() {
        this.router.navigate(['trndocform']);
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    anularRow(rowData) {
        this.swalService.fireDialog('¿Seguro que desea eliminar esta factura?').then(confirm => {
            if (confirm.value) {
                this.asientoService.anular(rowData.trn_codigo, '').subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.listar();
                    }
                });
            }
        });
    }

    verRow(rowData) {
        this.codFacturaSel = rowData.trn_codigo;
        this.isShowDetallesFactura = true;
    }
}
