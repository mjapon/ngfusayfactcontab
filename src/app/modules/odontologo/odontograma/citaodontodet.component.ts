import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OdatencionesService} from '../../../services/odatenciones.service';

@Component({
    selector: 'app-citaodontodet',
    template: `
        <div>
            <div class="text-center" *ngIf="showAnim">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!showAnim">
                <div class="card border-secondary">
                    <div>
                        <h6 class="dato-adc-fila">
                            {{datosAtencion.per_nombres + ' ' + datosAtencion.per_apellidos}}
                            -  {{datosAtencion.per_ciruc}}  - {{datosAtencion.per_fechanac}}
                            - {{datosAtencion.per_edad.years}} año(s), {{datosAtencion.per_edad.months}}
                            mes(es), {{datosAtencion.per_edad.days}} dia(s)
                        </h6>
                        <div class="row">
                            <div class="col-md-3">
                                <span class="text-muted">Fecha Atención:</span>
                            </div>
                            <div class="col">
                                <p>
                                    {{datosAtencion.ate_fechacrea}}
                                </p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-3">
                                <span class="text-muted">Motivo Consulta:</span>
                            </div>
                            <div class="col">
                                <p>
                                    {{datosAtencion.ate_diagnostico}}
                                </p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <span class="text-muted">Procedimiento Realizado:</span>
                            </div>
                            <div class="col">
                                <p>
                                    {{datosAtencion.ate_procedimiento}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card border-secondary" *ngIf="datosAtencion.ate_odontograma">
                    <div class="card-header quitaPadding">
                        Odontograma (Permanente)
                    </div>
                    <div class="d-flex justify-content-center">
                        <div style="overflow: auto; width: 950px; height: 600px;">
                            <div>
                                <div class="d-flex">
                                    <div id="tr" class="text-end d-flex">
                                        <ng-container *ngFor="let diente of dentadura.A">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                    <div id="tl" class="d-flex ms-4">
                                        <ng-container *ngFor="let diente of dentadura.B">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                </div>
                                <div class="d-flex">
                                    <div id="br" class="d-flex text-end" style="padding-top: 30px">
                                        <ng-container *ngFor="let diente of dentadura.C">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                    <div id="bl" style="padding-top: 30px" class="ms-4 d-flex">
                                        <ng-container *ngFor="let diente of dentadura.D">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card border-secondary" *ngIf="datosAtencion.ate_odontograma_sm">
                    <div class="card-header quitaPadding">
                        Odontograma (Temporal)
                    </div>
                    <div class="d-flex justify-content-center">
                        <div style="overflow: auto; width: 650px; height: 600px;">
                            <div>
                                <div class="d-flex">
                                    <div id="tr" class="text-end d-flex">
                                        <ng-container *ngFor="let diente of dentaduraSm.A">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                    <div id="tl" class="d-flex ms-4">
                                        <ng-container *ngFor="let diente of dentaduraSm.B">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                </div>
                                <div class="d-flex">
                                    <div id="br" class="d-flex text-end" style="padding-top: 30px">
                                        <ng-container *ngFor="let diente of dentaduraSm.C">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                    <div id="bl" style="padding-top: 30px" class="ms-4 d-flex">
                                        <ng-container *ngFor="let diente of dentaduraSm.D">
                                            <app-grppiezadent [diente]="diente"></app-grppiezadent>
                                        </ng-container>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-2 d-md-flex flex-row-reverse">
                    <button class="btn btn-outline-primary" (click)="doCerrar()">
                        <i class="fa fa-times"></i> Cerrar
                    </button>
                    <button class="btn btn-outline-primary me-2" (click)="doVerHistoria()">
                        <i class="fa fa-tooth"></i> Ver Ficha
                    </button>
                </div>
            </div>
        </div>
    `
})
export class CitaodontodetComponent implements OnInit {
    showAnim: boolean;
    @Input() codatencion: number;
    datosAtencion: any;
    dentadura: any;
    dentaduraSm: any;

    @Output() evShowHistoria = new EventEmitter<any>();
    @Output() evCerrar = new EventEmitter<any>();

    constructor(private odatenserv: OdatencionesService) {

    }

    ngOnInit(): void {
        this.showAnim = true;
        this.dentadura = [];
        this.dentaduraSm = [];
        this.loadDatos();
    }

    loadDatos() {
        this.showAnim = true;
        this.odatenserv.getDetallesAtencion(this.codatencion).subscribe(res => {
            this.showAnim = false;
            if (res.status === 200) {
                this.datosAtencion = res.atencion;
                this.setupOdontograma();
            }
        });
    }

    setupOdontograma() {
        this.dentadura = [];
        this.dentaduraSm = [];
        if (this.datosAtencion.ate_odontograma) {
            this.dentadura = JSON.parse(this.datosAtencion.ate_odontograma);
        }
        if (this.datosAtencion.ate_odontograma_sm) {
            this.dentaduraSm = JSON.parse(this.datosAtencion.ate_odontograma_sm);
        }
    }

    doCerrar() {
        this.evCerrar.emit('');
    }

    doVerHistoria() {
        this.evShowHistoria.emit('');
    }
}
