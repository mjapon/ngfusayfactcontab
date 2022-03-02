import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LectomedaguaService } from "src/app/services/agua/lectomedagua.service";
import { DomService } from "src/app/services/dom.service";
import { LoadingUiService } from "src/app/services/loading-ui.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../../shared/base.component";
import { CtesAguapService } from "../utils/ctes-aguap.service";

@Component({
    selector: 'app-crealectomedsm',
    template: `
    <div>
        <div *ngIf="isLoading">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!isLoading">

            <div class="row mt-1">
                <div class="col-md">
                    <div><span class="fw-bold fontsizenr">Año:</span></div>
                    <div>
                        <p-dropdown [options]="anios" [(ngModel)]="form.lmd_anio"
                                    optionValue="value"
                                    optionLabel="label"
                                    (onChange)="loadPrevious()"></p-dropdown>
                    </div>
                </div>
                <div class="col-md">
                    <div><span class="fw-bold fontsizenr">Mes:</span></div>
                    <div>
                        <p-dropdown [options]="meses" [(ngModel)]="form.lmd_mes"
                                    optionValue="mes_id"
                                    optionLabel="mes_nombre"
                                    (onChange)="loadPrevious()"></p-dropdown>
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
export class CrealectomedsmComponent extends BaseComponent implements OnInit {

    @Input() mdgid;
    form: any = {};
    anios: Array<any> = [];
    meses: Array<any> = [];
    validfl: Array<any> = [];
    previuslectomed: any = {}

    @Output() evClosed = new EventEmitter<any>();
    @Output() evSaved = new EventEmitter<any>();


    constructor(private lectomedService: LectomedaguaService,
        private loadingServ: LoadingUiService,
        private domService: DomService,
        private ctes: CtesAguapService,
        private swalService: SwalService) {
        super();
    }

    ngOnInit() {
        this.loadForm();
    }

    loadForm() {
        this.turnOnLoading();
        this.lectomedService.getForm().subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.form = res.form.form;
                this.anios = res.form.anios;
                this.meses = res.form.meses;
                this.validfl = res.form.vfl;
                this.form.mdg_id = this.mdgid;
                this.form.mdg_num = 0;
                this.loadPrevious();
            }
        });
    }

    doCancel() {
        this.evClosed.emit('');
    }

    calculaConsumo() {
        this.form.lmd_consumo = this.lectomedService.generaConsumo(this.form);
    }

    loadPrevious() {
        this.form.lmd_valorant = 0;
        this.previuslectomed = {};
        this.lectomedService.getBack(this.form.mdg_id, this.form.lmd_anio, this.form.lmd_mes).subscribe(res => {
            if (this.isResultOk(res)) {
                this.previuslectomed = res.lectomed;
                this.form.lmd_valorant = this.previuslectomed.lmd_valor;
                this.calculaConsumo();
            }
        });
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
                            this.swalService.fireInfo(res.msg_pago_adel);
                        }
                        this.evSaved.emit('');
                    }
                });
            }
        });
    }

}