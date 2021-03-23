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
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div style="padding:1px 15px !important; width: 10%">
                        <img src="assets/imgs/{{referente.per_genero===2?'female.png':'male.png'}}"
                             alt="Avatar">
                    </div>
                    <div style="width: 90%">
                        <div class="d-flex flex-row">
                            <div class="w-75">
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
                            <div class="w-25">
                                <div *ngIf="totaldeuda>=0">
                                    <div *ngIf="totaldeuda>0">
                                        <span class="text-warning"> <i
                                                class="fa fa-warning"></i> Cuentas por cobrar:  </span>
                                        <span class="text-warning font-weight-bold">$ {{totaldeuda| number: '.2'}} </span>
                                    </div>
                                </div>

                                <div *ngIf="totalcxp>=0">
                                    <div *ngIf="totalcxp>0">
                                        <span class="text-warning"> <i
                                                class="fa fa-warning"></i> Cuentas por pagar:  </span>
                                        <span class="text-warning font-weight-bold">$ {{totalcxp| number: '.2'}} </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':1===selectedMasterTab}"
                               (click)="selectMasterTab(1, $event)">
                                Datos </a>
                        </li>
                        <li class="nav-item" *ngIf="empHasPlanes">
                            <a class="nav-link hand" [ngClass]="{'active':2===selectedMasterTab}"
                               (click)="selectMasterTab(2, $event)">
                                Suscripciones</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':3===selectedMasterTab}"
                               (click)="selectMasterTab(3, $event)">
                                Facturas Venta</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hand" [ngClass]="{'active':5===selectedMasterTab}"
                               (click)="selectMasterTab(5, $event)">
                                Facturas Compra</a>
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
    selectedMasterTab: number;
    totaldeuda: number;
    totalcxp: number;
    empHasPlanes = false;

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
        if (refchange.currentValue) {
            this.loadDeudas();
        }
    }

    loadDeudas() {
        this.personService.getTotalDeudas(this.referente.per_id).subscribe(res => {
            if (res.status === 200) {
                this.totaldeuda = res.deudas;
                this.totalcxp = res.totalcxp;
            }
        });
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
