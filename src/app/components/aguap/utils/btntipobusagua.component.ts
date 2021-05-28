import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-btntipobusagua',
    template: `
        <div class="btn-group" role="group" aria-label="Tipo de búsqueda">
            <input type="radio" class="btn-check" id="tnradiotb1" name="btnradiotb"
                   [checked]="tipo===1" autocomplete="off">
            <label for="tnradiotb1" class="btn btn-sm btn-outline-primary"
                   (click)="changeTipo(1)">
                Por referente
            </label>
            <input type="radio" class="btn-check" id="tnradiotb2" name="btnradiotb"
                   [checked]="tipo===2" autocomplete="off">
            <label for="tnradiotb2" class="btn btn-sm btn-outline-primary"
                   (click)="changeTipo(2)">
                Por medidor
            </label>
        </div>`
})
export class BtntipobusaguaComponent {
    @Input() tipo = 1;
    @Output() evTipoChanged = new EventEmitter<any>();

    changeTipo(tipo) {
        this.tipo = tipo;
        this.evTipoChanged.emit(this.tipo);
        console.log('Valor de tipo es:', this.tipo);
    }

}
