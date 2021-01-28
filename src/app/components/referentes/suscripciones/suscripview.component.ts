import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SuscripcionService} from '../../../services/suscripcion.service';
import {SwalService} from '../../../services/swal.service';
import {AsientoService} from '../../../services/asiento.service';

@Component({
    selector: 'app-suscripview',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Fecha de creación:</span></div>
                                <div class="col-md-8"><span
                                        class="font-weight-bold"> {{datossuscrip.sus_fechacrea}} </span></div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Plan:</span></div>
                                <div class="col-md-8"><span
                                        class="font-weight-bold"> {{datossuscrip.pln_nombre}} </span></div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Periodicidad:</span></div>
                                <div class="col-md-8"><span class="font-weight-bold"> {{datossuscrip.sus_periodicidad}}
                                    MES(s) </span></div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Fecha inicio servicio:</span>
                                </div>
                                <div class="col-md-8"><span
                                        class="font-weight-bold"> {{datossuscrip.sus_fechainiserv}} </span></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Creado por:</span></div>
                                <div class="col-md-8"><span
                                        class="font-weight-bold"> {{datossuscrip.nomapelfusercrea}} </span></div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Estado:</span></div>
                                <div class="col-md-8"><span class="font-weight-bold"> {{datossuscrip.estado}} </span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Dias gracia:</span></div>
                                <div class="col-md-8"><span class="font-weight-bold"> {{datossuscrip.sus_diasgracia}}
                                    dia(s) </span></div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Observación:</span></div>
                                <div class="col-md-8"><p
                                        style="white-space: pre-line"> {{datossuscrip.sus_observacion}} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" *ngIf="datossuscrip.sus_fechaupd">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Fecha actualización:</span></div>
                                <div class="col-md-8"><span
                                        class="font-weight-bold"> {{datossuscrip.sus_fechaupd}} </span></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-4"><span class="font-weight-light">Actualizado por:</span></div>
                                <div class="col-md-8"><span
                                        class="font-weight-bold"> {{datossuscrip.sus_userupd}} </span></div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-outline-primary" (click)="onAnularBtn()"
                                *ngIf="datossuscrip.sus_estado===0">
                            <i class="fa fa-trash"></i>
                            Anular
                        </button>
                        <button class="btn btn-outline-primary ml-1" (click)="onConfirmarBtn()"
                                *ngIf="datossuscrip.sus_estado===0">
                            <i class="fa fa-check"></i>
                            Confirmar
                        </button>
                        <button class="btn btn-outline-primary ml-1" (click)="onCancelarBtn()"
                                *ngIf="datossuscrip.sus_estado===1">
                            <i class="fa fa-frown-open"></i>
                            Cancelar
                        </button>
                        <button class="btn btn-outline-primary ml-1" (click)="onCerraBtn()"><i class="fa fa-times"></i>
                            Cerrar
                        </button>

                        <button class="btn btn-outline-secondary ml-1" (click)="duplicar()">Duplicar</button>
                    </div>
                </div>
            </div>
        </div>        `
})
export class SuscripviewComponent implements OnInit, OnChanges {

    @Input() codsuscrip: number;
    isLoading = false;
    datossuscrip: any;

    @Output() evCerrarBtn = new EventEmitter<any>();

    constructor(private suscripService: SuscripcionService,
                private asientoService: AsientoService,
                private swalService: SwalService) {
        this.isLoading = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const codsucripChange = changes.codsuscrip;
        if (codsucripChange.currentValue) {
            this.loadDatosSuscrip();
        }
    }

    ngOnInit(): void {
    }

    loadDatosSuscrip() {
        this.isLoading = true
        this.suscripService.getDatosSuscrip(this.codsuscrip).subscribe(res => {
            if (res.status === 200) {
                this.datossuscrip = res.suscripcion;
            }
            this.isLoading = false;
        });
    }

    cambiarestado(nuevoestado, accion) {
        const msg = `Seguro que deseas ${accion} esta suscripción`;
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.suscripService.cambiarEstado(this.codsuscrip, nuevoestado).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadDatosSuscrip();
                    }
                });
            }
        });
    }

    onAnularBtn() {
        this.cambiarestado(4, 'anular');
    }

    onConfirmarBtn() {
        this.cambiarestado(1, 'confirmar');
    }

    onCancelarBtn() {
        this.cambiarestado(2, 'confirmar');
    }

    onCerraBtn() {
        this.evCerrarBtn.emit('');
    }

    duplicar() {
        this.asientoService.duplicar(this.datossuscrip.trn_codigo).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
            }
        });
    }
}
