import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PersonaService} from '../../services/persona.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';
import {PersonEvService} from '../../services/personev.service';

@Component({
    selector: 'app-resumenref',
    template: `
        <div class="card"
             *ngIf="referente.per_id>0">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-1">
                        <img src="assets/imgs/{{referente.per_genero===2?'female.png':'male.png'}}"
                             alt="Avatar" class="img-fluid">
                    </div>
                    <div class="col-md-7">
                        <h5 class="quitaPaddingMargin">
                            {{referente.per_nombres + ' ' + referente.per_apellidos}}
                        </h5>
                        <h6 class="quitaPaddingMargin">
                            {{referente.per_ciruc}}
                        </h6>
                        <h6 class="quitaPaddingMargin">
                            {{referente.residencia}} {{referente.per_direccion ? ('-' + referente.per_direccion) : ''}}
                        </h6>
                        <h6 class="quitaPaddingMargin">
                            {{referente.per_movil}}
                        </h6>
                    </div>
                    <div class="col-md-4">
                        <div *ngIf="totaldeuda>=0">
                            <div *ngIf="totaldeuda>0">
                                        <span class="text-warning"> <i
                                                class="fa fa-warning"></i> Cuentas por cobrar:  </span>
                                <span class="text-warning fw-bold">$ {{totaldeuda| number: '.2'}} </span>
                            </div>
                        </div>
                        <div *ngIf="totalcxp>=0">
                            <div *ngIf="totalcxp>0">
                                        <span class="text-warning"> <i
                                                class="fa fa-warning"></i> Cuentas por pagar:  </span>
                                <span class="text-warning fw-bold">$ {{totalcxp| number: '.2'}} </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer d-md-flex flex-row justify-content-between flex-wrap">
                <div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(1)}"
                               (click)="selectMasterTab(1, $event)">
                                Datos </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(3)}"
                               (click)="selectMasterTab(3, $event)">
                                Ventas <span class="badge badge-pill" *ngIf="totalestrns?.ventas>0"
                                             [ngClass]="classBadge(3)"> {{totalestrns.ventas}} </span> </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(5)}"
                               (click)="selectMasterTab(5, $event)">
                                Compras <span class="badge badge-pill" *ngIf="totalestrns?.compras>0"
                                              [ngClass]="classBadge(5)"> {{totalestrns.compras}} </span> </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(6)}"
                               (click)="selectMasterTab(6, $event)">
                                Cuentas por cobrar <span *ngIf="totalestrns?.cxcobrar>0"
                                                         class="badge badge-pill"
                                                         [ngClass]="classBadge(6)"> {{totalestrns.cxcobrar}} </span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(7)}"
                               (click)="selectMasterTab(7, $event)">
                                Cuentas por pagar <span *ngIf="totalestrns.cxpagar>0"
                                                        class="badge badge-pill"
                                                        [ngClass]="classBadge(7)"> {{totalestrns.cxpagar}} </span> </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link hand" (click)="cerrar($event)">
                                <i class="fa fa-times"></i>
                                Cerrar</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
})
export class ResumenrefComponent implements OnInit, OnChanges {

    @Input() referente: any;
    @Output() evBtnTabClic = new EventEmitter<any>();
    @Output() evBtnCerrar = new EventEmitter<any>();
    @Input() totalestrns: any = {};
    selectedMasterTab: number;
    totaldeuda: number;
    totalcxp: number;

    constructor(private personService: PersonaService,
                private personEvService: PersonEvService) {
        registerLocaleData(es);

        this.personEvService.source.subscribe(msg => {
            if (msg && msg.tipo === 1) {
                this.loadDeudas();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const refchange = changes.referente;
        if (refchange?.currentValue) {
            this.loadDeudas();
        }
    }

    loadDeudas() {
        if (this.referente) {
            this.personService.getTotalDeudas(this.referente.per_id).subscribe(res => {
                if (res.status === 200) {
                    this.totaldeuda = res.deudas;
                    this.totalcxp = res.totalcxp;
                }
            });
        }
    }

    cssIsActive(tabnum: number) {
        return tabnum === this.selectedMasterTab;
    }

    classBadge(tabnum: number) {
        return tabnum === this.selectedMasterTab ? 'badge-light' : 'badge-primary';
    }

    ngOnInit(): void {
        this.totaldeuda = -1.0;
        this.selectedMasterTab = 1;
        if (!this.referente) {
            this.referente = {};
        }
    }

    selectMasterTab(btnId: number, $event: MouseEvent) {
        this.selectedMasterTab = btnId;
        this.evBtnTabClic.emit(btnId);
    }

    cerrar($event: MouseEvent) {
        this.evBtnCerrar.emit();
    }
}
