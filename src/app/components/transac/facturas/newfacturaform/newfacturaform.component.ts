import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-newfacturaform',
    template: `
        <app-facturasform [tracodigo]="tracodigo" [form]="form"
                          [isedit]="isedit"
                          (evCancela)="oncancelar()"
                          (evGuardarOk)="onguardar()">
        </app-facturasform>
    `
})
export class NewfacturaformComponent implements OnInit {

    form: any;
    tracodigo: number;
    isedit = false;

    constructor(private router: Router,
                private route: ActivatedRoute) {
        this.route.paramMap.subscribe(params => {
            this.tracodigo = parseInt(params.get('tracodigo'), 10);
            const acc = params.get('acc');
            this.isedit = acc === 'e';
        });
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
        let tipo = 2;
        if (this.tracodigo !== 7) {
            tipo = 1;
        }
        this.router.navigate(['trndocs', tipo]);
    }

    onguardar() {
        this.gotolist();
    }

    oncancelar() {
        this.gotolist();
    }

}
