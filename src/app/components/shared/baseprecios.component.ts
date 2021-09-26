import {Component} from '@angular/core';

@Component({
    selector: 'app-base-precios',
    template: `
        <div class="mt-5">
            <div class="row row-cols-md-3 g-5">
                <div class="col">

                    <div class="mb-3">
                        <div class="d-grid">
                            <button class="btn btn-primary rounded-pill fs-4" type="button">
                                PUNTO DE VENTA
                            </button>
                        </div>
                    </div>

                    <div class="card border-primary px-4">
                        <div class="my-0 fw-normal">
                            <h6 class="text-center mt-4 fs-4 text-primary">Registro: $35,00</h6>
                            <div class="mx-3">
                                <hr class="text-primary">
                            </div>
                        </div>
                        <ul class="list-unstyled mx-3 my-0">
                            <li class="text-secondary mb-2">Múltiples Módulos</li>
                            <li class="text-secondary mb-2">Múltiples Usuarios</li>
                            <li class="text-secondary mb-2">Diseño Personalizado</li>
                            <li class="text-secondary mb-2">N<sup>o</sup> Clientes - Ilimitado</li>
                            <li class="text-secondary">Sucursales</li>
                        </ul>
                        <div class="text-center mt-1">
                            <div class="text-warning fw-bold fs-5"> COMISIÓN 1%</div>
                            <div class="text-primary fs-6"> Pago base mensual</div>
                            <div class="mx-5">
                                <div class="d-grid">
                                    <button class="btn btn-primary rounded-pill fs-4" type="button">
                                        $ 5,00
                                    </button>
                                </div>
                            </div>
                            <div class="my-2 " style="font-size: 0.6rem">
                                Ventas mayores a $500 comisión del 1%
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="mb-3">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary rounded-pill fs-4" type="button">
                                ODONTOLOGÍA
                            </button>
                        </div>
                    </div>

                    <div class="card mb-4 rounded-3 bg-primary px-4 text-white">

                        <div class="my-0 fw-normal">
                            <h6 class="text-center mt-4 fs-4">Registro: $35,00</h6>
                            <div class="mx-3">
                                <hr>
                            </div>
                        </div>
                        <ul class="list-unstyled mx-3 my-0">
                            <li class=" mb-2">Múltiples Módulos</li>
                            <li class=" mb-2">Múltiples Usuarios</li>
                            <li class=" mb-2">Diseño Personalizado</li>
                            <li class=" mb-2">N<sup>o</sup> Pacientes - Ilimitado</li>
                            <li class="mb-2">Odontograma</li>
                            <li class="mb-2">Sucursales</li>
                        </ul>
                        <div class="text-center mt-2 mb-3">
                            <div class="fs-6"> Pago mensual</div>
                            <div class="mx-5">
                                <div class="d-grid">
                                    <button class="btn btn-outline-primary bg-white text-primary rounded-pill fs-4"
                                            type="button">
                                        $ 29,00
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="mb-3">
                        <div class="d-grid">
                            <button class="btn btn-primary rounded-pill fs-4" type="button">
                                MEDICINA
                            </button>
                        </div>
                    </div>

                    <div class="card mb-4 rounded border-primary px-4 text-primary">

                        <div class="my-0 fw-normal">
                            <h6 class="text-center mt-4 fs-4">Registro: $35,00</h6>
                            <div class="mx-3">
                                <hr>
                            </div>
                        </div>
                        <ul class="list-unstyled mx-3 my-0">
                            <li class=" mb-2">Múltiples Módulos</li>
                            <li class=" mb-2">Múltiples Usuarios</li>
                            <li class=" mb-2">Diseño Personalizado</li>
                            <li class=" mb-2">N<sup>o</sup> Pacientes - Ilimitado</li>
                            <li class="mb-2">Diagnóstico y Tratamiento</li>
                            <li class="mb-2">Sucursales</li>
                        </ul>
                        <div class="text-center mt-2 mb-3">
                            <div class="fs-6"> Pago mensual</div>
                            <div class="mx-5">
                                <div class="d-grid">
                                    <button class="btn btn-primary text-white rounded-pill fs-4" type="button">
                                        $ 25,00
                                    </button>
                                </div>
                            </div>
                        </div>
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