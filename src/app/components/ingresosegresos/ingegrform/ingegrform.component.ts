import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-ingegrform',
    templateUrl: './ingegrform.component.html'
})
export class IngegrformComponent {
    tiporouting = 0;
    titulo = 'Ingreso';

    constructor(private router: Router,
                private route: ActivatedRoute) {
        this.route.paramMap.subscribe(params => {
            this.tiporouting = parseInt(params.get('tipo'), 10);
            this.setTitle();
        });
    }

    cancelar() {
        this.gotolist();
    }

    setTitle() {
        if (this.tiporouting === 1) {
            this.titulo = 'Ingreso';
        } else if (this.tiporouting === 2) {
            this.titulo = 'Gasto';
        } else if (this.tiporouting === 3) {
            this.titulo = 'Transferencia';
        }
    }

    gotolist() {
        this.router.navigate(['vtickets']);
    }


}
