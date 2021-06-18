import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from '../shared/base.component';
import {AsientoService} from '../../services/asiento.service';
import {SwalService} from '../../services/swal.service';
import {CtesService} from '../../services/ctes.service';

@Component({
    selector: 'app-changesecdoc',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading" class="my-3">
                <div class="row">
                    <div class="col-md">
                        <p class="fontsizenr fw-bold">Sección Actual: {{currsec.sec_nombre}}</p>
                    </div>
                    <div class="col-md">
                        <div class="d-flex">
                            <p class="fw-bold me-2">Nueva Sección:</p>
                            <div class="p-fluid">
                                <p-dropdown [options]="secciones" [(ngModel)]="seccion"
                                            optionLabel="sec_nombre"
                                            optionValue="sec_id">
                                </p-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-between">
                    <button class="btn btn-outline-primary" (click)="cambiar()"><i class="fas fa-exchange-alt"></i>
                        Cambiar
                    </button>
                    <button class="btn btn-outline-secondary" (click)="cancelar()"><i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ChangesecdocComponent extends BaseComponent implements OnInit {

    @Input() trncod;
    secciones: Array<any> = [];
    seccion: any = null;
    currsec: any = {};

    @Output() evDoed = new EventEmitter<any>();
    @Output() evHide = new EventEmitter<any>();

    constructor(private asientoServ: AsientoService,
                private ctes: CtesService,
                private swalServ: SwalService) {
        super();
    }

    ngOnInit(): void {
        this.loadSecciones();
    }

    loadSecciones() {
        this.turnOnLoading();
        this.asientoServ.getFormChangeSec(this.trncod).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.currsec = res.currentsec;
                this.secciones = res.secciones;
                this.seccion = this.secciones[0].sec_id;
            }
        });
    }

    cambiar() {
        if (confirm(this.ctes.msgConfirmChangeSec)) {
            const form = {
                trn_codigo: this.trncod,
                sec_codigo: this.seccion
            };
            this.turnOnLoading();
            this.asientoServ.changeSeccion(form).subscribe(res => {
                this.turnOffLoading();
                if (this.isResultOk(res)) {
                    this.swalServ.fireToastSuccess(res.msg);
                }
                this.evDoed.emit('');
            });
        }
    }

    cancelar() {
        this.evHide.emit('');
    }
}
