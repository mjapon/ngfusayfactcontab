import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-tblmedidores',
    template: `
        <div>
            <div class="table-responsive">
                <table class="table table-bordered table-sm {{isForSelect?'table-hover':''}}">
                    <thead>
                    <tr>
                        <th scope="col">
                            <div class="fontsizesm">Medidor</div>
                        </th>
                        <th scope="col">
                            <div class="fontsizesm">Tarifa</div>
                        </th>
                        <th scope="col">
                            <div class="fontsizesm">Barrio</div>
                        </th>
                        <th scope="col">
                            <div class="fontsizesm">Sector</div>
                        </th>
                        <th scope="col">
                            <div class="fontsizesm">Dirección</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <ng-container *ngFor="let fila of medidores">
                        <tr class="{{isForSelect?'hand':''}}" (click)="onRowClic(fila)">
                            <td>
                                <div class="fontsizenr">{{fila.mdg_num}}</div>
                            </td>
                            <td>
                                <div class="fontsizenr">{{fila.tarifa}}</div>
                            </td>
                            <td>
                                <div class="fontsizenr">{{fila.comunidad}}</div>
                            </td>
                            <td>
                                <div class="fontsizenr">{{fila.cna_sector}}</div>
                            </td>
                            <td>
                                <div class="fontsizenr">{{fila.cna_direccion}}</div>
                            </td>
                        </tr>
                    </ng-container>
                    </tbody>
                </table>
            </div>
        </div>`

})
export class TblmedidoresComponent {

    @Input() medidores: Array<any> = [];
    @Output() evSelectFila = new EventEmitter<any>();
    @Input() isForSelect = false;

    constructor() {
    }

    onRowClic(fila: any) {
        this.evSelectFila.emit(fila);
    }
}
