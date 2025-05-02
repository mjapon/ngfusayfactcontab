import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TcitaService} from '../../../services/tcita.service';

@Component({
    selector: 'app-detcitacal',
    styles: [`
        .colcal {
            width: 16px;
            height: 16px;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 50%;
        }
    `],
    template: `
        <div class="text-center" *ngIf="showAnim">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!showAnim">
            <div class="ms-5 me-5">
                <div class="d-flex w-100">
                    <div class="colcal" style="background-color:{{datosCita.ct_color}}"></div>
                    <div class="ms-3 d-flex flex-column w-100">
                        <div> {{ datosCita.ct_titulo }}</div>
                        <div class="d-flex ">
                            <div>
                                {{ datosCita.ct_fecha }}
                            </div>
                            <div class="ms-5">
                                {{ datosCita.ct_hora_str }} - {{ datosCita.ct_hora_fin_str }}
                            </div>
                        </div>
                    </div>
                </div>
                <p class="mt-2">
                    {{ datosCita.ct_obs }}
                </p>

                <div class="row mb-2">
                    <div class="fw-light">Paciente:</div>
                    <div class="fw-bold">{{ datosCita.paciente }}</div>
                </div>

                <div class="row">
                    <div class="fw-light">Atiende:</div>
                    <div class="fw-bold">{{ datosCita.medico }}</div>
                </div>

            </div>

            <div class="d-flex justify-content-between mt-4">
                <button class="btn btn-outline-primary" *ngIf="tipocita===2"
                        (click)="registraAtencionOdontologica()"
                        title="Navegar hacia la ficha odontológica del paciente">
                    <i class="fa-solid fa-teeth-open me-1"></i> Ficha Odontológica
                </button>
                <button class="btn btn-outline-primary" *ngIf="tipocita===1"
                        title="Navegar hacia la ficha médica del paciente"
                        (click)="registraAtencionMedica()">
                    <i class="fa-solid fa-stethoscope me-1"></i> Ficha Médica
                </button>

                <button class="btn btn-outline-secondary"
                        title="Cerrar"
                        (click)="closeModalDetEv()"><i class="fa-solid fa-xmark"></i>
                    Cerrar
                </button>
            </div>
        </div>
    `
})
export class DetallescitacalComponent implements OnInit {

    @Input() codcita: number;
    @Output() cerrarModalEv = new EventEmitter<any>();
    @Output() registraAtencionEv = new EventEmitter<any>();
    @Input() tipocita: number;
    showAnim: boolean;
    datosCita: any;

    constructor(private tcitaServ: TcitaService) {
    }

    ngOnInit(): void {
        this.showAnim = true;
        this.loadDatosCita();
    }

    loadDatosCita() {
        this.tcitaServ.getDatosCita(this.codcita).subscribe(res => {
            this.showAnim = false;
            if (res.status === 200) {
                this.datosCita = res.cita;
            }
        });
    }

    registraAtencionOdontologica() {
        this.datosCita.tipo_rounting_cita = this.tipocita;
        this.registraAtencionEv.emit(this.datosCita);
    }

    registraAtencionMedica() {
        this.datosCita.tipo_rounting_cita = this.tipocita;
        this.registraAtencionEv.emit(this.datosCita);
    }

    closeModalDetEv() {
        this.cerrarModalEv.emit(true);
    }
}
