import {BaseComponent} from '../../shared/base.component';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {Router} from '@angular/router';
import {CtesAguapService} from './ctes-aguap.service';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-agplistado',
    template: `
        <div>
            <div class="my-3">
                <h4>{{titulo}}</h4>
            </div>

            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <div class="row">
                    <div class="col-md-3">
                        <button class="btn btn-sm btn-outline-primary" (click)="loadGrid()">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    <div class="col-md d-flex justify-content-between">
                        <input type="text" class="form-control form-control-sm" [(ngModel)]="form.filtro"
                               (keyup)="doFilter()" id="filtro"
                               placeholder="Buscar por nombres o número de cédula">

                        <p-dropdown [options]="anios" [(ngModel)]="form.anio"
                                    optionValue="value"
                                    optionLabel="label"
                                    (onChange)="onAnioChange()"></p-dropdown>

                        <p-dropdown [options]="meses" [(ngModel)]="form.mes"
                                    optionValue="mes_id"
                                    optionLabel="mes_nombre"
                                    (onChange)="onMesChange()"></p-dropdown>

                    </div>
                    <div class="col-md-3 d-flex flex-row-reverse">
                        <button class="btn btn-sm btn-outline-primary" (click)="goToHome()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-1">
                    <p-table [value]="grid.data" [paginator]="true" [rows]="50"
                             selectionMode="single"
                             [responsive]="true"
                             [resizableColumns]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th *ngFor="let item of grid.cols" [pSortableColumn]="item.field"
                                    [ngSwitch]="item.field"
                                    [width]="item.width">
                                    <span class="fontsizesm">{{item.label}}</span>
                                    <p-sortIcon [field]="item.field"></p-sortIcon>
                                </th>
                                <th>

                                </th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-rowData>
                            <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData"
                                (dblclick)="verDetalles(rowData)"
                                [ngClass]="{'bg-warning': rowData?.pg_id===0 }">
                                <td *ngFor="let item of grid.cols" [width]="item.width">
                                    <span class="p-column-title">{{item.label}}</span>
                                    <span class="fontsizesm">{{rowData[item.field]}}</span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-dark"
                                            (click)="verDetalles(rowData)"
                                            title="Ver Detalles">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage" let-columns>
                            <tr>
                                <td [attr.colspan]="grid.cols?.length+1">
                                    <span class="text-muted">No hay registros</span>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>`
})
export class AgplistadoComponent extends BaseComponent implements OnChanges {

    @Input() gridNombre: string;
    grid: any = {};
    titulo = 'Listado';
    form: any = {};
    anios: Array<any> = [];
    meses: Array<any> = [];
    previustimer: any = 0;

    constructor(private contAguaServ: ContratoaguaService,
                private router: Router,
                private domService: DomService,
                private ctesAgp: CtesAguapService) {
        super();
    }

    loadForm(): void {
        this.contAguaServ.getFormLista().subscribe(res => {
            if (this.isResultOk(res)) {
                this.form = res.form;
                this.anios = res.anios;
                this.meses = res.meses;
                this.loadGrid();
            }
        });
    }

    loadGrid() {
        this.turnOnLoading();
        this.contAguaServ.getGrid(this.gridNombre, this.form).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.grid = res.grid;
                this.titulo = res.titulo;
                this.domService.setFocusTm('filtro');
            }
        });
    }

    verDetalles(rowData: any) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const change = changes.gridNombre;
        if (change.currentValue) {
            this.loadForm();
        }
    }

    goToHome() {
        this.router.navigate([this.ctesAgp.rutaHome]);
    }

    onAnioChange() {
        this.loadGrid();
    }

    onMesChange() {
        this.loadGrid();
    }

    doFilter() {
        this.previustimer = this.domService.delayKeyup((context) => {
            context.loadGrid();
        }, 500, this.previustimer, this);
    }

}
