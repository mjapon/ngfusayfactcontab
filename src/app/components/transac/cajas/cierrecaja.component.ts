import {BaseComponent} from '../../shared/base.component';
import {Component, OnInit} from '@angular/core';
import {CierreService} from '../../../services/cierre.service';
import {FechasService} from '../../../services/fechas.service';

@Component({
    selector: 'app-cierre-caja',
    template: `
        <h1 class="bd-title">
            <i class="fa-solid fa-cash-register"></i>
            Reporte de cierre de caja
        </h1>
        <div class="mt-2">
            <div class="my-2 d-flex">
                <p-calendar [(ngModel)]="form.cie_dia"
                            id="cie_dia"
                            [showIcon]="true"
                            inputId="cie_dia"
                            [monthNavigator]="true" [yearNavigator]="true"
                            yearRange="2019:2050"
                            dateFormat="dd/mm/yy"></p-calendar>
                <button class="btn btn-outline-primary ms-3 " (click)="loadReporte()">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    Actualizar</button>
            </div>
            <div class="mt-2">
                <div *ngIf="isLoading">
                    <app-loading></app-loading>
                </div>
                <div *ngIf="!isLoading">

                    <!--Listado de ventaseditado -->
                    <h4>Listado de ventas</h4>
                    <p-table [value]="gridventas.data" [paginator]="true" [rows]="50" selectionMode="single"
                             tableStyleClass="table table-hover table-striped table-bordered fusay-table"
                             [resizableColumns]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th *ngFor="let item of gridventas.cols" [pSortableColumn]="item.field"
                                    [ngSwitch]="item.field"
                                    [width]="item.width">
                                    <span class="fontsizenr">{{ item.label }}</span>
                                    <p-sortIcon [field]="item.field"></p-sortIcon>
                                </th>
                                <th>

                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-rowData>
                            <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData"
                                (dblclick)="verRowVentas(rowData)">
                                <td *ngFor="let item of gridventas.cols">
                                    <span class="fontsizesm">{{ rowData[item['field']] }}</span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-dark" (click)="verRowVentas(rowData)"
                                            title="Editar">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="footer">
                            <tr>
                                <th>

                                </th>
                                <th>

                                </th>
                                <th>
                                    <span class="fw-bold">TOTAL:</span>
                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage" let-columns>
                            <tr>
                                <td [attr.colspan]="gridventas.cols.length+1">
                                    <span class="text-muted">No hay registros</span>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>

                    <!--Listado de abonos -->
                    <h4 class="mt-2">Listado de abonos</h4>
                    <p-table [value]="gridabos.data" [paginator]="true" [rows]="50" selectionMode="single"
                             tableStyleClass="table table-hover table-striped table-bordered fusay-table"
                             [resizableColumns]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th *ngFor="let item of gridabos.cols" [pSortableColumn]="item.field"
                                    [ngSwitch]="item.field"
                                    [width]="item.width">
                                    <span class="fontsizenr">{{ item.label }}</span>
                                    <p-sortIcon [field]="item.field"></p-sortIcon>
                                </th>
                                <th>

                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-rowData>
                            <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData"
                                (dblclick)="verRowAbos(rowData)">
                                <td *ngFor="let item of gridabos.cols">
                                    <span class="fontsizesm">{{ rowData[item['field']] }}</span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-dark" (click)="verRowAbos(rowData)"
                                            title="Editar">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="footer">
                            <tr>
                                <th>

                                </th>
                                <th>

                                </th>
                                <th>
                                    <span class="fw-bold">TOTAL:</span>
                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage" let-columns>
                            <tr>
                                <td [attr.colspan]="gridabos.cols.length+1">
                                    <span class="text-muted">No hay registros</span>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>

                    <!--Listado de gastos -->
                    <h4 class="mt-2">Listado de gastos</h4>
                    <p-table [value]="gridgast.data" [paginator]="true" [rows]="50" selectionMode="single"
                             tableStyleClass="table table-hover table-striped table-bordered fusay-table"
                             [resizableColumns]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th *ngFor="let item of gridgast.cols" [pSortableColumn]="item.field"
                                    [ngSwitch]="item.field"
                                    [width]="item.width">
                                    <span class="fontsizenr">{{ item.label }}</span>
                                    <p-sortIcon [field]="item.field"></p-sortIcon>
                                </th>
                                <th>

                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-rowData>
                            <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData"
                                (dblclick)="verRowGastos(rowData)">
                                <td *ngFor="let item of gridgast.cols">
                                    <span class="fontsizesm">{{ rowData[item['field']] }}</span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-dark" (click)="verRowGastos(rowData)"
                                            title="Editar">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="footer">
                            <tr>
                                <th>

                                </th>
                                <th>

                                </th>
                                <th>
                                    <span class="fw-bold">TOTAL:</span>
                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage" let-columns>
                            <tr>
                                <td [attr.colspan]="gridgast.cols.length+1">
                                    <span class="text-muted">No hay registros</span>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class CierrecajaComponent extends BaseComponent implements OnInit {

    form: any;
    gridventas: any;
    gridabos: any;
    gridgast: any;
    totales: any;

    constructor(private cierreService: CierreService,
                private fechasServ: FechasService) {
        super();
    }

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.cierreService.getFormAper().subscribe(res => {
            if (this.isResultOk(res)) {
                this.form = res.form;
                this.form.cie_dia = this.fechasServ.parseString(this.form.cie_dia);

                this.loadReporte();
            }
        });
    }

    loadReporte() {
        const dia = this.fechasServ.formatDate(this.form.cie_dia);
        this.cierreService.getReporte(dia).subscribe(res => {
            if (this.isResultOk(res)) {
                this.gridventas = res.reporte.gridventas;
                this.gridabos = res.reporte.gridabos;
                this.gridgast = res.reporte.gridgast;
                this.totales = res.reporte.totales;
            }
        });
    }


    verRowVentas(rowData: any) {

    }

    verRowAbos(rowData: any) {

    }

    verRowGastos(rowData: any) {

    }
}
