import {Component, OnInit} from '@angular/core';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';

@Component({
    selector: 'app-contratos',
    templateUrl: './contrato-agua.component.html'
})
export class ContratoAguaComponent implements OnInit {
    isLoading = false;

    constructor(private contraAgua: ContratoaguaService,
                private ctes: CtesAguapService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    goToForm() {
        this.router.navigate([this.ctes.rutaContraForm()]);
    }

    gotoLectoMed() {
        this.router.navigate([this.ctes.rutaLectoMedForm()]);
    }

    gotoPagos() {
        this.router.navigate([this.ctes.rutaPagos()]);
    }
}
