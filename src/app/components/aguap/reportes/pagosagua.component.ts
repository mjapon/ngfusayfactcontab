import {BaseComponent} from '../../shared/base.component';
import {Component, OnInit} from '@angular/core';
import {AgpReporteLecturasComponent} from './lecturasagua.component';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {LectomedaguaService} from '../../../services/agua/lectomedagua.service';
import {SwalService} from '../../../services/swal.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {DomService} from '../../../services/dom.service';
import {ArrayutilService} from "../../../services/arrayutil.service";

@Component({
    selector: 'app-agpreppagos',
    template: `
        <div>
            <div class="my-3">
                <h4>Listado de pagos ({{grid?.data?.length}})</h4>
            </div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <div class="d-flex">
                    <div class="d-flex justify-content-between" style="width: 80%">
                        <input type="text" class="form-control form-control-sm" [(ngModel)]="form.filtro"
                               (keyup)="doFilter()" id="filtro"
                               placeholder="Buscar por nombres o número de cédula">
                        <p-dropdown [options]="anios" [(ngModel)]="form.anio"
                                    optionValue="value"
                                    optionLabel="label"
                                    (onChange)="loadGrid()"></p-dropdown>
                        <p-dropdown [options]="meses" [(ngModel)]="form.mes"
                                    optionValue="mes_id"
                                    optionLabel="mes_nombre"
                                    (onChange)="loadGrid()"></p-dropdown>
                        <p-dropdown [options]="estados" [(ngModel)]="form.estado"
                                    optionValue="value"
                                    optionLabel="label"
                                    (onChange)="loadGrid()"></p-dropdown>
                    </div>
                    <div class="d-flex ms-3">
                        <button class="btn btn-sm btn-outline-primary" (click)="loadGrid()">
                            Buscar <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary ms-2" (click)="goToHome()">
                            <i class="fas fa-arrow-left"></i> Retornar
                        </button>
                    </div>
                </div>
                <div class="mt-1">
                    <div>
                        <p-table [value]="grid.data" [paginator]="true" [rows]="50"
                                 selectionMode="single"
                                 [responsive]="true"
                                 [resizableColumns]="true">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th width="2%">
                                        <span class="fontsizesm fw-lighter">#</span>
                                    </th>
                                    <th *ngFor="let item of grid.cols" [pSortableColumn]="item.field"
                                        [ngSwitch]="item.field"
                                        [width]="item.width">
                                        <span class="fontsizesm">{{item.label}}</span>
                                        <p-sortIcon [field]="item.field"></p-sortIcon>
                                    </th>
                                    <th></th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-rowData>
                                <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData"
                                    [ngClass]="{'lecto-pend': rowData.trn_codigo ===0}">
                                    <td>
                                        <span class="fontsizesm fw-lighter">{{grid.data.indexOf(rowData) + 1}}</span>
                                    </td>
                                    <td *ngFor="let item of grid.cols" [width]="item.width">
                                        <span class="p-column-title">{{item.label}}</span>
                                        <span class="fontsizesm">{{rowData[item.field]}}</span>
                                    </td>
                                    <td>
                                        <!--
                                        <button *ngIf="rowData.trn_codigo ===0 && rowData.lmd_id>0" class="btn btn-sm"
                                                title="Registrar Pago" (click)="gotoCreaPago(rowData)">
                                            <i class="fa fa-plus-circle"></i>
                                        </button>
                                        <button *ngIf="rowData.trn_codigo >0" class="btn btn-sm"
                                                title="Anular pago" (click)="borrarPago(rowData)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                        -->
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage" let-columns>
                                <tr>
                                    <td [attr.colspan]="grid.cols?.length+1">
                                        <span class="text-muted">No hay registros</span>
                                    </td>
                                    <td></td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
            <!--
            <div *ngIf="isModalVisible">
                <p-dialog header="Registrar lectura de agua" [modal]="true" [style]="{width: '70vw'}"
                          [closeOnEscape]="true"
                          [autoZIndex]="false"
                          [(visible)]="isModalVisible">
                    <app-crealectomed [anio]="form?.anio" [mes]="form?.mes" [mdgid]="filasel?.mdg_id"
                                      (evCancel)="onCancelCreaLect()"
                                      (evSaved)="onLecturaSaved()"></app-crealectomed>
                </p-dialog>
            </div>
            -->
        </div>
    `,
    styles: [`
        :host ::ng-deep .lecto-pend {
            background-color: #ffa500 !important;
        }

        :host ::ng-deep .lecto-reg {
            background-color: #3cb371 !important;
        }
    `]
})
export class AgpReportePagosComponent extends AgpReporteLecturasComponent implements OnInit {

    gridNombre = 'agp_pagos';

    constructor(protected contAguaServ: ContratoaguaService,
                protected lectomedService: LectomedaguaService,
                protected swalService: SwalService,
                protected router: Router,
                protected ctes: CtesAguapService,
                protected arrayService: ArrayutilService,
                protected domService: DomService,
                protected ctesAgp: CtesAguapService) {
        super(contAguaServ, lectomedService, swalService, router, ctes, arrayService, domService, ctesAgp);
    }

    gotoCreaPago(rowData: any) {
        alert('Logica crea pago');

    }

    borrarPago(rowData: any) {
        alert('Logica anular pago');
    }
}
