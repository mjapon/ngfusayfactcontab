import {Component} from '@angular/core';

@Component({
    selector: 'app-base-precios',
    template: `
        <div class="mt-5">

        <div class="row d-flex justify-content-center">
        <button class="btn btn-primary rounded-pill fs-4" type="button">
            PUNTO DE VENTA TIENDAS
        </button>
    </div>
    <div class="row pt-1 row-cols-md-3 g-5">
        <div class="col">
            <div class="card mb-4 rounded-3 border-primary px-4 text-primary">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4">PLAN 1</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">25 docs electrónicos - mes</li>
                    <li class=" mb-2">POS</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 15,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 bg-primary px-4 text-white">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 text-white">PLAN 2</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">50 docs electrónicos - mes</li>
                    <li class=" mb-2">POS</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 20,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>        

        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 border-primary px-4 text-primary">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 ">PLAN 3</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">25 docs electrónicos - ilimitado</li>
                    <li class=" mb-2">POS</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 30,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-2 d-flex justify-content-center">
        <button class="btn bg-primary text-white rounded-pill fs-4" type="button">
            SISTEMA ODONTOLÓGICO
        </button>
    </div>
    <div class="row pt-1 row-cols-md-3 g-5">
        <div class="col">
            <div class="card mb-4 rounded-3 bg-primary px-4 text-white">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4">PLAN 1</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">25 docs electrónicos - mes</li>
                    <li class=" mb-2">Módulo Odontológico</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 25,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 border-primary px-4 text-primary">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 ">PLAN 2</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">50 docs electrónicos - mes</li>
                    <li class=" mb-2">Módulo Odontológico</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 30,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>        

        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 bg-primary px-4 text-white">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 ">PLAN 3</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">25 docs electrónicos - ilimitado</li>
                    <li class=" mb-2">Módulo Odontológico</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 40,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="row mt-2 d-flex justify-content-center">
        <button class="btn btn-primary rounded-pill fs-4" type="button">
            SISTEMA MÉDICO
        </button>
    </div>
    <div class="row pt-1 row-cols-md-3 g-5">
        <div class="col">
            <div class="card mb-4 rounded-3 border-primary px-4 text-primary">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4">PLAN 1</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">25 docs electrónicos - mes</li>
                    <li class=" mb-2">Módulo Medicina</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 20,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 bg-primary px-4 text-white">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 text-white">PLAN 2</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">50 docs electrónicos - mes</li>
                    <li class=" mb-2">Módulo Medicina</li>                    
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 25,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>        

        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 border-primary px-4 text-primary">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 ">PLAN 3</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">Facturación Electrónica</li>
                    <li class=" mb-2">25 docs electrónicos - ilimitado</li>
                    <li class=" mb-2">Módulo Medicina</li>
                </ul>
                <div class="text-center my-2 mb-3">
                    <div class="fs-6"> Pago mensual</div>
                    <div class="mx-5">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                    type="button">
                                $ 35,00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="row pt-2 row-cols-md-3 g-5">
        <div class="col">
            <div class="card mb-4 rounded-3 bg-primary px-4 text-white">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4">Documentos Electrónicos</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">$0.25 c/u</li>
                    <li class=" mb-2">$5.00 - 25 docs (mensual)</li>
                    <li class=" mb-2">$10.00 - 100 docs (mensual)</li>
                    <li class=" mb-2">$15.00 - docs ilimitados (mensual)</li>
                </ul>                
            </div>
        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 border-primary px-4 text-primary">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4">Firma Electrónica - Sec Data</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">1 año - $29,00</li>
                    <li class=" mb-2">2 años - $40,00</li>
                    <li class=" mb-2">3 años - $55,00</li>
                    <li class=" mb-2">4 años - $70,00</li>
                    <li class=" mb-2">5 años - $80,00</li>
                </ul>                
            </div>        

        </div>
        <div class="col">

            <div class="card mb-4 rounded-3 bg-primary px-4 text-white">
                <div class="my-0 fw-normal">
                    <h6 class="text-center mt-4 fs-4 ">Implementación</h6>
                    <div class="mx-3">
                        <hr class="text-primary">
                    </div>
                </div>                
                <ul class="list-unstyled mx-3 my-0">
                    <li class=" mb-2">$45.00 COMPLETO</li>
                    <li class=" mb-2">$25.00 SIMPLE</li>                    
                </ul>                
            </div>
        </div>
    </div>
            
        </div>

        <app-calcupreciomavil (evCerrar)="toggleShowCalcu()">

        </app-calcupreciomavil>

    `
})
export class BasepreciosComponent {

    constructor() {
    }

    toggleShowCalcu() {

    }
}