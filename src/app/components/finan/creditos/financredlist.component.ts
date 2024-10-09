import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomService} from 'src/app/services/dom.service';
import {FinanCreditosService} from 'src/app/services/finan/finacreditos.service';
import {BaseComponent} from '../../shared/base.component';
import {CtesFinanService} from '../ctesfina.service';
import {SwalService} from '../../../services/swal.service';
import {ExcelUtilService} from '../../../services/utils/excelutil.service';
import {ExportgridService} from '../../../services/exportgrid.service';
import {FinanCredlistFilter} from '../services/finacredlist.service';

@Component({
    selector: 'app-financredlist',
    templateUrl: './financredlist.component.html',
    styleUrls: ['./financredlist.component.scss']
})
export class FinanCredListComponent extends BaseComponent implements OnInit {

    constructor(private credService: FinanCreditosService,
                private router: Router,
                private swalService: SwalService,
                protected finanCredListFilters: FinanCredlistFilter,
                private excelService: ExcelUtilService,
                private gridService: ExportgridService,
                private ctesFinanceService: CtesFinanService,
                private domService: DomService) {
        super();
    }

    gridCreditos: any = {};
    totales: any = {total_monto: 0.0, total_saldopend: 0.0};
    previustimer: any = 0;
    currentRowOver = -1;
    estados: any = [];

    rows = 10;
    page = 0;
    totalRecord = 0;
    isDownloading = false;

    estilos = {
        1: 'otros',
        2: 'aprobado',
        3: 'otros',
        4: 'anulado',
        5: 'cancelado'
    };

    protected readonly Math = Math;

    ngOnInit() {
        this.loadForm();
    }

    clearTotales() {
        this.totales = {total_monto: 0.0, total_saldopend: 0.0};
    }

    onestadochange() {
        this.loadCreditos();
    }

    loadForm() {
        this.credService.getFormLista().subscribe(res => {
            if (this.isResultOk(res)) {
                this.estados = res.estados;
                if (!this.finanCredListFilters.estadosel.est_id) {
                    this.finanCredListFilters.estadosel = this.estados[0];
                }
            }
            this.loadCreditos();
            this.domService.setFocusTm('filtropag');
        });
    }

    getStyle(row) {
        return this.estilos[row.cre_estado];
    }

    setRowOver(rowNumber: number) {
        this.currentRowOver = rowNumber;
    }

    loadCreditos() {
        this.totalRecord = 0;
        this.turnOnLoading();
        let codestado = 0;
        if (this.finanCredListFilters.estadosel.est_id) {
            codestado = this.finanCredListFilters.estadosel.est_id;
        }
        this.clearTotales();
        this.credService.getGrid(this.finanCredListFilters.filtro, codestado).subscribe(res => {
            if (this.isResultOk(res)) {
                this.gridCreditos = res.grid;
                this.totales = res.totales;
                if (this.gridCreditos && this.gridCreditos.data) {
                    this.totalRecord = this.gridCreditos.data.length;
                }
            }
            this.turnOffLoading();
        });
    }

    gotoCrear() {
        this.router.navigate([this.ctesFinanceService.rutaCreaCred]);
    }

    showDetalles(filaCredito) {
        this.router.navigate([this.ctesFinanceService.rutaDetCredSm, filaCredito.cre_id]);
    }

    onrowdblclick(filaCredito) {
        this.showDetalles(filaCredito);
    }

    doFilter() {
        this.previustimer = this.domService.delayKeyup(
            (context) => {
                context.loadCreditos();
            }, 500, this.previustimer, this
        );
    }

    clearFilter() {
        this.finanCredListFilters.filtro = '';
        this.domService.setFocus('filtropag');
        this.doFilter();
    }

    getBodyToExport(griddata: any) {
        const cols = griddata.cols;
        const totales = {};
        cols.forEach(col => {
            let value = '';
            const field = col.field;
            if (field === 'cre_id') {
                value = 'TOTALES:';
            } else if (field === 'cre_monto') {
                value = this.totales.total_monto;
            } else if (field === 'cre_saldopend') {
                value = this.totales.total_saldopend;
            }
            totales[field] = value;
        });

        return {
            title: 'Listado de créditos',
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
                self.excelService.downloadExcelFile(res, 'listado_creditos', true);
            });
    }

    loadDataToExport(fhthen: any) {
        this.isDownloading = false;
        const mxreport = this.gridCreditos.mxrexport || 1000;
        if (this.totalRecord <= this.gridCreditos.mxrexport) {
            this.isDownloading = true;
            fhthen(this.gridCreditos, this);
            this.isDownloading = false;
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
