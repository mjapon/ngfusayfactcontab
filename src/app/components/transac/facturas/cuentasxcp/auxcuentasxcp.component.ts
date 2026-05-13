import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-aux-cuentasxcp',
    template: `
        <app-cuentasxcp [tipo]="tipo"> </app-cuentasxcp>
        `
})
export class AuxcuentasxcpComponent {
    tipo: number;
    constructor(private route: ActivatedRoute) {
        this.route.paramMap.subscribe(params => {
            this.tipo = parseInt(params.get('tipo'), 10);
        });
    }
}