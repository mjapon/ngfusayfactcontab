import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../services/credito.service';
import {FechasService} from '../../../../services/fechas.service';
import {DomService} from '../../../../services/dom.service';
import {TableLazyLoadEvent} from 'primeng/table';
import {ExcelUtilService} from '../../../../services/utils/excelutil.service';
import {ExportgridService} from '../../../../services/exportgrid.service';
import {SwalService} from '../../../../services/swal.service';

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
    tipospagos = [];
    isDownloading = false;
    protected readonly Math = Math;

    constructor(private creditoService: CreditoService,
                private fechasservice: FechasService,
                private excelService: ExcelUtilService,
                private gridService: ExportgridService,
                private swalService: SwalService,
                private domService: DomService,
                private route: ActivatedRoute) {
        this.route.paramMap.subscribe(params => {
            this.tipo = parseInt(params.get('tipo'), 10);
        });
        this.tipospagos = this.creditoService.getTiposPagos();
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
        const fechas = this.fechasservice.getDateFilters(this.form);
        this.creditoService.listarGrid(this.tipo, fechas.desde, fechas.hasta, this.filtro, this.rows, this.page, this.tipopago).subscribe(res => {
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

    getBodyToExport(griddata: any) {
        const cols = griddata.cols;
        const totales = {};
        cols.forEach(col => {
            let value = '';
            const field = col.field;
            if (field === 'referente') {
                value = 'TOTALES:';
            } else if (field === 'dt_valor') {
                value = griddata.totales.credito;
            } else if (field === 'cre_saldopen') {
                value = griddata.totales.saldopend;
            }
            totales[field] = value;
        });

        return {
            title: this.title,
            columns: cols,
            data: griddata.data,
            totals: totales
        };
    }


    exportDataToPdf(griddata: any, self: any) {
        self.gridService.exportListPDF(self.getBodyToExport(griddata))
            .subscribe((res: ArrayBuffer) => {
                self.gridService.viewPdf(res);
            });
    }

    exportDataToExcel(griddata: any, self: any) {
        self.gridService.exportListExcel(self.getBodyToExport(griddata))
            .subscribe((res: Blob) => {
                self.excelService.downloadExcelFile(res, 'listado', true);
            });
    }

    loadDataToExport(fhthen: any) {
        this.isDownloading = false;
        const mxreport = this.grid.mxrexport || 1000;
        if (this.totalRecords <= this.grid.mxrexport) {
            this.isDownloading = true;
            const fechas = this.fechasservice.getDateFilters(this.form);
            this.creditoService.listarGridForExport(this.tipo, fechas.desde, fechas.hasta, this.filtro, this.tipopago).subscribe(res => {
                this.isDownloading = false;
                if (res.status === 200) {
                    fhthen(res.grid, this);
                    this.isDownloading = false;
                }
            });
        } else {
            this.swalService.fireToastError('Puede descargar un máximo de ' + mxreport +
                ' filas, favor ingrese mas filtros de búsqueda');
        }
    }

    exportToPdf() {
        this.loadDataToExport(this.exportDataToPdf);
    }

    exportToExcel() {
        this.loadDataToExport(this.exportDataToExcel);
    }
}
