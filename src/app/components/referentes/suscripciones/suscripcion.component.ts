import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SuscripcionService} from '../../../services/suscripcion.service';
import {PlanService} from '../../../services/plan.service';
import {SwalService} from '../../../services/swal.service';
import {FechasService} from '../../../services/fechas.service';

@Component({
    selector: 'app-suscripcion',
    template: `
        <div *ngIf="isLoading">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!isLoading">
            <div *ngIf="!isShowFormCreaSuscrip">
                <div class="card shadow rounded mt-2">
                    <div class="card-header d-flex justify-content-between">
                        <span class="font-weight-light">Suscripciones
                            <span *ngIf="suscripciones.length>0">({{suscripciones.length}})</span>
                        </span>
                        <button class="btn btn-outline-primary" (click)="showFormCreaSuscrip()"><i
                                class="fa fa-plus"></i> Crear
                        </button>
                    </div>
                    <div class="table-responsive" *ngIf="suscripciones.length>0">
                        <table class="table table-bordered table-sm">
                            <thead>
                            <tr>
                                <th scope="col" style="width: 5%">#</th>
                                <th scope="col">Plan</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Fecha contrato</th>
                                <th scope="col">Observación</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr *ngFor="let fila of suscripciones" class="hand" (click)="showDetallesSuscripcion(fila)">
                                <th scope="row" style="width: 5%">{{suscripciones.indexOf(fila) + 1}}</th>
                                <td>{{fila.pln_nombre}}</td>
                                <td>{{fila.estado}}</td>
                                <td>{{fila.sus_fechacrea}}</td>
                                <td>{{fila.sus_observacion}}</td>
                                <td>
                                    <button class="btn btn-outline-secondary btn-sm"
                                            (click)="showDetallesSuscripcion(fila)"><i class="fa fa-eye"></i></button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-body" *ngIf="suscripciones.length===0">
                        <div class="p-5 d-flex justify-content-center"><h3 class="text-muted"> No tiene
                            suscripciones </h3></div>
                    </div>
                </div>
            </div>
            <div *ngIf="isShowFormCreaSuscrip">
                <div class="card shadow rounded mt-2">
                    <div class="p-3">
                        <div class="p-2"><h4>Registrar suscripción</h4></div>
                        <div class="row mt-2 pl-2 pr-2">
                            <div class="col-md-3"><span class="font-weight-light">Periodicidad (en meses):</span></div>
                            <div class="col-md-3"><span class="font-weight-light">Día de cobro:</span></div>
                            <div class="col-md-3"><span class="font-weight-light">Periodo de gracia (en días):</span>
                            </div>
                            <div class="col-md-3"><span class="font-weight-light">Fecha inicio del servicio:</span>
                            </div>
                        </div>
                        <div class="row mt-1 pl-2 pr-2">
                            <div class="col-md-3">
                                <p-inputNumber [(ngModel)]="form.sus_periodicidad" [min]="1" [max]="12"
                                               [showButtons]="true"
                                               (ngModelChange)="onPeriodicidadChange()"></p-inputNumber>
                            </div>
                            <div class="col-md-3">
                                <p-inputNumber [(ngModel)]="form.sus_diacobro" [min]="1" [max]="30" [showButtons]="true"
                                               (ngModelChange)="onDiasCobroChange()"></p-inputNumber>
                            </div>
                            <div class="col-md-3">
                                <p-inputNumber [(ngModel)]="form.sus_diasgracia" [min]="0" [max]="90"
                                               [showButtons]="true"
                                               (ngModelChange)="onPeriodoGraciaChange()"></p-inputNumber>
                            </div>
                            <div class="col-md-3">
                                <p-calendar [(ngModel)]="form.sus_fechainiservobj" [showIcon]="false"
                                            [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                            dateFormat="dd/mm/yy"></p-calendar>
                            </div>
                        </div>
                        <div class="p-2 mt-2"><span class="font-weight-light">Elija el plan:</span>
                            <div>
                                <div class="row row-cols-3 row-cols-md-3">
                                    <div class="col mb-2" *ngFor="let plan of planes">
                                        <div class="card h-100 {{form.pln_id===plan.pln_id?'text-white bg-primary':''}}">
                                            <div class="card-body text-center">
                                                <div>
                                                    <div [title]="plan.pln_nombre" class="hand"><i
                                                            class="fab fa-3x fa-servicestack "></i></div>
                                                    <div class="mt-2 d-flex flex-column justify-content-center"><h5
                                                            class="card-title">{{plan.pln_nombre}}</h5></div>
                                                    <p class="card-text mt-1">{{plan.pln_obs}}</p></div>
                                            </div>
                                            <div class="card-footer">
                                                <button class="btn btn-sm btn-outline-secondary btn-block"
                                                        (click)="elegir(plan)"><i *ngIf="form.pln_id!==plan.pln_id"
                                                                                  class="fa fa-check"></i> <i
                                                        *ngIf="form.pln_id===plan.pln_id" class="fa fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-1 pl-2 pr-2">
                            <div class="col-md-12"><span class="font-weight-light">Observación:</span></div>
                            <div class="col-md-12"><textarea class="form-control" [(ngModel)]="form.sus_observacion"
                                                             rows="3" autocomplete="off" id="trn_observ"></textarea>
                            </div>
                        </div>
                        <div class="mt-3 pl-2 pr-2">
                            <button class="mr-3 btn btn-outline-primary" (click)="crearSuscripcion()"><i
                                    class="fa fa-save"></i> Crear
                            </button>
                            <button class="btn btn-outline-secondary" (click)="cancelCreaSuscrip()"> Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div *ngIf="isShowDetallesSuscrip" class="p-3 border shadow mt-4">
            <app-suscripview [codsuscrip]="codsuscripsel" (evCerrarBtn)="oncerrarbtn()"></app-suscripview>
        </div>
    `
})
export class SuscripcionComponent implements OnInit, OnChanges {

    @Input() codref: number;
    isLoading = false;
    suscripciones: Array<any>;
    isShowFormCreaSuscrip: boolean;
    form: any;
    codsuscripsel: number;

    planes: Array<any>;
    currentdate: any;
    isShowDetallesSuscrip = false;

    constructor(private suscripService: SuscripcionService,
                private planService: PlanService,
                private fechasService: FechasService,
                private swalService: SwalService) {

    }

    ngOnInit(): void {
        this.suscripciones = [];
        this.isShowFormCreaSuscrip = false;
        this.loadplanes();
        this.currentdate = new Date();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const codrefchange = changes.codref;
        if (codrefchange.currentValue) {
            this.loadSuscripciones();
        }
    }

    loadSuscripciones() {
        this.suscripService.listbyref(this.codref).subscribe(res => {
            if (res.status === 200) {
                this.suscripciones = res.items;
            }
        });
    }

    showFormCreaSuscrip() {
        this.isLoading = true;
        this.suscripService.getForm(this.codref).subscribe(res => {
            this.isShowFormCreaSuscrip = true;
            this.isLoading = false;
            if (res.status === 200) {
                this.form = res.form;
            }
        });
    }

    showDetallesSuscripcion(fila: any) {
        this.codsuscripsel = fila.sus_id;
        this.isShowDetallesSuscrip = true;
    }

    loadplanes() {
        this.planService.listaPlanes().subscribe(res => {
            if (res.status === 200) {
                this.planes = res.planes;
            }
        });
    }

    onDiasCobroChange() {

    }

    onPeriodoGraciaChange() {

    }

    onPeriodicidadChange() {

    }

    elegir(plan: any) {
        if (this.form.pln_id === plan.pln_id) {
            this.form.pln_id = 0;
        } else {
            this.form.pln_id = plan.pln_id;
        }
    }

    cancelCreaSuscrip() {
        this.isShowFormCreaSuscrip = false;
    }

    crearSuscripcion() {
        this.swalService.fireDialog('¿Confirma esta suscripción?').then(confirm => {
            if (this.form.sus_fechainiservobj) {
                this.form.sus_fechainiserv = this.fechasService.formatDate(this.form.sus_fechainiservobj);
            }

            if (confirm.value) {
                this.suscripService.crear(this.form).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireSuccess(res.msg);
                        this.isShowFormCreaSuscrip = false;
                        this.loadSuscripciones();
                    }
                });
            }
        });
    }

    oncerrarbtn() {
        this.isShowDetallesSuscrip = false;
    }
}
