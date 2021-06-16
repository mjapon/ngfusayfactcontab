import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {ToolsDienteService} from '../../../services/toolsdiente.service';
import {OdontogramaService} from '../../../services/odontograma.service';
import {BaseComponent} from '../../../components/shared/base.component';

@Component({
    selector: 'app-piezadental',
    template: `
        <div class="contdienteimg {{getSizeDiente()}} hand" [style]="estilo?.odc_dnt"
             (click)="raiseClicEvent()">
            <img src="assets/imgs/dienteodonto/{{diente.numero}}_df.png" alt=""
                 class="diente_blank {{getPosDiente()}} {{dienteIsExtract()?'pdextraccion':''}}"
                 *ngIf="!dienteHasImplante()">
            <img *ngIf="dienteHasEndo()"
                 src="assets/imgs/dienteodonto/{{getTipoEndo()}}" alt=""
                 [style]="estilo?.odc_raiz">
            <img *ngIf="dienteHasImplante()"
                 src="assets/imgs/dienteodonto/implante.png" alt="Implante"
                 [style]="estilo?.odc_perno">
            <img *ngIf="dienteHasCorona()"
                 src="assets/imgs/dienteodonto/{{getTipoCorona()}}" alt=""
                 [style]="estilo?.odc_corona">
            <img *ngIf="dienteIsProt()"
                 src="assets/imgs/dienteodonto/{{getTipoProt()}}" alt=""
                 [style]="estilo?.odc_cara">
            <img *ngIf="dienteIsReten()"
                 src="assets/imgs/retens/{{diente.numero}}.png" alt=""
                 [style]="estilo?.odc_reten">
            <img *ngIf="isDienteSano()" src="/assets/imgs/dientesano.png" alt=""
                 [style]="estilo?.odc_ds">
        </div>
    `
})
export class PiezadentalComponent extends BaseComponent {

    @Input() diente: any;
    @Output() ondienteclic = new EventEmitter<any>();
    @Input() estilo: any = {};

    constructor(private arrayUtil: ArrayutilService,
                private odonService: OdontogramaService,
                private dienteServ: ToolsDienteService) {
        super();
    }

    dienteHasImplante() {
        return this.arrayUtil.contains(this.diente.tools, 15);
    }

    dienteHasEndo() {
        return this.arrayUtil.contains(this.diente.tools, 6) || this.arrayUtil.contains(this.diente.tools, 7);
    }

    dienteHasCorona() {
        return this.arrayUtil.contains(this.diente.tools, 11) || this.arrayUtil.contains(this.diente.tools, 12);
    }

    getTipoEndo() {
        return this.diente.numero + '_' + (this.arrayUtil.contains(this.diente.tools, 7) ? 'ea' : 'er') + '.png';
    }

    getTipoCorona() {
        return this.diente.numero + '_' + (this.arrayUtil.contains(this.diente.tools, 11) ? 'cn' : 'cr') + '.png';
    }

    isDienteSano() {
        return this.arrayUtil.contains(this.diente.tools, 18);
    }

    getTipoProt() {
        return this.diente.numero + '_' + (this.diente.protesis ? (this.diente.protesis === 1 ? 'azul' : 'rojo') : 'azul') + '.png';
    }

    getSizeDiente() {
        let size = 'dntbig';
        if (this.arrayUtil.contains([11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 42, 43, 45, 32, 33, 35],
            this.diente.numero)) {
            size = 'dntsmall';
        } else if (this.arrayUtil.contains([41, 31, 34, 44], this.diente.numero)) {
            size = 'dntxsmall';
        }
        return size;
    }

    getPosDiente() {
        let pos = 'dtninf';
        if (this.arrayUtil.contains([11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28],
            this.diente.numero)) {
            pos = 'dntsup';
        }

        return pos;
    }

    dienteIsExtract() {
        return this.dienteIsProt() || this.arrayUtil.contains(this.diente.tools, 4) || this.arrayUtil.contains(this.diente.tools, 3);
    }

    raiseClicEvent() {
        if (!this.dienteIsProt()) {
            this.ondienteclic.emit(this.diente);
        }
    }

    dienteIsProt() {
        return this.dienteServ.dienteIsProt(this.diente);
    }

    dienteIsReten() {
        return this.diente.protesis ? this.diente.protesis < 0 : false;
    }

}
