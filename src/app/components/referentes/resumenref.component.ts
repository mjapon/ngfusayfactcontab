import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PersonaService} from '../../services/persona.service';
import {PersonEvService} from '../../services/personev.service';
import {DatosloggedService} from 'src/app/services/datoslogged.service';

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
                        <div class="bg-warning bg-gradient p-2 rounded" *ngIf="totaldeuda>0||totalcxp>0">
                            <div *ngIf="totaldeuda>0">
                                <span> <i class="fa fa-warning"></i> Cuentas por cobrar:  </span>
                                <span class="fw-bold ms-1">$ {{totaldeuda| number: '.2'}} </span>
                            </div>
                            <div *ngIf="totalcxp>0">
                                <span> <i class="fa fa-warning"></i> Cuentas por pagar:  </span>
                                <span class="fw-bold ms-1">$ {{totalcxp| number: '.2'}} </span>
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
                               (click)="selectMasterTab(1)">
                                Datos </a>
                        </li>
                        <li class="nav-item" *ngIf="hasRoleVentas">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(3)}"
                               (click)="selectMasterTab(3)">
                                Ventas <span role="button" class="badge " *ngIf="totalestrns?.ventas>0"
                                             [ngClass]="classBadge(3)"> {{totalestrns.ventas}} </span> </a>
                        </li>
                        <li class="nav-item" *ngIf="hasRoleCompras">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(5)}"
                               (click)="selectMasterTab(5)">
                                Compras <span role="button" class="badge " *ngIf="totalestrns?.compras>0"
                                              [ngClass]="classBadge(5)"> {{totalestrns.compras}} </span> </a>
                        </li>
                        <li class="nav-item" *ngIf="hasRoleCxc">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(6)}"
                               (click)="selectMasterTab(6)">
                                Cuentas por cobrar <span role="button" *ngIf="totalestrns?.cxcobrar>0"
                                                         class="badge "
                                                         [ngClass]="classBadge(6)"> {{totalestrns.cxcobrar}} </span></a>
                        </li>
                        <li class="nav-item" *ngIf="hasRoleCxp">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(7)}"
                               (click)="selectMasterTab(7)">
                                Cuentas por pagar <span role="button" *ngIf="totalestrns.cxpagar>0"
                                                        class="badge "
                                                        [ngClass]="classBadge(7)"> {{totalestrns.cxpagar}} </span> </a>
                        </li>
                        <li class="nav-item" *ngIf="hasRoleAgua">
                            <a class="nav-link hand" [ngClass]="{'active':cssIsActive(8)}"
                               (click)="selectMasterTab(8)">
                                Contratos agua </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link hand" (click)="cerrar()">
                                <i class="fa-solid fa-xmark"></i>
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

    hasRoleCompras = false;
    hasRoleVentas = false;
    hasRoleCxc = false;
    hasRoleCxp = false;
    hasRoleAgua = false;


    constructor(private personService: PersonaService,
        private datosLoggedServ: DatosloggedService,
        private personEvService: PersonEvService) {
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
        return tabnum === this.selectedMasterTab ? 'text-bg-dark' : 'text-bg-primary';
    }

    ngOnInit(): void {
        this.totaldeuda = -1.0;
        this.selectedMasterTab = 1;
        if (!this.referente) {
            this.referente = {};
        }
        else {
            this.checkRoles();
        }
    }

    checkRoles() {

        this.hasRoleCompras = false;
        this.hasRoleVentas = false;
        this.hasRoleCxc = false;
        this.hasRoleCxp = false;
        this.hasRoleAgua = false;

        this.datosLoggedServ.checkPermiso("VN_LISTAR").subscribe(res => {
            if (res.chkperm) {
                this.hasRoleVentas = true;
            }
        });
        this.datosLoggedServ.checkPermiso("CM_LISTAR").subscribe(res1 => {
            if (res1.chkperm) {
                this.hasRoleCompras = true;
            }
        });
        this.datosLoggedServ.checkPermiso("CXC_LISTAR").subscribe(res2 => {
            if (res2.chkperm) {
                this.hasRoleCxc = true;
            }
        });
        this.datosLoggedServ.checkPermiso("CXP_LISTAR").subscribe(res3 => {
            if (res3.chkperm) {
                this.hasRoleCxp = true;
            }
        });
        this.datosLoggedServ.checkPermiso("AGP_ADM").subscribe(res4 => {
            if (res4.chkperm) {
                this.hasRoleAgua = true;
            }
        });
    }



    selectMasterTab(btnId: number) {
        this.selectedMasterTab = btnId;
        this.evBtnTabClic.emit(btnId);
    }

    cerrar() {
        this.evBtnCerrar.emit();
    }
}
