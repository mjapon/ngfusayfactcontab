import { Component, Input, OnInit } from "@angular/core";
import { ContratoaguaService } from "src/app/services/agua/contratoagua.service";
import { BaseComponent } from "../shared/base.component";

@Component({
    selector: 'app-datosmedserver',
    template: `
    <div>
        <div *ngIf="isLoading">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!isLoading">

        <div class="row mt-1" *ngIf="datosmedidor.cna_teredad">
                <div class="col-md">
                    <div class="alert alert-info">
                        <span class="fa fa-info-circle"></span>
                        <span> Aplica descuento tercera edad </span>
                    </div>
                </div>
            </div>


            <div class="row mt-1" *ngIf="datosmedidor.cna_discapacidad">
                <div class="col-md">
                    <div class="alert alert-info">
                        <span class="fa fa-info-circle"></span>
                        <span> Aplica descuento discapacidad </span>
                    </div>
                </div>
            </div>        

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Referente: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.nomapel}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Num CI: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.per_ciruc}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Medidor: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.mdg_num}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Tarifa: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.tarifa}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Barrio: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.comunidad}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Sector: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.cna_sector}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-2">
                    <span class="fw-normal fontsizenr"> Dirección: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosmedidor.cna_direccion}} </span>
                </div>
            </div>

            
        </div>
    </div>`
})
export class DatosmedidorserverComponent extends BaseComponent implements OnInit {

    @Input() numed: number = 0;
    datosmedidor: any = {}

    constructor(private contrAguaServ: ContratoaguaService) {
        super();
    }

    ngOnInit() {
        this.loadDatosContrato()
    }


    loadDatosContrato() {
        this.turnOnLoading();
        this.contrAguaServ.findByCodMed(this.numed).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.datosmedidor = res.datosmed
            }
        });
    }

}
