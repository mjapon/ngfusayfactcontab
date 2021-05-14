import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToolsDienteService} from '../../../services/toolsdiente.service';

@Component({
    selector: 'app-caraspd',
    template: `
        <div class="contdiente" data-name="value"
             id="diente{{diente.numero}}"
             [title]="diente.texto?diente.texto:''">
            <div class="mdiente" (click)="raiseShowDetallesDiente(diente)">
                <div id="t{{diente.numero}}" class="mcuadro marriba"
                     [ngClass]="getCssClass(diente.t.estilos)">
                </div>
                <div id="l{{diente.numero}}" class="mcuadro mizquierdo"
                     [ngClass]="getCssClass(diente.l.estilos)">
                </div>
                <div id="b{{diente.numero}}" class="mcuadro mdebajo"
                     [ngClass]="getCssClass(diente.b.estilos)">
                </div>
                <div id="r{{diente.numero}}" class="mcuadro mderecha"
                     [ngClass]="getCssClass(diente.r.estilos)">
                </div>
                <div id="c{{diente.numero}}" class="mcentro"
                     [ngClass]="getCssClass(diente.c.estilos)">
                </div>
            </div>
            <div class="mfondodiente {{diente.classTapa}}" (click)="raiseShowDetallesDiente(diente)"
                 *ngIf="diente.tapaVisible">
            </div>
        </div>
    `
})
export class CaraspdComponent implements OnInit {
    @Input() diente: any;
    @Output() ondienteclic = new EventEmitter<any>();

    constructor(private dienteServ: ToolsDienteService) {
    }

    ngOnInit(): void {
    }

    raiseShowDetallesDiente($event) {
        if (!this.dienteServ.dienteIsProt(this.diente)) {
            this.ondienteclic.emit(this.diente);
        }
    }

    getCssClass(estilos) {
        return Object.values(estilos);
    }
}
