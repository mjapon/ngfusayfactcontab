import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-basicdatosref',
    template: `
        <div>
            <div class="row">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Referente: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosref.nomapel}} </span>
                </div>
            </div>

            <div class="row mt-1">
                <div class="col-md-3">
                    <span class="fw-normal fontsizenr"> Num Ci: </span>
                </div>
                <div class="col-md">
                    <span class="fw-bold fontsizenr"> {{datosref.per_ciruc}} </span>
                </div>
            </div>
        </div>
    `
})
export class BasicdatosrefComponent {
    @Input() datosref: any = {};


}
