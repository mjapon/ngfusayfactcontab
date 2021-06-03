import {Component, OnInit} from '@angular/core';
import {CreditoService} from '../../../services/credito.service';
import {startOfMonth} from 'date-fns';
import {FechasService} from '../../../services/fechas.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-cuentasxcp',
    template: `
        <h4>
            {{title}}
        </h4>
        <div class="row mt-1 mb-1">
            <div class="col-md-3">
                <app-rangofechas [form]="form" (evFilterSel)="listar()" [showlabels]="false"></app-rangofechas>
            </div>
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" class="form-control" id="buscaInput" (keyup)="doFilter($event)"
                           [(ngModel)]="filtro"
                           autocomplete="false"
                           placeholder="Buscar comprobante por número o por referente">
                    <div class="input-group-append">
                        <button class="btn btn-outline-primary" type="button" id="buttonSearh" (click)="listar()"
                                title="Buscar producto o servicio">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-3 d-flex flex-row-reverse">

            </div>
        </div>
        <div class="mt-2 border">
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <p-table [value]="grid.data" [paginator]="true" [rows]="50" selectionMode="single"
                         [(selection)]="selectedItem"
                         (onRowSelect)="onRowSelect($event)"
                         [resizableColumns]="true"
                         [autoLayout]="false"
                         [(contextMenuSelection)]="selectedItem"
                         (onRowUnselect)="onUnRowSelect($event)">
                    <ng-template pTemplate="header">
                        <tr>
                            <th *ngFor="let item of grid.cols" [pSortableColumn]="item.field" [ngSwitch]="item.field"
                                [width]="item.width">
                                {{item.label}}
                                <p-sortIcon [field]="item.field"></p-sortIcon>
                            </th>
                            <th></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-rowData>
                        <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData" (dblclick)="verRow(rowData)">
                            <td *ngFor="let item of grid.cols">
                                <span class="fontsizesm">{{rowData[item['field']]}}</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-dark" (click)="verRow(rowData)" title="Editar">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="footer">
                        <tr>
                            <th [attr.colspan]="grid.cols.length-2">
                                <span class="fw-bold">TOTAL:</span>
                            </th>
                            <th>
                                <span> {{totales.credito|number:'.2'}}</span>
                            </th>
                            <th>
                                <span> {{totales.saldopend|number:'.2'}}</span>
                            </th>
                            <th>

                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage" let-columns>
                        <tr>
                            <td [attr.colspan]="grid.cols.length+1">
                                <span class="text-muted">No hay registros</span>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
        <div *ngIf="isShowDetallesFactura">
            <p-dialog header="Detalles del documento" [modal]="true" [style]="{width: '90vw'}" [baseZIndex]="9"
                      [(visible)]="isShowDetallesFactura">
                <app-facturaview [trncod]="codFacturaSel" (evBtnClosed)="closeDetFact()"></app-facturaview>
            </p-dialog>
        </div>

        <div *ngIf="isShowDetallesCred">
            <p-dialog header="Detalles del crédito" [modal]="true" [style]="{width: '90vw'}" [baseZIndex]="10"
                      [(visible)]="isShowDetallesCred">
                <app-abonosview [codCredito]="credsel.cre_codigo" [codFactura]="credsel.trn_codigo"
                                (evDeudaChange)="onDeudasChange($event)" (evCerrar)="hideDetCredito()"></app-abonosview>
            </p-dialog>
        </div>

    `
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

    constructor(private creditoService: CreditoService,
                private fechasservice: FechasService,
                private router: Router,
                private domService: DomService,
                private route: ActivatedRoute) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
        const hasta = new Date();
        const desde = startOfMonth(hasta);
        this.form = {desde, hasta};
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
        context.listar();
    }

    doFilter($event: KeyboardEvent) {
        this.previustimer = this.domService.delayKeyup(this.filtroDelayFn, 500, this.previustimer, this);
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

        this.creditoService.listarGrid(this.tipo, desde, hasta, this.filtro).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                this.totales = res.totales;
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
}
