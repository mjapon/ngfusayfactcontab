import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-detfactview',
    template: `
        <div class="table-responsive">
            <table class="table table-sm table-bordered">
                <thead>
                <tr>
                    <th scope="col"><span class="fontsizesm">Código</span></th>
                    <th scope="col"><span class="fontsizesm">Producto/Servicio <span
                            class="badge badge-pill badge-primary"> {{detalles.length}} </span> </span></th>
                    <th scope="col"><span class="fontsizesm">Cant.</span></th>
                    <th scope="col">
                        <div class="d-flex flex-row-reverse">
                            <span class="fontsizesm">Precio U.</span>
                        </div>
                    </th>
                    <th scope="col"><span class="fontsizesm">Iva</span></th>
                    <th scope="col">
                        <div class="d-flex flex-row-reverse">
                            <span class="fontsizesm">Desc.</span>
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex flex-row-reverse">
                            <span class="fontsizesm">Precio T.</span>
                        </div>
                    </th>

                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let fila of detalles" class="hand">
                    <td>
                        <span class="fw-normal fontsizesm">{{fila.ic_code}}</span>
                    </td>
                    <td>
                        <span class="fw-bold fontsizesm">{{fila.ic_nombre}}</span>
                    </td>
                    <td>
                        <span class="fontsizesm">{{fila.dt_cant}}</span>
                    </td>
                    <td>
                        <div class="d-flex flex-row-reverse">
                            <span class="fontsizesm">{{fila.dt_precio}}</span>
                        </div>
                    </td>
                    <td>
                        <span class="fontsizesm">{{fila.dai_impg > 0 ? 'S' : 'N'}}</span>
                    </td>
                    <td>
                        <div class="d-flex flex-row-reverse">
                            <span class="fontsizesm">{{fila.dt_decto}}</span>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-row-reverse">
                            <span class="fontsizesm fw-bold">{{fila.dt_valor|number:'.2'}}</span>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    `
})
export class DetfactviewComponent {

    @Input() detalles: Array<any> = [];

}
