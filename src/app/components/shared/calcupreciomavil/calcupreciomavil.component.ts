import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {NumberService} from '../../../services/number.service';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-calcupreciomavil',
    template: `
        <div>
            <div class="fs-5">
                Ingrese el valor de facturación neto mensual luego haga clic en calcular
            </div>
            <div class="text-center">
                <div class="d-flex mt-2">
                    <div>
                        <input type="text" class="form-control" [(ngModel)]="factneto" id="monto"
                               (keyup.enter)="calcular()">
                    </div>
                    <div class="ms-2 d-flex">
                        <button class="btn btn-outline-primary px-3" (click)="calcular()"> Calcular</button>
                        <button class="ms-4 btn btn-outline-secondary px-3" (click)="doCerrar()"> Cerrar</button>
                    </div>
                </div>
            </div>
            <div class="mt-4 d-flex">
                <span class="text-primary fs-3">PAGO MENSUAL: $ {{pagomensual}} </span>
                <span class="text-primary fs-3 ms-3" *ngIf="porcentround>0">({{porcentround}}%)</span>
            </div>
        </div>`
})
export class CalcupreciomavilComponent implements OnInit {

    factneto = 0.0;
    pagomensual = 0.0;
    porcentaje = 0.0;
    porcentround = 0.0;

    @Output() evCerrar = new EventEmitter<any>();

    constructor(private numberServ: NumberService, private domService: DomService) {

    }

    calcular() {
        this.pagomensual = 0.0;
        this.porcentaje = 0.0;
        if (this.factneto >= 0 && this.factneto <= 500) {
            this.pagomensual = 5.0;
        } else if (this.factneto > 500 && this.factneto < 1000) {
            this.porcentaje = 1;
        } else if (this.factneto >= 1000 && this.factneto < 5000) {
            // y = 1.1 - 0.0001x
            this.porcentaje = 1.1 - (0.0001 * this.factneto);
        } else if (this.factneto >= 5000 && this.factneto < 10000) {
            this.porcentaje = 0.7 - (this.factneto / 50000.0);
            // y= 0.7 - (x/50000)
        } else if (this.factneto >= 10000 && this.factneto < 20000) {
            this.porcentaje = 0.7 - (this.factneto / 50000.0);
            // y= 0.7 - (x/50000)
        } else if (this.factneto >= 20000 && this.factneto < 50000) {
            this.porcentaje = (11.0 / 30.0) - (this.factneto / 300000.0);
            // y= (11/30) - (x/300000)
        } else if (this.factneto >= 50000) {
            this.porcentaje = 0.2;
        }
        if (this.porcentaje > 0) {
            this.pagomensual = this.numberServ.round2((this.factneto * this.porcentaje) / 100.0);
        }

        if (!this.pagomensual) {
            this.pagomensual = 0.0;
        } else {
            this.pagomensual = this.numberServ.round2(this.pagomensual);
        }

        this.porcentround = this.numberServ.round2(this.porcentaje);
    }

    doCerrar() {
        this.evCerrar.emit('');
    }

    ngOnInit(): void {
        this.domService.setFocusTm('monto');
    }
}
