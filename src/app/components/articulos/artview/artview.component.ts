import {BaseComponent} from '../../shared/base.component';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {ArticulostockService} from '../../../services/articulostock.service';

@Component({
    selector: 'app-artview',
    template: `
        <div *ngIf="isLoading">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!isLoading">
            <div class="card border-secondary">
                <div class="card-header">
                    Datos del producto o servicio
                </div>
                <div class="card-body">
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Tipo:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.tipic_nombre}}
                        </div>
                    </div>
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Nombre:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.ic_nombre}}
                        </div>
                    </div>
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Código:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.ic_code}}
                        </div>
                    </div>
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Fecha de ingreso:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.ic_fechacrea}}
                        </div>
                    </div>
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Graba Iva:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.icdp_grabaiva ? 'Si' : 'No'}}
                        </div>
                    </div>
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Categoría:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.catic_nombre}}
                        </div>
                    </div>
                    <div class="row border-bottom" *ngIf="artFromDb.tipic_id===1">
                        <div class="col-md-3">
                            <span class="fw-lighter">Proveedor:</span>
                        </div>
                        <div class="col-md">
                            {{artFromDb.proveedor}}
                        </div>
                    </div>
                    <div class="row border-bottom" *ngIf="artFromDb.tipic_id===1">
                        <div class="col-md-3">
                            <span class="fw-lighter">Fecha de caducidad:</span>
                        </div>
                        <div class="col-md">
                            <p class="text-justify"> {{artFromDb.icdp_fechacaducidad}} </p>
                        </div>
                    </div>
                    <div class="row border-bottom">
                        <div class="col-md-3">
                            <span class="fw-lighter">Modelo Contable:</span>
                        </div>
                        <div class="col-md">
                            <p class="text-justify"> {{artFromDb.mc_nombre}} </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <span class="fw-lighter">Nota:</span>
                        </div>
                        <div class="col-md">
                            <p class="text-justify"> {{artFromDb.ic_nota}} </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-secondary mt-2">
                <div class="card-header">
                    Precios
                </div>
                <div class="card-body">

                    <div class="row">
                        <div class="col-md" *ngIf="artFromDb.tipic_id===1 && showPrecioCompra">
                            <div class="d-flex">
                                <div>
                                    <span class="fw-lighter">Precio de compra
                                        <span *ngIf="artFromDb.icdp_grabaiva"> (Sin Iva) </span>:
                                    </span>
                                </div>
                                <div class="ms-2">
                                    $ {{artFromDb.icdp_preciocompra}}
                                </div>
                            </div>
                            <div class="d-flex" *ngIf="artFromDb.icdp_grabaiva">
                                <div>
                                    <span class="fw-lighter">Precio de compra (Con Iva):</span>
                                </div>
                                <div class="ms-2">
                                    $ {{artFromDb.icdp_preciocompra_iva}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md">
                            <div class="d-flex">
                                <div>
                                    <span class="fw-lighter">Precio de venta
                                        <span *ngIf="artFromDb.icdp_grabaiva"> (Sin Iva) </span>:
                                    </span>
                                </div>
                                <div class="ms-2">
                                    $ {{artFromDb.icdp_precioventasiniva}}
                                </div>
                            </div>
                            <div class="d-flex" *ngIf="artFromDb.icdp_grabaiva">
                                <div>
                                    <span class="fw-lighter">Precio de venta (Con Iva):</span>
                                </div>
                                <div class="ms-2">
                                    $ {{artFromDb.icdp_precioventa}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-secondary mt-2" *ngIf="artFromDb.tipic_id===1">
                <div class="card-header">
                    Stock
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item quitaPaddingMargin" *ngFor="let item of stock">
                            <div class="row">
                                <div class="col-md-4">
                                    {{item.sec_nombre}}
                                </div>
                                <div class="col-md">
                                    <span> {{item.ice_stock}}  </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
})
export class ArtviewComponent extends BaseComponent implements OnChanges {
    @Input() codart = 0;
    @Input() showPrecioCompra = true;

    artFromDb: any = {};
    stock: Array<any> = [];
    @Output() evDatosArtLoaded = new EventEmitter<any>();

    constructor(private artService: ArticuloService,
                private artStockService: ArticulostockService) {
        super();
    }

    loadDatosArt() {
        this.artService.getByCod(this.codart).subscribe(res => {
            if (res.status === 200) {
                this.artFromDb = res.datosprod;
            }
            this.isLoading = false;
            this.evDatosArtLoaded.emit(this.artFromDb);
        });
        this.artStockService.getForm(this.codart).subscribe(resStock => {
            if (resStock.status === 200) {
                this.stock = resStock.form_secs;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change = changes.codart;
        if (change.currentValue) {
            this.loadDatosArt();
        }
    }
}
