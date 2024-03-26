import { BaseComponent } from '../shared/base.component';
import { Component, OnInit } from '@angular/core';
import { CtesService } from '../../services/ctes.service';
import { ReporteService } from '../../services/reporte.service';
import { FechasService } from '../../services/fechas.service';
import { DomService } from '../../services/dom.service';
@Component({
    selector: 'app-reportes',
    template: `
        <div>
            <div class="row">
                <div class="col offset-1">
                    <h3 class="my-2 ">Reportes</h3>
                </div>
            </div>

            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>

            <div class="row mt-1" *ngIf="!isLoading">
                <div class="col-md-4 offset-1">
                    <div class="card">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item hand d-flex justify-content-between"
                                [ngClass]="{'active':repsel===rep}"
                                *ngFor="let rep of reportes"
                                (click)="selReporte(rep)">
                                <span>{{rep.rep_nombre}}</span>
                                <span class="fas fa-chevron-right"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="px-3 py-2 border " *ngIf="repsel.rep_id>0">
                        <div class="fw-normal alert alert-info p-2">
                            <p><span class="fas fa-info-circle p-2"></span> {{repsel.rep_detalle}} </p>
                        </div>

                        <div class="mt-2 d-flex flex-row">
                            <div class="d-flex flex-column justify-content-center"><span
                                    class="fw-normal me-2">Fechas:</span></div>
                            <app-rangofechas [form]="form"
                                             [showlabels]="false"
                                             (evDesdeChange)="onDesdeChange($event)"
                                             (evHastaChange)="onHastaChange($event)"
                                             (evFilterSel)="onTipoFechaSel()">
                            </app-rangofechas>
                        </div>
                        <div class="mt-2 d-flex flex-row">
                            <div class="d-flex flex-column justify-content-center"><span class="fw-normal me-2">Formato de Salida:</span>
                            </div>
                            <p-dropdown [options]="formatos" optionLabel="label" optionValue="value"
                                        [(ngModel)]="form.formato">
                            </p-dropdown>
                        </div>
                        <div class="mt-2 d-flex flex-row" *ngIf="repsel.params.secid">
                            <div class="d-flex flex-column justify-content-center"><span
                                    class="fw-normal me-2">Sección:</span></div>
                            <p-dropdown [options]="secciones" optionLabel="sec_nombre" optionValue="sec_id"
                                        [(ngModel)]="form.secid">
                            </p-dropdown>
                        </div>

                        <div class="mt-2 d-flex flex-row" *ngIf="repsel.params.usid">
                            <div class="d-flex flex-column justify-content-center"><span
                                    class="fw-normal me-2">Usuario:</span></div>
                            <p-dropdown [options]="usuarios" optionLabel="nomapel" optionValue="us_id"
                                        [(ngModel)]="form.usid" [showClear]="true">
                            </p-dropdown>
                        </div>

                        <div *ngIf="repsel.params.refid">
                            <div class="mt-2 d-flex">
                                <span class="fw-normal me-2">Referente:</span>
                            </div>
                            <div>
                                <app-buscaref [form]="form" (evOnEnterRef)="onEnterRef()"
                                              (evOnSelectRef)="onRefSelect()"
                                              (evOnClearRef)="onClearRef()"></app-buscaref>
                            </div>
                        </div>

                        <div class="mt-4 d-flex flex-row-reverse">
                            <button class="btn btn-outline-primary" (click)="genReporte()" id="btnGen">
                                <i class="fas fa-print"></i> Generar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})
export class ReportesComponent extends BaseComponent implements OnInit {
    reportes: Array<any> = [];
    formatos: Array<any> = [];
    secciones: Array<any> = [];
    usuarios: Array<any> = [];
    repsel: any = {};
    form: any = {};

    constructor(private ctes: CtesService,
        private fechasService: FechasService,
        private domService: DomService,
        private repService: ReporteService) {
        super();
    }

    ngOnInit(): void {
        this.turnOnLoading();
        this.repService.getForm().subscribe(res => {
            if (this.isResultOk(res)) {
                this.form = res.form.form;
                this.formatos = res.form.formatos;
                this.secciones = res.form.secciones;
                this.usuarios = res.form.usuarios;
                this.form.desde = this.fechasService.parseString(this.form.desde);
                this.form.hasta = this.fechasService.parseString(this.form.hasta);
            }
            this.loadReportes();
        });
    }

    loadReportes() {
        this.repService.listar().subscribe(res => {
            if (this.isResultOk(res)) {
                this.reportes = res.reportes;
            }
            this.turnOffLoading();
        });
    }

    onDesdeChange($event: any) {

    }

    onHastaChange($event: any) {

    }

    onTipoFechaSel() {

    }

    genReporte() {
        this.turnOnLoading();
        const urlparams = this.repService.getParsedParams(this.form, this.repsel.rep_id, this.secciones, this.usuarios);
        //this.repService.imprimirReporte(urlparams);
        this.repService.runGenReporte(urlparams).subscribe((res: Blob) => {
            if (urlparams.fmt.toString() === '1') {
                this.repService.showPdfGenReporte(res);
            }
            else if (urlparams.fmt.toString() === '2') {
                this.repService.downloadExcelGenReporte(res);
            }
            this.turnOffLoading();
        });
    }


    selReporte(rep: any) {
        this.repsel = rep;
        this.repService.clearParams(this.repsel, this.form);
    }

    onEnterRef() {
        this.domService.setFocusTm('btnGen');
    }

    onRefSelect() {
        if (this.form.referente) {
            const perid = this.form.referente.per_id;
            this.form.refid = perid;
        }
    }

    onClearRef() {
        this.form.refid = 0;
    }
}
