import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {startOfMonth} from 'date-fns';
import {FechasService} from '../../../../services/fechas.service';
import {LocalStorageService} from '../../../../services/local-storage.service';
import {DomService} from '../../../../services/dom.service';
import {Table, TableLazyLoadEvent} from 'primeng/table';


@Component({
    selector: 'app-facturaslist',
    templateUrl: './facturaslist.component.html',
    styleUrls: ['./facturaslist.scss']
})
export class FacturaslistComponent implements OnInit {

    @ViewChild('transaccTable', {static: false}) private dataTable: Table;

    title: any;
    filtro: string;
    isLoading: boolean;
    grid: any;
    selectedItem: any;
    rowDataSel: any;
    isShowDetallesFactura: boolean;
    codFacturaSel: number;
    form: any = {};
    previustimer: any = 0;
    totales: any = {};
    transaccs: Array<any> = [];
    rows = 12;
    page = 0;
    totalRecord = 0;

    @Input() tracodigo: number;
    @Input() tipo: number;

    constructor(private router: Router,
                private asientoService: AsientoService,
                private localStgServ: LocalStorageService,
                private domService: DomService,
                private fechasservice: FechasService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.title = 'Compras';
        if (this.tipo === 1) {
            this.title = 'Ventas';
        }
        this.filtro = '';
        this.isLoading = true;
        this.grid = {};
        this.isShowDetallesFactura = false;
        const hasta = new Date();
        const desde = startOfMonth(hasta);
        this.form = {desde, hasta, tipo: this.tipo};
        this.form.tracod = 0;
        this.asientoService.listarTransaccsBytTipo(this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.transaccs = res.items;
            }
            this.listar();
        });
    }


    ondesdechange() {

    }

    onhastachange() {

    }

    filtroDelayFn(context) {
        context.listar();
    }

    doFilter($event: KeyboardEvent) {
        this.previustimer = this.domService.delayKeyup(this.filtroDelayFn, 500, this.previustimer, this);
    }

    listar() {
        this.isLoading = true;
        this.dataTable.reset();
    }

    limpiar() {
        this.filtro = '';
        this.listar();
    }

    updateTable() {
        let desde = '';
        let hasta = '';
        if (this.form.desde) {
            desde = this.fechasservice.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            hasta = this.fechasservice.formatDate(this.form.hasta);
        }
        this.isLoading = true;
        this.asientoService.listarGridVentas(desde, hasta, this.filtro, this.form.tracod,
            this.tipo, this.rows, this.page).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                if (res.grid.total) {
                    this.totalRecord = res.grid.total;
                }

                if (this.page === 0) {
                    this.totales = res.totales;
                    this.totalRecord = res.grid.total;
                }
            }
            this.isLoading = false;
        });
    }

    goToForm() {
        this.router.navigate(['trndocform', this.tracodigo, 'c']);
    }

    goToFormFact(tipo, $event: MouseEvent) {
        $event.preventDefault();
        this.router.navigate(['trndocform', tipo, 'c']);
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    verRow(rowData) {
        this.rowDataSel = rowData;
        this.codFacturaSel = rowData.trn_codigo;
        this.isShowDetallesFactura = true;
    }

    closeDetFact() {
        this.isShowDetallesFactura = false;
    }

    onEditar($event: any) {
        console.log('on editar, ', $event, this.rowDataSel);
        this.closeDetFact();
        this.localStgServ.setItem('trncoded', $event);
        this.router.navigate(['trndocform', this.rowDataSel.tra_codigo, 'e']);
    }

    doLazyLoad($event: TableLazyLoadEvent) {
        if (this.form) {
            this.page = $event.first;
            this.updateTable();
        }
    }

    protected readonly Math = Math;
}
