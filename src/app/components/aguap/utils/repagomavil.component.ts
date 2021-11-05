import {BaseComponent} from '../../shared/base.component';
import {Component, OnInit} from '@angular/core';
import {CobroaguaService} from '../../../services/agua/cobroagua.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {SwalService} from '../../../services/swal.service';
import {CtesService} from '../../../services/ctes.service';
import {Router} from '@angular/router';
import {CtesAguapService} from './ctes-aguap.service';

@Component({
    selector: 'app-repagomavil',
    template: `
        <div>
            <h3 class="my-3">Reporte de Pagos Mavil</h3>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading" class="mt-3">
                <div class="row">
                    <div class="col-md-9">
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
                                <button class="btn btn-outline-primary" (click)="loadReporte()"><i
                                        class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 d-flex flex-row-reverse">
                        <button class="btn btn-sm btn-outline-primary" (click)="goToHome()">
                            <i class="fas fa-arrow-left"></i>
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
                    <app-mavilgrid [grid]="reporte.gridcontracts"
                                   (evRowDoubleClick)="onFilaClick($event)"></app-mavilgrid>
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

            <div *ngIf="isShowDetallesFactura">
                <p-dialog header="Detalles del documento" [modal]="true" [style]="{width: '90vw'}" [baseZIndex]="10000"
                          [(visible)]="isShowDetallesFactura">
                    <app-facturaview [trncod]="codFacturaSel" (evBtnClosed)="closeDetFact()" [isPermAnul]="false"
                                     [isPermEdit]="false"
                                     [isPermChangeSec]="false"></app-facturaview>
                </p-dialog>
            </div>
        </div>

    `
})
export class RepagomavilComponent extends BaseComponent implements OnInit {
    anios: Array<any> = [];
    meses: Array<any> = [];
    form: any = {};
    reporte: any = {gridfacts: {}, gridcontracts: {}};
    isShowDetallesFactura = false;
    codFacturaSel = 0;

    constructor(private cobroAguaServ: CobroaguaService,
                private swalService: SwalService,
                private ctes: CtesService,
                private ctesAgp: CtesAguapService,
                private router: Router,
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

    goToHome() {
        this.router.navigate([this.ctesAgp.rutaHome]);
    }

    guardar() {
        this.form.pgm_total = this.reporte.total;
        if (confirm(this.ctes.msgConfirmSave)) {
            this.cobroAguaServ.guardarReportePagoMavil(this.form).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.swalService.fireToastSuccess(res.msg);
                }
            });
        }
    }

    closeDetFact() {
        this.isShowDetallesFactura = false;
    }

    onFilaClick($event: any) {
        console.log('onfila click', $event);
        alert('hola');

    }
}
