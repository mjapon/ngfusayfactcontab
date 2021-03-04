import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-newfacturaform',
    template: `
        <app-facturasform tracodigo="1" tdvcodigo="1" [form]="form"
                          (evCancela)="oncancelar()"
                          (evGuardarOk)="onguardar()">
        </app-facturasform>
    `
})
export class NewfacturaformComponent implements OnInit {

    form: any;

    constructor(private router: Router) {
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

    gotolist() {
        this.router.navigate(['trndocs']);
    }

    onguardar() {
        this.gotolist();
    }

    oncancelar() {
        this.gotolist();
    }

}
