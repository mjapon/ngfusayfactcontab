import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../services/credito.service';
import {FechasService} from '../../../../services/fechas.service';
import {DomService} from '../../../../services/dom.service';
import {TableLazyLoadEvent} from 'primeng/table';

@Component({
    selector: 'app-cuentasxcp',
    templateUrl: './cuentasxcp.component.html',
    styleUrls: ['./cuentaxcp.component.scss']
})
export class CuentasxcpComponent implements OnInit {
    tipo: number;
    title: any;
    filtro: string;
    isLoading: boolean;
    grid: any = {};
    selectedItem: any;
    isShowDetallesFactura: boolean;
    codFacturaSel: number;
    form: any;
    previustimer: any = 0;
    totales: any;
    isShowDetallesCred: boolean;
    credsel: any;
    totalRecords = 0;
    rows = 12;
    page = 0;
    tipopago = 1; // 0-todos, 1-con saldo pendiente, 2-pagados en su totalidad

    tipospagos = [{label: 'Con saldo pendiente', value: 1},
        {label: 'Créditos cancelados', value: 2}, {label: 'Todos', value: 0}];

    constructor(private creditoService: CreditoService,
                private fechasservice: FechasService,
                private router: Router,
                private domService: DomService,
                private route: ActivatedRoute) {
        this.route.paramMap.subscribe(params => {
            this.tipo = parseInt(params.get('tipo'), 10);
        });
    }

    ngOnInit(): void {
        this.title = 'Cuentas por cobrar';
        if (this.tipo === 2) {
            this.title = 'Cuentas por pagar';
        }
        this.filtro = '';
        this.isLoading = true;
        this.grid = {};
        this.isShowDetallesFactura = false;
        const hasta = '';
        const desde = '';
        this.form = {desde, hasta};
        this.domService.setFocusTm('buscaInput', 500);
        this.listar();
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    ondesdechange() {

    }

    onhastachange() {

    }

    filtroDelayFn(context) {
        context.page = 0;
        context.listar();
    }

    doFilter() {
        this.previustimer = this.domService.delayKeyup(this.filtroDelayFn, 500, this.previustimer, this);
    }

    onTipoBusquedaChange() {
        this.listar();
    }

    listar() {
        this.isLoading = true;
        let desde = '';
        let hasta = '';
        if (this.form.desde) {
            desde = this.fechasservice.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            hasta = this.fechasservice.formatDate(this.form.hasta);
        }

        this.creditoService.listarGrid(this.tipo, desde, hasta, this.filtro, this.rows, this.page, this.tipopago).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                if (this.grid.totales) {
                    this.totales = this.grid.totales;
                }
                if (this.grid.count) {
                    this.totalRecords = this.grid.count;
                } else if (this.page === 0) {
                    this.totalRecords = 0;
                }
            }
            this.isLoading = false;
        });
    }

    closeDetFact() {
        this.isShowDetallesFactura = false;
    }

    verRow(rowData) {
        this.credsel = rowData;
        this.isShowDetallesCred = true;
    }

    hideDetCredito() {
        this.isShowDetallesCred = false;
    }

    onDeudasChange($event: any) {
        this.listar();
    }

    clear() {
        this.filtro = '';
        this.doFilter();
    }

    doLazyLoad($event: TableLazyLoadEvent) {
        if (this.form) {
            this.page = $event.first;
            this.listar();
        }
    }
}
