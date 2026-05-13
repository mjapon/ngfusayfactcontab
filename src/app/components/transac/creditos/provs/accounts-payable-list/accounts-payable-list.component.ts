import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../shared/base.component';
import {SwalService} from '../../../../../services/swal.service';
import {DomService} from '../../../../../services/dom.service';
import {PersonaService} from '../../../../../services/persona.service';
import {CreditoService} from '../../../../../services/credito.service';
import {FechasService} from '../../../../../services/fechas.service';
import {ExportgridService} from '../../../../../services/exportgrid.service';
import {ExcelUtilService} from '../../../../../services/utils/excelutil.service';
import {Table, TableLazyLoadEvent} from 'primeng/table';

@Component({
    selector: 'app-accounts-payable-list',
    templateUrl: './accounts-payable-list.component.html',
    styleUrls: ['./accounts-payable-list.component.scss']
})
export class AccountsPayableListComponent extends BaseComponent implements OnInit {

    @ViewChild('gridTable', {static: false}) private dataTable: Table | undefined;

    form: any = {
        desde: new Date(),
        hasta: new Date()
    };

    proveedores: any[] = [];
    selectedProveedor: any = null;
    selectedRows: Set<any> = new Set();

    gridData: any = {
        cols: [],
        data: []
    };

    filterText = '';    

    rows = 15;
    page = 0;    
    totalRecords = 0;
    isLoading = false;
    isDownloading = false;
    activeTabIndex = 0;
    tipoCuentasPorPagar = 2;

    protected readonly Math = Math;

    constructor(private router: Router,
                private swalService: SwalService,
                private domService: DomService,
                private personaService: PersonaService,
                private creditoService: CreditoService,
                private fechasService: FechasService,
                private SwalService: SwalService,
                private exportgridService: ExportgridService,
                private excelService: ExcelUtilService) {
        super();
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.loadProveedores();
        this.loadData();        
    }

    loadProveedores() {
        this.personaService.listarProveedores().subscribe(res => {
            if (res.status === 200) {
                this.proveedores = res.items;
                //A la fila en this.proveedores tal que per_id sea -2 le cambiamos per_nombres por 'TODOS
                const todosIndex = this.proveedores.findIndex((prov: any) => prov.per_id === -2);
                if (todosIndex !== -1) {
                    this.proveedores[todosIndex].per_nombres = 'TODOS';
                }
            }
        });
    }

    loadData() {
        this.isLoading = true;
        this.dataTable?.reset();
    }

    updateTable() {
        this.isLoading = true;
        let desde = '';
        let hasta = '';
        if (this.form.desde) {
            desde = this.fechasService.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            hasta = this.fechasService.formatDate(this.form.hasta);
        }

        const provId = this.selectedProveedor ? this.selectedProveedor.per_id : 0;

        this.creditoService.listarGridCxpProvs(desde, hasta, provId, this.rows, this.page).subscribe(res => {
            if (res.status === 200) {
                this.gridData = res.report;
                if (res.report.total) {
                    this.totalRecords = res.report.total;
                }
            }
            this.isLoading = false;
        });
    }

    doLazyLoad($event: TableLazyLoadEvent) {
        if (this.form && $event.first !== undefined) {
            this.page = $event.first;
            this.updateTable();
        }
    }

    getBodyToExport(griddata: any) {
        const cols = griddata.cols;
        const totales: any = {};
        cols.forEach((col: any) => {
            let value = '';
            const field = col.field;
            if (field === 'per_nombres') {
                value = 'TOTALES:';
            }
            totales[field] = value;
        });

        return {
            title: 'Cuentas por Pagar Proveedores',
            columns: cols,
            data: griddata.data,
            totals: totales
        };
    }

    exportDataToPdf(griddata: any, self: any) {
        self.exportgridService.exportListPDF(self.getBodyToExport(griddata))
            .subscribe((res: ArrayBuffer) => {
                self.exportgridService.viewPdf(res);
            });
    }

    exportDataToExcel(griddata: any, self: any) {
        self.exportgridService.exportListExcel(self.getBodyToExport(griddata))
            .subscribe((res: Blob) => {
                self.excelService.downloadExcelFile(res, 'cuentas_por_pagar', true);
            });
    }

    loadDataToExport(fhthen: any) {
        this.isDownloading = false;
        const mxreport = this.gridData.mxrexport || 1000;
        if (this.totalRecords <= mxreport) {
            this.isDownloading = true;
            let desde = '';
            let hasta = '';
            if (this.form.desde) {
                desde = this.fechasService.formatDate(this.form.desde);
            }
            if (this.form.hasta) {
                hasta = this.fechasService.formatDate(this.form.hasta);
            }
            const provId = this.selectedProveedor ? this.selectedProveedor.per_id : 0;
            
            this.creditoService.listarGridCxpProvsForExport(desde, hasta, provId, this.rows, this.page).subscribe(res => {
                this.isDownloading = false;
                if (res.status === 200) {
                    fhthen(res.report, this);
                }
            });
        } else {
            this.swalService.fireToastError('Puede descargar un máximo de ' + mxreport +
                ' filas, favor ingrese mas filtros de búsqueda');
        }
    }

    gotoCreate() {
        const items = this.selectedRows.size > 0 ? Array.from(this.selectedRows) : [];
        this.swalService.fireDialog('¿Confirma que desea crear cuentas por pagar para los proveedores listados?', '').then(confirm => {
            if (confirm.value) {
                let from = '';
                let to = '';
                if (this.form.desde) {
                    from = this.fechasService.formatDate(this.form.desde);
                }
                if (this.form.hasta) {
                    to = this.fechasService.formatDate(this.form.hasta);
                }                
                const formdata = {from, to, items};
                this.creditoService.crearCuentasPorPagarProvs(formdata).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadData();
                    }else { 
                        this.swalService.fireToastError(res.msg);
                    }
                });
            }
        });
        
    }

    applyFilter() {
        console.log('Filtrando por:', this.filterText);
    }

    clearFilter() {
        this.filterText = '';
        this.selectedProveedor = null;
        if (this.form) {
            this.form.desde = new Date();
            this.form.hasta = new Date();
        }
        this.loadData();
    }

    toggleRowSelection(row: any) {
        if (this.selectedRows.has(row)) {
            this.selectedRows.delete(row);
        } else {
            this.selectedRows.add(row);
        }
    }

    toggleSelectAll() {
        if (this.isAllSelected()) {
            this.selectedRows.clear();
        } else {
            this.gridData.data.forEach((row: any) => this.selectedRows.add(row));
        }
    }

    isAllSelected(): boolean {
        return this.gridData.data.length > 0 && this.selectedRows.size === this.gridData.data.length;
    }

    isRowSelected(row: any): boolean {
        return this.selectedRows.has(row);
    }

    onRowDblClick(rowData: any) {
        // Implementar lógica de doble click
    }

    exportToPdf() {
        this.loadDataToExport(this.exportDataToPdf);
    }

    exportToExcel() {
        this.loadDataToExport(this.exportDataToExcel);
    }
}
