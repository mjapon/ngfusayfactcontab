import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-datosmedidor',
    template: `
        <div>
            <div class="row mt-1">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Medidor: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.mdg_num}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Tarifa: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.tarifa}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Barrio: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.comunidad}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Sector: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.cna_sector}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Dirección: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.cna_direccion}} </span>
                </div>
            </div>

            <div class="row mt-1" *ngIf="datosmedidor.cna_teredad && isshowtercedad">
                <div class="col-md">
                    <div class="alert alert-info">
                        <span class="fa fa-info-circle"></span>
                        <span> Aplica descuento tercera edad </span>
                    </div>
                </div>
            </div>

        </div>
    `
})
export class DatosmedidorComponent {

    @Input() datosmedidor: any = {};
    @Input() isshowtercedad = false;

    constructor() {

    }
}
