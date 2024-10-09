import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {Router} from '@angular/router';
import {DomService} from '../../../services/dom.service';
import {MenuItem} from 'primeng/api';
import {SwalService} from '../../../services/swal.service';
import {SeccionService} from '../../../services/seccion.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {CategoriasService} from '../../../services/categorias.service';
import {forkJoin} from 'rxjs';
import {FautService} from '../../../services/faut.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {CtesService} from '../../../services/ctes.service';
import {ExcelUtilService} from '../../../services/utils/excelutil.service';
import {ExportgridService} from '../../../services/exportgrid.service';

@Component({
    selector: 'app-articulos-list',
    templateUrl: './articulos-list.component.html',
    styleUrls: ['./articulos-list.component.scss']
})
export class ArticulosListComponent implements OnInit {

    filtro: string;
    grid: any = {};
    //items: Array<any>;
    //cols: Array<any>;
    selectedItem: any;
    enableBtns: boolean;
    page = 0;
    rows = 12;

    itemsCtxMenu: MenuItem[];
    sections: Array<any>;
    selectedSection: any;
    previustimer: any = 0;
    loadingArts: boolean;
    selectedCat = 0;
    categorias: Array<any>;
    totales: any;

    isLoading: boolean;
    isDownloading = false;
    totalRecord = 0;

    constructor(private artsService: ArticuloService,
                private catsService: CategoriasService,
                private domService: DomService,
                private swalService: SwalService,
                private loadinUiServ: LoadingUiService,
                private seccionService: SeccionService,
                private arrayService: ArrayutilService,
                private excelService: ExcelUtilService,
                private gridService: ExportgridService,
                private fautService: FautService,
                private ctes: CtesService,
                private router: Router) {
    }

    ngOnInit() {
        this.loadingArts = true;
        this.isLoading = true;
        this.totales = {};
        this.categorias = [];
        // this.items = new Array<any>();
        // this.cols = new Array<any>();
        this.filtro = '';
        this.itemsCtxMenu = [
            {label: 'Ver detalles', icon: 'fa fa-eye', command: (event) => this.viewItem(this.selectedItem)},
            {label: 'Editar', icon: 'fa fa-pencil', command: (event) => this.editItem(this.selectedItem)},
            {label: 'Eliminar', icon: 'fa fa-trash', command: (event) => this.deleteItem(this.selectedItem)}
        ];
        const seccionObs = this.seccionService.listarUserSecs();
        const catsObs = this.catsService.listar();
        forkJoin([seccionObs, catsObs]).subscribe(res => {
            if (res[0].status === 200) {
                this.sections = res[0].items;
                this.selectedSection = this.sections[0];

                const infoSecSaved = this.fautService.getSeccionInfoSaved();
                if (infoSecSaved) {
                    const result = this.arrayService.getFirstResult(this.sections, el => {
                            return el.sec_id === infoSecSaved.sec_id;
                        }
                    );
                    if (result) {
                        this.selectedSection = result;
                    }
                }
            }
            if (res[1].status === 200) {
                this.categorias = res[1].items;
            }
            this.listar();
            this.isLoading = false;
            this.domService.setFocusTm(this.ctes.buscaInput);
        });
    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    filtroDelayFn(context) {
        context.listar();
    }

    doFilter(ev: any) {
        this.previustimer = this.domService.delayKeyup(this.filtroDelayFn, 500, this.previustimer, this);
    }

    editItem(rowItem: any) {
        this.selectedItem = rowItem;
        this.editar();
    }

    viewItem(rowItem: any) {
        this.selectedItem = rowItem;
        this.router.navigate([this.ctes.mercaderiaView, this.selectedItem.ic_id]);
    }

    getBodyToExport(griddata: any) {
        const cols = griddata.cols;
        const totales = {};
        cols.forEach(col => {
            let value = '';
            const field = col.field;
            if (field === 'ic_nombre') {
                value = 'TOTALES:';
            } else if (field === 'preciocompraiva') {
                value = this.totales.tpciva;
            } else if (field === 'precioventaiva') {
                value = this.totales.tpviva;
            } else if (field === 'ice_stock') {
                value = this.totales.toti;
            }
            totales[field] = value;
        });

        return {
            title: 'Listado de artículos/servicios',
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
                self.excelService.downloadExcelFile(res, 'listado_productos', true);
            });
    }

    loadDataToExport(fhthen: any) {
        this.isDownloading = false;
        const mxreport = this.grid.mxrexport || 1000;
        if (this.totalRecord <= this.grid.mxrexport) {
            this.isDownloading = true;
            fhthen(this.grid, this);
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

    deleteItem(rowItem: any) {
        const nombreProd = rowItem.ic_nombre;
        const msg = '¿Seguro que desea eliminar ' + nombreProd + ' ?';

        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.loadinUiServ.publishBlockMessage();
                this.artsService.anularArticulo(rowItem.ic_id).subscribe(res => {
                    if (res.status === 200) {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.listar();
                        }
                    }
                });
            }
        });
    }

    listar() {
        const secId = this.selectedSection.sec_id;
        this.loadingArts = true;
        let codcat = 0;
        if (this.selectedCat) {
            codcat = this.selectedCat;
        }
        this.totalRecord = 0;
        this.artsService.listar(this.filtro, secId, codcat)
            .subscribe(response => {
                this.loadingArts = false;
                if (response.status === 200) {
                    const grid = response.data;
                    this.totalRecord = grid.data.length;
                    this.grid = grid;
                    this.totales = response.tot;
                    //this.items = grid.data;
                    //this.cols = grid.cols;
                }
            });
    }

    editar() {
        this.router.navigate([this.ctes.mercaderiaForm, this.selectedItem.ic_id]);
    }

    goToForm() {
        this.router.navigate([this.ctes.mercaderiaForm, 0]);
    }

    onDobleClick(rowData) {
        this.viewItem(rowData);
    }

    protected readonly Math = Math;
}
