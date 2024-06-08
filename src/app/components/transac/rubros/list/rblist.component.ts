import {BaseComponent} from '../../../shared/base.component';
import {Component, OnInit} from '@angular/core';
import {AsirubroService} from '../../../../services/asirubro.service';
import {SwalService} from '../../../../services/swal.service';
import {FechasService} from '../../../../services/fechas.service';

@Component({
    selector: 'app-rblist',
    template: `
        <div>
            <h3>Repartición de ingresos por rubro</h3>
            <hr>

            <div class="d-flex my-2">
                <div>
                    <app-rangofechas [form]="form" (evFilterSel)="loadRubros()" [showlabels]="false"></app-rangofechas>
                </div>
                <div class="ms-3">
                    <button class="btn btn-outline-primary" (click)="guardar()"><span class="fa-solid fa-floppy-disk"></span> Guardar
                    </button>
                    <button class="btn btn-outline-primary ms-2" (click)="loadRubros()"><span
                            class="fa fa-sync-alt"></span>
                        Actualizar
                    </button>
                </div>
            </div>

            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>

            <div class="my-3">
                <span class="fw-bold">Facturas en efectivo</span>
            </div>
            <div class="table-responsive" *ngIf="!isLoading" style="height: 25rem; overflow: scroll;">
                <table class="table table-bordered table-hover table-sm">
                    <thead>
                    <tr>
                        <th scope="col" *ngFor="let col of cols">
                            <span class="fontsizesm">
                                {{col.label}} </span>
                        </th>
                        <th>
                            <span class="fa fa-pencil"></span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let fila of items" class="hand" (click)="showDetalleRubro(fila)"
                        [ngClass]="fila.rb_total>fila.venta ?'table-danger':''">
                        <td *ngFor="let col of cols" [ngClass]="col.field.match('venta|efectivo')?'table-success':''">
                            <div *ngIf="col.field.startsWith('rb_valor_'); else divRead">
                                <input type="text" class="form-control form-control-sm"
                                       (keyup)="onFilaRubroChange(fila)" (focusin)="$event.target?.select()"
                                       [disabled]="fila.row_disabled"
                                       [(ngModel)]="fila[col.field]">
                            </div>
                            <ng-template #divRead>
                                <span class="fontsizesm"> {{fila[col.field]}} </span>
                            </ng-template>
                        </td>
                        <td>
                            <span class="fas fa-edit" *ngIf="fila.row_disabled"
                                  (click)="fila.row_disabled=false"></span>
                        </td>
                    </tr>
                    <tr>
                        <td *ngFor=" let tot of totalesfact">
                            <span>{{tot.total}}</span>
                        </td>
                        <td>

                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-3">
                <span class="fw-bold">Abonos</span>
            </div>
            <div class="table-responsive" *ngIf="!isLoading" style="height: 25rem; overflow: scroll;">
                <table class="table table-bordered table-hover table-sm">
                    <thead>
                    <tr>
                        <th scope="col" *ngFor="let col of colsabos">
                            <span class="fontsizesm">
                                {{col.label}} </span>
                        </th>
                        <th>
                            <span class="fa fa-pencil"></span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let fila of itemsabos" class="hand" (click)="showDetalleRubro(fila)"
                        [ngClass]="fila.rb_total>(fila.abono+fila.pagefectivo)?'table-danger':''">
                        <td *ngFor="let col of colsabos"
                            [ngClass]="col.field.match('abono|pagefectivo')?'table-success':''">
                            <div *ngIf="col.field.startsWith('rb_valor_'); else divRead">
                                <input type="text" class="form-control form-control-sm"
                                       (keyup)="onFilaRubroChange(fila)" (focusin)="$event.target?.select()"
                                       [disabled]="fila.row_disabled"
                                       [(ngModel)]="fila[col.field]">
                            </div>
                            <ng-template #divRead>
                                <span class="fontsizesm"> {{fila[col.field]}} </span>
                            </ng-template>
                        </td>
                        <td>
                            <span class="fas fa-edit" *ngIf="fila.row_disabled"
                                  (click)="fila.row_disabled=false"></span>
                        </td>
                    </tr>
                    <tr>
                        <td *ngFor="let tot of totalesabo">
                            <span>{{tot.total}}</span>
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
})
export class RblistComponent extends BaseComponent implements OnInit {

    items: Array<any> = [];
    cols: Array<any> = [];

    itemsabos: Array<any> = [];
    colsabos: Array<any> = [];

    totalesfact: any = {};
    totalesabo: any = {};
    form: any = {};

    constructor(private rbService: AsirubroService,
                private fechasServ: FechasService,
                private swalService: SwalService) {
        super();
    }

    loadform() {
        this.rbService.getForm().subscribe(res => {
            if (this.isResultOk(res)) {
                console.log('Valor de res es:', res);
                this.form = res.form;
                this.form.desde = this.fechasServ.parseString(this.form.desde);
                this.form.hasta = this.fechasServ.parseString(this.form.hasta);

                this.loadRubros();
            }
        });
    }

    loadRubros() {
        this.turnOnLoading();
        this.rbService.listar(this.fechasServ.formatDate(this.form.desde),
            this.fechasServ.formatDate(this.form.hasta)).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.cols = res.grid.cols;
                this.items = res.grid.items;
                this.colsabos = res.gridabos.cols;
                this.itemsabos = res.gridabos.items;
                this.totalesfact = res.grid.totales;
                this.totalesabo = res.gridabos.totales;
            }
        });
    }

    showDetalleRubro(fila: any) {

    }

    ngOnInit(): void {
        this.loadform();
    }

    onFilaRubroChange(fila: any) {
        console.log('Valor de fila es,', fila);
    }

    guardar() {
        this.turnOnLoading();
        this.rbService.guardar(this.items).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.guardarAbos();
            }
        });
    }

    guardarAbos() {
        this.turnOnLoading();
        this.rbService.guardar(this.itemsabos).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.swalService.fireToastSuccess(res.msg);
                this.loadRubros();
            }
        });
    }

}
