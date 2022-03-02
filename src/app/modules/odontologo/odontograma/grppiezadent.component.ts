import {Component, EventEmitter, Input, Output} from '@angular/core';

import {ToolsDienteService} from '../../../services/toolsdiente.service';

@Component({
    selector: 'app-grppiezadent',
    template: `
        <div style="display: inline-block" [style]="estilo?.odc_dntc"
             (mouseenter)="onmousenter()"
             (mouseleave)="onmouseleave()"
             [title]="titulo">
            <div class="d-flex flex-column align-items-center">
                <app-numpiezadent [diente]="diente" style="margin-bottom: 4px"></app-numpiezadent>
                <app-piezadental [diente]="diente" [estilo]="estilo"
                                 (ondienteclic)="raiseClicEvent(diente)"></app-piezadental>
                <app-caraspd [diente]="diente" (ondienteclic)="raiseClicEvent(diente)"></app-caraspd>
            </div>
        </div>
    `
})
export class GrppiezadentComponent {
    @Input() diente: any;
    @Output() ongrpdntclic = new EventEmitter<any>();
    @Output() ondntstatechange = new EventEmitter<any>();
    @Input() estilo: any = {};
    titulo: string;
    loaded: boolean;

    constructor(private dienteServ: ToolsDienteService) {
        this.loaded = false;
    }

    onmousenter() {
        if (!this.loaded) {
            this.titulo = this.getTitulo();
            this.loaded = true;
        }
    }

    onmouseleave() {
        this.loaded = false;
    }

    dienteIsProt() {
        return this.dienteServ.dienteIsProt(this.diente);
    }

    getTitulo() {
        if (this.diente) {
            let titulo = this.diente.texto ? this.diente.texto : '';
            if (this.dienteIsProt()) {
                const tipoProtesis = this.dienteServ.getTipoProtesis(this.diente);
                if (tipoProtesis) {
                    titulo += ' Protesis ' + tipoProtesis.label;
                }
            }
            return titulo;
        }
        return '';
    }

    raiseClicEvent($event: MouseEvent) {
        if (!this.dienteIsProt()) {
            this.ongrpdntclic.emit(this.diente);
        }
    }

}
