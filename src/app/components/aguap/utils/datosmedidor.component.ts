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
        </div>
    `
})
export class DatosmedidorComponent {

    @Input() datosmedidor: any = {};

    constructor() {

    }
}
