import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {getDate, startOfMonth} from 'date-fns';
import {FechasService} from '../../../../services/fechas.service';
import {LocalStorageService} from '../../../../services/local-storage.service';
import {DomService} from '../../../../services/dom.service';
import {Table, TableLazyLoadEvent} from 'primeng/table';
import {ExcelUtilService} from '../../../../services/utils/excelutil.service';
import {SwalService} from '../../../../services/swal.service';


@Component({
    selector: 'app-facturaslist',
    templateUrl: './facturaslist.component.html',
    styleUrls: ['./facturaslist.scss']
})
export class FacturaslistComponent implements OnInit {

    constructor(private router: Router,
                private asientoService: AsientoService,
                private localStgServ: LocalStorageService,
                private swalService: SwalService,
                private domService: DomService,
                private excelService: ExcelUtilService,
                private fechasservice: FechasService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

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
    nrowsexport = 10;
    page = 0;
    totalRecord = 0;
    isDownloading = false;

    @Input() tracodigo: number;
    @Input() tipo: number;

    protected readonly Math = Math;

    ngOnInit(): void {
        this.title = 'Compras';
        if (this.tipo === 1) {
            this.title = 'Ventas';
        } else if (this.tipo === 3) {
            this.title = 'Notas de Crédito';
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

    getDateFilters() {
        let desde = '';
        let hasta = '';
        if (this.form.desde) {
            desde = this.fechasservice.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            hasta = this.fechasservice.formatDate(this.form.hasta);
        }
        return {desde, hasta};
    }

    updateTable() {
        const dateFilters: { desde: string, hasta: string } = this.getDateFilters();
        this.isLoading = true;
        this.asientoService.listarGridVentas(dateFilters.desde, dateFilters.hasta, this.filtro, this.form.tracod,
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
                console.log('Valor de grid es:', this.grid);
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

    loadDataToExport(fhthen: any) {
        this.isDownloading = false;
        const mxreport = this.grid.mxrexport || 1000;
        if (this.totalRecord <= this.grid.mxrexport) {
            this.isDownloading = true;
            const dateFilters: { desde: string, hasta: string } = this.getDateFilters();
            this.asientoService.listarGridVentasForExport(dateFilters.desde,
                dateFilters.hasta, this.filtro, this.form.tracod, this.tipo, this.nrowsexport).subscribe(res => {
                this.isDownloading = false;
                if (res.status === 200) {
                    const gridToExport = res.grid;
                    fhthen(gridToExport, this);
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

    viewPdf(res) {
        this.asientoService.viewBlob(res, 'application/pdf');
    }

    getBodyToExport(griddata: any) {
        const cols = griddata.cols;
        const totales = {};
        cols.forEach(col => {
            let value = '';
            const field = col.field;
            if (field === 'referente') {
                value = 'TOTALES:';
            } else if (field === 'efectivo') {
                value = griddata.sumatorias.efectivo;
            } else if (field === 'credito') {
                value = griddata.sumatorias.credito;
            } else if (field === 'saldopend') {
                value = griddata.sumatorias.saldopend;
            } else if (field === 'total') {
                value = griddata.sumatorias.total;
            }
            totales[field] = value;
        });

        return {
            title: 'Listado de ventas',
            columns: cols,
            data: griddata.data,
            totals: totales
        };
    }

    exportDataToPdf(griddata: any, self: any) {
        self.asientoService.exportVentasListPDF(self.getBodyToExport(griddata))
            .subscribe((res: ArrayBuffer) => {
                self.viewPdf(res);
            });
    }

    exportDataToExcel(griddata: any, self: any) {
        self.asientoService.exportVentasList(self.getBodyToExport(griddata))
            .subscribe((res: Blob) => {
                self.excelService.downloadExcelFile(res, 'listado_ventas', true);
            });
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
}
