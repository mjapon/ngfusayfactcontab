import {BaseComponent} from '../../shared/base.component';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {LectomedaguaService} from '../../../services/agua/lectomedagua.service';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {CobroaguaService} from '../../../services/agua/cobroagua.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {PersonaService} from '../../../services/persona.service';
import {Router} from '@angular/router';
import {DomService} from '../../../services/dom.service';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {SwalService} from '../../../services/swal.service';


@Component({
    selector: 'app-crealectomed',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <div class="row">
                    <div class="col-md-7">
                        <div class="p-2 border shadow-sm" *ngIf="this.form.referente">
                            <div class="my-2">
                                <app-basicdatosref [datosref]="this.form.referente"></app-basicdatosref>
                            </div>
                            <div class="mt-2">
                                <app-datosmedidor [datosmedidor]="medsel"></app-datosmedidor>
                            </div>
                        </div>

                        <div class="mt-3">
                            <div>
                                <span class="fontsizesm"> <i class="fa fa-info"></i> Última Lectura realizada:</span>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <div *ngIf="!lastlectomed">
                                        <div class="text-muted d-flex justify-content-center">
                                            <span class="fontsizenr">No hay registro de lectura anterior</span>
                                        </div>
                                    </div>

                                    <div *ngIf="lastlectomed">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <div>
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Fecha de registro: </span>
                                                    </div>
                                                    <div>
                                                        <span class="fw-bold fontsizenr"> {{lastlectomed.lmd_fechacrea}} </span>
                                                    </div>
                                                </div>

                                                <div class="mt-2">
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Registrado por: </span>
                                                    </div>
                                                    <div>
                                                        <span class="fw-bold fontsizenr"> {{lastlectomed.usercrea}} </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div>
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Lectura Anterior: </span>
                                                    </div>
                                                    <div>
                                            <span class="fw-bold fontsizenr">
                                                {{lastlectomed.lmd_valorant}} m<sup>3</sup>
                                            </span>
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Lectura Actual: </span>
                                                    </div>
                                                    <div>
                                            <span class="fw-bold fontsizenr">
                                                {{lastlectomed.lmd_valor}}m<sup>3</sup>
                                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div>
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Mes: </span>
                                                    </div>
                                                    <div>
                                                        <span class="fw-bold fontsizenr"> {{lastlectomed.mes_nombre}} </span>
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Consumo: </span>
                                                    </div>
                                                    <div>
                                            <span class="fw-bold fontsizenr">
                                                {{lastlectomed.lmd_consumo}}m<sup>3</sup>
                                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-2">
                                            <div class="row g-0">
                                                <div class="col-md-8"
                                                     *ngIf="lastlectomed.lmd_obs.trim().length>0">
                                                    <div>
                                                        <span class="fw-normal fontsizenr"> Observación: </span>
                                                    </div>
                                                    <div style="white-space: pre-line" class="fontsizenr">
                                                        {{lastlectomed.lmd_obs}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="row mt-1">
                            <div class="col-md">
                                <div><span class="fw-bold fontsizenr">Año:</span></div>
                                <div>
                                    <span>{{form.lmd_anio}}</span>
                                </div>
                            </div>
                            <div class="col-md">
                                <div><span class="fw-bold fontsizenr">Mes:</span></div>
                                <div>
                                    <span>{{messtring}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div>
                                    <label class="form-label fw-bold fontsizenr">Lectura Anterior
                                        m<sup>3</sup>:</label>
                                    <input type="text" class="form-control" id="lmd_valorant"
                                           (focusin)=$event.target.select()
                                           [disabled]="previulectomed!==null"
                                           [min]="0.0"
                                           [(ngModel)]="form.lmd_valorant">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div>
                                    <label class="form-label fw-bold fontsizenr">Lectura Actual
                                        m<sup>3</sup>:</label>
                                    <input type="text" class="form-control" id="lmd_valor"
                                           (focusin)=$event.target.select()
                                           (keyup)="calculaConsumo()"
                                           [(ngModel)]="form.lmd_valor"
                                           [min]="0.0">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <span class="fw-bold fontsizenr">Consumo Generado m<sup>3</sup>:</span>
                            </div>
                            <div class="col-md">
                                <input type="text" class="form-control" disabled
                                       [(ngModel)]="form.lmd_consumo">
                            </div>
                        </div>
                        <div class="mt-3">
                            <label class="form-label fw-bold fontsizenr">Observación:</label>
                            <textarea class="form-control" [(ngModel)]="form.lmd_obs" maxlength="800"
                                      rows="3"></textarea>
                        </div>

                    </div>
                </div>
                <div class="w-100 mt-4 d-flex justify-content-center">
                    <button class="ms-2 btn btn-outline-primary"
                            id="btnNextS3" (click)="doSave()"> Guardar
                        <i class="fa fa-save"></i></button>
                    <button class="ms-2 btn btn-outline-secondary"
                            id="btnNextS4" (click)="doCancel()"> Cancelar
                        <i class="fa fa-times"></i></button>
                </div>
            </div>
        </div>
    `
})
export class CrealectomedComponent extends BaseComponent implements OnChanges {

    @Input() mdgid;
    @Input() anio;
    @Input() mes;
    @Input() messtring;

    form: any = {};
    lastlectomed: any = null;
    previulectomed: any = null;
    medsel: any = {};

    meses: Array<any> = [];
    anios: Array<any> = [];
    validfl: Array<any> = [];

    @Output() evSaved = new EventEmitter<any>();
    @Output() evCancel = new EventEmitter<any>();

    constructor(private lectomedService: LectomedaguaService,
                private contraguaServ: ContratoaguaService,
                private cobroAguaServ: CobroaguaService,
                private loadingServ: LoadingUiService,
                private personaService: PersonaService,
                private router: Router,
                private domService: DomService,
                private ctes: CtesAguapService,
                private swalService: SwalService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change = changes.mdgid;
        if (change.currentValue) {
            this.loadForm();
            this.loadDatosMedidor();
        }
    }

    loadDatosMedidor() {
        this.contraguaServ.findByCodMed(this.mdgid).subscribe(
            res => {
                if (this.isResultOk(res)) {
                    this.medsel = res.datosmed;
                    this.form.mdg_num = this.medsel.mdg_num;
                    this.form.mdg_id = this.medsel.mdg_id;
                    this.loadDatosRef();
                    this.loadPreviusLectoMed();
                    this.loadLastLectoMed();
                }
            }
        );
    }

    loadDatosRef() {
        this.personaService.buscarPorCod(this.medsel.per_id).subscribe(res => {
            if (this.isResultOk(res)) {
                this.form.referente = res.persona;
            }
        });
    }

    loadForm() {
        this.turnOnLoading();
        this.lectomedService.getForm().subscribe(res => {
            this.turnOffLoading();
            this.form = res.form.form;
            this.meses = res.form.meses;
            this.anios = res.form.anios;
            this.validfl = res.form.vfl;
            this.form.lmd_anio = this.anio;
            this.form.lmd_mes = this.mes;
        });
    }

    calculaConsumo() {
        this.form.lmd_consumo = this.lectomedService.generaConsumo(this.form);
    }

    doSave() {
        const isValidMed = this.domService.validFormData(this.form, this.validfl);
        if (!isValidMed) {
            return;
        }
        this.swalService.fireDialog(this.ctes.msgConfirmSave, '').then(confirm => {
            if (confirm.value) {
                this.loadingServ.publishBlockMessage();
                this.lectomedService.guardar(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        if (res.trn_codigo > 0) {
                            this.swalService.fireToastInfo(res.msg_pago_adel);
                        }
                        this.notifSave();
                    }
                });
            }
        });
    }

    loadLastLectoMed() {
        this.lastlectomed = null;
        this.lectomedService.getLast(this.form.mdg_num).subscribe(res => {
            if (this.isResultOk(res)) {
                this.lastlectomed = res.lectomed;
            }
        });
    }

    loadPreviusLectoMed() {
        this.previulectomed = null;
        this.form.lmd_valorant = 0;
        this.turnOnLoading();
        this.lectomedService.getPrevius(this.medsel.mdg_num, this.form.lmd_anio, this.form.lmd_mes).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.previulectomed = res.lectomed;
                this.form.lmd_valorant = this.previulectomed.lmd_valor;
                this.domService.setFocusTm(this.ctes.lmd_valor);
            } else {
                this.domService.setFocusTm(this.ctes.lmd_valorant);
            }
        });
    }

    notifSave() {
        this.evSaved.emit('');
    }

    doCancel() {
        this.evCancel.emit('');
    }
}
