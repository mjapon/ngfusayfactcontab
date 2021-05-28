import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseComponent} from '../../shared/base.component';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {DomService} from '../../../services/dom.service';
import {CtesService} from '../../../services/ctes.service';

@Component({
    selector: 'app-buscamedidor',
    template: `
        <div class="row g-0" *ngIf="form">
            <div class="p-fluid {{form?.medidor?.mdg_id>0?'col-sm-11':'col-sm-12'}}">
                <p-autoComplete [(ngModel)]="form.medidor"
                                [suggestions]="medidores"
                                (completeMethod)="filtrar($event)" field="mdg_num"
                                inputId="medAutoCom"
                                autofocus="true"
                                inputStyleClass="form-control {{form.medidor?.mdg_id?'is-valid':'is-invalid'}}"
                                [delay]="200"
                                (keyup.enter)="onEnterMed()"
                                [forceSelection]="true"
                                placeholder="Ingrese el número del medidor"
                                (onSelect)="onMedSelect()">
                    <ng-template let-med pTemplate="item">
                        <div>
                            <div class="d-flex justify-content-between">
                                <span>{{med.mdg_num}}</span>
                                <span>{{med.nomapel}}</span>
                            </div>
                        </div>
                    </ng-template>
                </p-autoComplete>
            </div>
            <div class="col-sm d-flex" *ngIf="form.medidor?.mdg_id>0">
                <button title="Limpiar búsqueda" class="btn btn-outline-secondary" type="button"
                        (click)="limpiarMed()">
                    <i class="fa fa-eraser"></i>
                </button>
            </div>
        </div>`
})
export class BuscamedidorComponent extends BaseComponent {
    @Input() form: any = {};
    @Output() evOnEnterMed = new EventEmitter<any>();
    @Output() evOnSelectMed = new EventEmitter<any>();

    medidores: Array<any> = [];

    constructor(private contratoAguaServ: ContratoaguaService,
                private domService: DomService,
                private ctes: CtesService) {
        super();
    }

    filtrar($event) {
        this.contratoAguaServ.filterByNumMed($event.query).subscribe(res => {
            if (this.isResultOk(res)) {
                this.medidores = res.data;
            }
        });
    }

    onEnterMed() {
        this.evOnEnterMed.emit('');
    }

    onMedSelect() {
        this.evOnSelectMed.emit(this.form.medidor);
    }

    limpiarMed() {
        this.form.medidor = {};
        this.domService.setFocusTm(this.ctes.medAutoCom);
    }
}
