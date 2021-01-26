import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-newfacturaform',
    template: `
        <app-facturasform tracodigo="1" tdvcodigo="1" [form]="form">
        </app-facturasform>
    `
})
export class NewfacturaformComponent implements OnInit {

    form: any;

    constructor() {
    }

    ngOnInit(): void {
        this.form = {
            form_cab: {},
            form_persona: {},
            detalles: [],
            pagos: [],
            totales: {}
        };
    }

}
