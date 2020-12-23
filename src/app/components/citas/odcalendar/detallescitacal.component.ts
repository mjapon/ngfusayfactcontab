import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TcitaService} from '../../../services/tcita.service';
import {SwalService} from '../../../services/swal.service';

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


            <!--
            <div class="d-flex justify-content-around">
                <button class="btn btn-outline-secondary" (click)="anularEv()"><i class="fa fa-trash"></i> Anular
                </button>
                <button class="btn btn-outline-secondary" (click)="editarEv()"><i class="fa fa-edit"></i> Editar
                </button>
                <button class="btn btn-outline-secondary" (click)="closeModalDetEv()"><i class="fa fa-times"></i>
                    Cerrar
                </button>
            </div>
            -->
        </div>
    `
})
export class DetallescitacalComponent implements OnInit {

    @Input() codcita: number;
    @Output() cerrarModalEv = new EventEmitter<any>();
    showAnim: boolean;
    /*
    @Output() anularCitaEv = new EventEmitter<any>();
    @Output() editarCitaEv = new EventEmitter<any>();
     */
    datosCita: any;

    constructor(private tcitaServ: TcitaService,
                private swalService: SwalService) {

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

    /*
    anularEv() {
        const msg = '¿Seguro que desea anular este evento?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.tcitaServ.anular(this.datosCita.ct_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            //this.anularCitaEv.emit('');
                        }
                    });
                }
            }
        );
    }

    editarEv() {
        //this.editarCitaEv.emit('');
    }
     */

    closeModalDetEv() {
        this.cerrarModalEv.emit('');
    }
}
