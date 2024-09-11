import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-facturaslistgen',
    template: `
        <app-facturaslist [tracodigo]="tracodigo" [tipo]="tipo"></app-facturaslist>
    `
})
export class FacturaslistgenComponent implements OnInit {
    tipo: number; // 1-ventas//2-compras
    tracodigo: number;

    constructor(private router: Router,
                private route: ActivatedRoute) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.paramMap.subscribe(params => {
            this.tipo = parseInt(params.get('tipo'), 10);
            if (this.tipo === 1) {
                this.tracodigo = 1;
            } else if (this.tipo === 2) {
                this.tracodigo = 7;
            }
            else{
                this.tracodigo = 4;
            }
        });
    }

    ngOnInit(): void {
    }
}
