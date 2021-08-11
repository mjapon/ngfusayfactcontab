import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../../components/shared/base.component';
import {OdontogramaService} from '../../../services/odontograma.service';

@Component({
    selector: 'app-odontogramahistlist',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <div>
                    <h4>Historial de odontograma</h4>
                    <button class="btn btn-outline-primary btn-sm" (click)="cerrarPanel()"> Cerrar Historia</button>
                </div>

                <table class="table table-sm table-bordered mt-3">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Tipo</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let fila of histolist" (click)="showDetalles(fila)" class="hand">
                        <th scope="row">{{histolist.indexOf(fila) + 1}}</th>
                        <td> {{fila.odh_fecha}} </td>
                        <td>{{fila.tipodesc}}</td>
                    </tr>
                    </tbody>
                </table>

                <div class="mt-3" *ngIf="histosel">
                    <app-odontogramaview [codHistoOd]="histosel.odh_id"></app-odontogramaview>
                </div>
            </div>
        </div>
    `
})
export class OdongramahistlistComponent extends BaseComponent implements OnChanges {
    @Input() codpac: number;
    @Output() evCerrarHisto = new EventEmitter<any>();

    histolist: Array<any> = [];
    isShowOdontograma = false;
    histosel: any;
    codhistosel = 0;

    constructor(private odontoService: OdontogramaService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const changeCodpac = changes.codpac;
        if (changeCodpac.currentValue) {
            this.loadHisto();
        }
    }

    loadHisto() {
        this.histolist = [];
        this.odontoService.getHisto(this.codpac).subscribe(res => {
            if (this.isResultOk(res)) {
                this.histolist = res.histo;
            }
        });
    }

    showDetalles(fila) {
        this.histosel = fila;
        this.codhistosel = fila.odh_id;
        this.isShowOdontograma = true;
    }

    cerrarPanel() {
        this.evCerrarHisto.emit('');
    }
}
