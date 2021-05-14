import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {OdAntecService} from '../../services/odantec.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {SwalService} from '../../services/swal.service';
import {CitasMedicasService} from '../../services/citas-medicas.service';

@Component({
    selector: 'app-antcodonto',
    styles: [
            `.dato-adc-fila {
            margin: 6px 1px;
        }
        `],
    template: `
        <div>
            <div *ngIf="codPaciente>0">
                <div *ngIf="tipo===1">
                    <div *ngFor="let it of detalles">
                        <div class="row dato-adc-fila">
                            <div class="col-12">
                                <span>{{it.cmtv_valor}}:</span>
                            </div>
                            <div class="col">
                                <div *ngIf="it.cmtv_tinput===1">
                                    <input type="text" class="form-control"
                                           [(ngModel)]="it.valorreg">
                                </div>
                                <div *ngIf="it.cmtv_tinput===2">
                                    <textarea class="form-control" [(ngModel)]="it.valorreg">
                                    </textarea>
                                </div>
                                <div *ngIf="it.cmtv_tinput===3">
                                    <p-inputMask mask="99/99/9999" [(ngModel)]="it.valorreg"
                                                 placeholder="dd/mm/aaaa"
                                                 slotChar="dd/mm/aaaa"></p-inputMask>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div *ngIf="tipo===2">
                    <div class="row">
                        <div class="col">
                            <div class="row dato-adc-fila"
                                 *ngFor="let it of detalles.slice(0,4)">
                                <div class="col-12">
                                    <span>{{it.cmtv_valor}}</span>
                                    <span class="badge badge-light">{{it.cmtv_unidad}}</span>:
                                </div>
                                <div class="col-12">
                                    <div *ngIf="it.cmtv_tinput===1">
                                        <input type="text" class="form-control"
                                               [(ngModel)]="it.valorreg"
                                               (focusout)="calcularIMC(it)">
                                    </div>
                                    <div *ngIf="it.cmtv_tinput===2">
                                        <textarea class="form-control" [(ngModel)]="it.valorreg">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="col-12"
                                     *ngIf="it.cmtv_nombre === 'EXFIS_TA' && datosAlertaPresion.msg? datosAlertaPresion.msg.length>0:false ">
                                    <span style="color: {{datosAlertaPresion.color}}"> {{datosAlertaPresion.msg}} </span>
                                    <br>
                                </div>
                                <div class="col-12"
                                     *ngIf="it.cmtv_nombre === 'EXFIS_IMC' && datosAlertaImc.msg?datosAlertaImc.msg.length>0:false">
                                    <span style="color: {{datosAlertaImc.color}}"> {{datosAlertaImc.msg}} </span>
                                    <br>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row dato-adc-fila"
                                 *ngFor="let it of detalles.slice(4,9)">
                                <div class="col-12">
                                    <span>{{it.cmtv_valor}}</span>
                                    <span class="badge badge-light">{{it.cmtv_unidad}}</span>:
                                </div>
                                <div class="col-12">
                                    <div *ngIf="it.cmtv_tinput===1">
                                        <input type="text" class="form-control"
                                               [(ngModel)]="it.valorreg"
                                               (focusout)="calcularIMC(it)">
                                    </div>
                                    <div *ngIf="it.cmtv_tinput===2">
                                        <textarea class="form-control" [(ngModel)]="it.valorreg">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="col-12"
                                     *ngIf="it.cmtv_nombre === 'EXFIS_TA' && datosAlertaPresion.msg? datosAlertaPresion.msg.length>0:false ">
                                    <span style="color: {{datosAlertaPresion.color}}"> {{datosAlertaPresion.msg}} </span>
                                    <br>
                                </div>
                                <div class="col-12"
                                     *ngIf="it.cmtv_nombre === 'EXFIS_IMC' && datosAlertaImc.msg?datosAlertaImc.msg.length>0:false">
                                    <span style="color: {{datosAlertaImc.color}}"> {{datosAlertaImc.msg}} </span>
                                    <br>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row dato-fila">
                        <div class="col-12">
                            <span>Descripción de Hallazgos:</span>
                        </div>
                        <div class="col-12">
                            <textarea class="form-control"
                                      [(ngModel)]="cabecera.od_hallazgoexamfis">
                            </textarea>
                        </div>
                    </div>
                </div>

                <div class="mt-1 d-flex justify-content-center">
                    <button class="btn btn-outline-primary" (click)="guardar()">
                        <i class="fa fa-save"></i> Guardar
                    </button>
                </div>

            </div>
            <div *ngIf="!codPaciente">
                <h4 class="text-muted"> Favor registre primero los datos del paciente </h4>
            </div>
        </div>
    `
})
export class AntcodontoComponent implements OnInit, OnChanges {
    @Input() codPaciente: number;
    @Input() tipo: number; // 1-Personales, 2-Examen Fisico
    @Output() evGuardar = new EventEmitter<any>();

    cabecera: any;
    detalles: Array<any>;
    lastValid: boolean;
    datosAlertaImc: any;
    datosAlertaPresion: any;
    editando: boolean;
    hallazgosfisicos: string;

    constructor(private antecService: OdAntecService,
                private loadingUiService: LoadingUiService,
                private swalService: SwalService,
                private citasMedicasServ: CitasMedicasService) {
    }

    ngOnInit(): void {
        this.cabecera = {};
        this.detalles = [];
        this.lastValid = false;
        this.hallazgosfisicos = '';
        this.datosAlertaImc = {};
        this.datosAlertaPresion = {};
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pacchange = changes.codPaciente;
        const codcurrentvalue = pacchange.currentValue;
        if (codcurrentvalue !== null) {
            if (pacchange.currentValue > 0) {
                this.loadLastOrForm();
            }
        }
    }

    loadLastOrForm() {
        this.lastValid = false;
        this.loadingUiService.publishBlockMessage();
        this.antecService.getLastValid(this.codPaciente, this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.editando = false;
                this.lastValid = true;
                this.cabecera = res.res.cabecera;
                this.detalles = res.res.detalles;
            } else {
                this.editando = true;
                this.loadForm();
            }
        });
    }

    loadForm() {
        this.loadingUiService.publishBlockMessage();
        this.antecService.getForm(this.codPaciente, this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.cabecera = res.form.cabecera;
                this.detalles = res.form.detalles;
            }
        });
    }

    guardar() {
        const form = {cabecera: this.cabecera, detalles: this.detalles};
        this.loadingUiService.publishBlockMessage();
        if (this.cabecera.od_antid > 0) {
            this.antecService.actualizar(form, this.cabecera.od_antid).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.evGuardar.emit('');
                }
            });
        } else {
            this.antecService.crear(form).subscribe(res => {
                if (res.status === 200) {
                    this.loadLastOrForm();
                    this.swalService.fireToastSuccess(res.msg);
                    this.evGuardar.emit('');
                }
            });
        }
    }

    calcularIMC(it: any) {
        let valorPeso: any = '0';
        let valorTalla: any = '0';
        let filaIMC: any;
        this.detalles.forEach(e => {
            const nombredato = e.cmtv_nombre;
            if (nombredato === 'EXFIS_PESO') {
                valorPeso = e.valorreg;
            } else if (nombredato === 'EXFIS_TALLA') {
                valorTalla = e.valorreg;
            } else if (nombredato === 'EXFIS_IMC') {
                filaIMC = e;
            }
        });
        const valorPesoNumber = Number(valorPeso);
        const valorTallaNumber = Number(valorTalla);
        let imc = Number('0');
        if (valorTallaNumber !== 0) {
            imc = valorPesoNumber / (valorTallaNumber * valorTallaNumber);
        }
        const imcRounded = imc.toFixed(2);
        if (filaIMC) {
            filaIMC.valorreg = imcRounded;
            this.citasMedicasServ.getDescValExamFisico(3, imcRounded).subscribe(resimc => {
                if (resimc.status === 200) {
                    const result = resimc.result;
                    const color = resimc.color;
                    this.datosAlertaImc = {msg: result, color};
                }
            });
        }

        if (it.cmtv_nombre === 'EXFIS_IMC') {
            this.citasMedicasServ.getDescValExamFisico(3, imcRounded).subscribe(resa => {
                if (resa.status === 200) {
                    const result = resa.result;
                    const color = resa.color;
                    this.datosAlertaImc = {msg: result, color};
                }
            });
        } else if (it.cmtv_nombre === 'EXFIS_TA') {
            this.citasMedicasServ.getDescValExamFisico(1, it.valorreg).subscribe(resb => {
                if (resb.status === 200) {
                    const result = resb.result;
                    const color = resb.color;
                    this.datosAlertaPresion = {msg: result, color};
                }
            });
        }
    }
}
