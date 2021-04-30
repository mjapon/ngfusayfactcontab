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
            <p class="p-5 m-5">
                <img src="assets/anim.gif"
                     alt="procesando">
                <br>
                <span class="text-info"> Espere un momento... </span>
            </p>
        </div>
        <div *ngIf="!showAnim">
            <div class="ml-5 mr-5">
                <div class="d-flex w-100">
                    <div class="colcal" style="background-color:{{datosCita.ct_color}}"></div>
                    <div class="ml-3 d-flex flex-column w-100">
                        <div> {{datosCita.ct_titulo}} </div>
                        <div class="d-flex ">
                            <div>
                                {{datosCita.ct_fecha}}
                            </div>
                            <div class="ml-5">
                                {{datosCita.ct_hora_str}} - {{datosCita.ct_hora_fin_str}}
                            </div>
                        </div>
                    </div>
                </div>
                <p class="mt-2">
                    {{datosCita.ct_obs}}
                </p>

                <div class="row">
                    <div>Paciente:</div>
                    <div>{{datosCita.paciente}}</div>
                </div>

                <div class="row">
                    <div>Atiende:</div>
                    <div>{{datosCita.medico}}</div>
                </div>
            </div>

            <div class="d-flex flex-row-reverse mt-4">
                <button class="btn btn-sm btn-outline-primary" (click)="registraAtencion()"><i
                        class="fa fa-plus-circle"></i> Registrar
                    Atención
                </button>
            </div>
        </div>
    `
})
export class DetallescitacalComponent implements OnInit {

    @Input() codcita: number;
    @Output() cerrarModalEv = new EventEmitter<any>();
    @Output() registraAtencionEv = new EventEmitter<any>();
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

    registraAtencion() {
        this.registraAtencionEv.emit(this.datosCita);
    }
}
