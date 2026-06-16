import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../shared/base.component';
import {SwalService} from '../../../../../services/swal.service';
import {PersonaService} from '../../../../../services/persona.service';
import {CreditoService} from '../../../../../services/credito.service';
import {FechasService} from '../../../../../services/fechas.service';
import {Table} from 'primeng/table';
import {AbonoService} from 'src/app/services/abono.service';
import {CtesService} from '../../../../../services/ctes.service';
import {NumberService} from '../../../../../services/number.service';

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

    protected readonly Math = Math;

    constructor(private swalService: SwalService,
                private ctes: CtesService,
                private numberService: NumberService,
                private personaService: PersonaService,
                private creditoService: CreditoService,
                private fechasService: FechasService,
                private abonosService: AbonoService) {
        super();
    }

    ngOnInit(): void {
        this.isLoading = true;
        const newLocal = this;
        newLocal.loadProveedores();
        this.loadData();
    }

    loadProveedores() {
        this.personaService.listarProveedores().subscribe(res => {
            if (res.status === 200) {
                this.proveedores = res.items;
                const todosIndex = this.proveedores.findIndex((prov: any) => prov.per_id === -2);
                if (todosIndex !== -1) {
                    this.proveedores[todosIndex].per_nombres = 'TODOS';
                }
            }
        });
    }

    loadData() {
        this.isLoading = true;
        // this.dataTable?.reset();
        this.updateTable();
    }

    updateTable() {
        this.selectedRows = new Set();
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
                this.totalRecords = this.gridData.data.length;
            }
            this.isLoading = false;
        });
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

    /*
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
    }*/

    gotoCreate() {
        const items = this.selectedRows.size > 0 ? Array.from(this.selectedRows) : [];
        this.swalService.fireDialog(this.ctes.msgConfirmCreateAboFromVenta, '').then(confirm => {
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
                this.abonosService.abonarCreditosProvs(formdata).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadData();
                    } else {
                        this.swalService.fireToastError(res.msg);
                    }
                });
            }
        });
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
        if (!this.canSelectRow(row)) {
            return;
        }

        if (this.selectedRows.has(row)) {
            this.selectedRows.delete(row);
        } else {
            this.selectedRows.add(row);
        }
    }

    toggleSelectAll() {
        const selectableRows = this.getSelectableRows();

        if (this.isAllSelected()) {
            selectableRows.forEach((row: any) => this.selectedRows.delete(row));
        } else {
            selectableRows.forEach((row: any) => this.selectedRows.add(row));
        }
    }

    isAllSelected(): boolean {
        const selectableRows = this.getSelectableRows();

        return selectableRows.length > 0 && selectableRows.every((row: any) => this.selectedRows.has(row));
    }

    hasSelectableRows(): boolean {
        return this.getSelectableRows().length > 0;
    }

    isRowSelected(row: any): boolean {
        return this.selectedRows.has(row);
    }

    canSelectRow(row: any): boolean {
        return Number(row?.saldopend) > 0;
    }

    private getSelectableRows(): any[] {
        if (!this.gridData?.data || !Array.isArray(this.gridData.data)) {
            return [];
        }

        return this.gridData.data.filter((row: any) => this.canSelectRow(row));
    }

    getTotalTotVentasPcByProv(prov: any): number {
        if (!this.gridData?.data || !Array.isArray(this.gridData.data)) {
            return 0;
        }
        const total = this.gridData.data
            .filter((row: any) => row.prov === prov)
            .reduce((total: number, row: any) => total + (Number(row.totventaspc) || 0), 0);
        return this.numberService.round2(total);
    }

    /*
    exportToPdf() {
        this.loadDataToExport(this.exportDataToPdf);
    }

    exportToExcel() {
        this.loadDataToExport(this.exportDataToExcel);
    }*/
}
