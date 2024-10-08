import {BaseComponent} from '../base.component';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PersonaService} from '../../../services/persona.service';
import {CtesService} from '../../../services/ctes.service';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-buscaref',
    template: `
        <div class="row g-0" *ngIf="form">
            <div class="p-fluid {{form?.referente?.per_id>0?'col-sm-11':'col-sm-12'}}">
                <p-autoComplete [(ngModel)]="form.referente"
                                [suggestions]="personFiltered"
                                (completeMethod)="findRefs($event)" optionLabel="nomapel"
                                inputId="refAutoCom"
                                autofocus="true"
                                inputStyleClass="form-control {{stylevalidinvalid?(form.referente?.per_id?'is-valid':'is-invalid'):''}}"
                                [delay]="200"
                                (keyup.enter)="onEnterRef()"
                                [forceSelection]="true"
                                placeholder="Busque el referente por nombres, número de cédula o ruc"
                                (onSelect)="onRefSelect()">
                    <ng-template let-ref pTemplate="item">
                        <div>
                            <div class="d-flex justify-content-between">
                                <span>{{ref.nomapel}}</span>
                                <span *ngIf="showlugres">{{ref.lugresidencia}}</span>
                                <span>{{ref.per_ciruc}}</span>
                            </div>
                        </div>
                    </ng-template>
                </p-autoComplete>
            </div>
            <div class="col-sm-1 d-flex" *ngIf="form.referente?.per_id>0">
                <button title="Limpiar búsqueda" class="btn btn-outline-dark" type="button"
                        (click)="limpiarRef()">
                    <i class="fa fa-eraser"></i>
                </button>
            </div>
        </div>`
})
export class BuscarefComponent extends BaseComponent {
    @Input() form: any = {};

    @Output() evOnEnterRef = new EventEmitter<any>();
    @Output() evOnSelectRef = new EventEmitter<any>();
    @Output() evOnClearRef = new EventEmitter<any>();

    @Input() stylevalidinvalid = true;
    @Input() showlugres = false;
    lastquery = '';

    personFiltered: Array<any> = [];

    constructor(private personService: PersonaService,
                private ctes: CtesService,
                private domService: DomService) {
        super();
    }

    findRefs($event: any) {
        this.lastquery = $event.query;
        this.form.lastquery = this.lastquery;
        this.personService.buscarPorNomapelCiPag($event.query, 0,0).subscribe(res => {
            if (this.isResultOk(res)) {
                this.personFiltered = res.items;
            }
        });
    }

    limpiarRef() {
        this.form.referente = null;
        this.domService.setFocusTm(this.ctes.refAutoCom, 100);
        this.evOnClearRef.emit('');
    }


    onEnterRef() {
        this.evOnEnterRef.emit(this.lastquery);
    }

    onRefSelect() {
        this.evOnSelectRef.emit(this.form.referente);
    }
}
