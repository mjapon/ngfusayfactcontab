import {BaseComponent} from '../../shared/base.component';
import {Component, OnInit} from '@angular/core';
import {CobroaguaService} from '../../../services/agua/cobroagua.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {SwalService} from '../../../services/swal.service';
import {CtesService} from "../../../services/ctes.service";

@Component({
    selector: 'app-repagomavil',
    template: `
        <div>
            <h3 class="my-3">Reporte de Pagos Mavil</h3>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading" class="mt-3">
                <div class="d-flex flex-row">
                    <div class="me-2">
                        <p-dropdown [options]="anios" [(ngModel)]="form.pgm_anio"
                                    optionValue="value"
                                    optionLabel="label"
                                    (onChange)="onAnioChange()"></p-dropdown>
                    </div>
                    <div class="me-2">
                        <p-dropdown [options]="meses" [(ngModel)]="form.pgm_mes"
                                    optionValue="mes_id"
                                    optionLabel="mes_nombre"
                                    (onChange)="onMesChange()"></p-dropdown>
                    </div>
                    <div>
                        <button class="btn btn-outline-primary" (click)="loadReporte()"><i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>

                <div class="mt-3">
                    <div class="fw-bold">
                        Facturas <span>{{reporte.gridfacts.data?.length}}</span> :
                    </div>
                    <app-mavilgrid [grid]="reporte.gridfacts"></app-mavilgrid>
                    <div class="mt-1 d-flex flex-row-reverse">
                        <span class="fw-bold"> {{reporte.totalfact}} </span>
                        <span class="fw-bold me-2">Total:</span>
                    </div>
                </div>

                <div class="mt-1">
                    <div>
                        <p class="fw-bold"> Contratos <span>{{reporte.gridcontracts.data?.length}}</span>: </p>
                    </div>
                    <app-mavilgrid [grid]="reporte.gridcontracts"></app-mavilgrid>
                    <div class="mt-1 d-flex flex-row-reverse">
                        <span class="fw-bold"> {{reporte.totalnc}} </span>
                        <span class="fw-bold me-2">Total:</span>
                    </div>
                </div>

                <div class="mt-3 d-flex justify-content-center">
                    <span class="fw-bold me-2">TOTAL FACTURAS + CONTRATOS = </span>
                    <span class="fw-bold"> {{reporte.total}} </span>
                </div>
                <div class="mt-3 d-flex justify-content-center">
                    <button class="btn btn-outline-primary" (click)="guardar()"> Registrar Pago</button>
                </div>
            </div>
        </div>

    `
})
export class RepagomavilComponent extends BaseComponent implements OnInit {
    anios: Array<any> = [];
    meses: Array<any> = [];
    form: any = {};
    reporte: any = {gridfacts: {}, gridcontracts: {}};

    constructor(private cobroAguaServ: CobroaguaService,
                private swalService: SwalService,
                private ctes: CtesService,
                private loadingServ: LoadingUiService) {
        super();
    }

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.turnOnLoading();
        this.cobroAguaServ.getFormPagoMavil().subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.form = res.form.form;
                this.anios = res.form.anios;
                this.meses = res.form.meses;
                this.loadReporte();
            }
        });
    }

    loadReporte() {
        this.loadingServ.publishBlockMessage();
        this.cobroAguaServ.getReportePagoMavil(this.form).subscribe(res => {
            if (this.isResultOk(res)) {
                this.reporte = res.reporte;
            }
        });
    }

    onAnioChange() {
        this.loadReporte();
    }

    onMesChange() {
        this.loadReporte();
    }

    guardar() {
        // comentaro
        this.form.pgm_total = this.reporte.total;
        if (confirm(this.ctes.msgConfirmSave)) {
            this.cobroAguaServ.guardarReportePagoMavil(this.form).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.swalService.fireToastSuccess(res.msg);
                }
            });
        }
    }
}
