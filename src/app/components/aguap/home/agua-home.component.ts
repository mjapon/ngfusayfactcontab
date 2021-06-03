import {Component, OnInit} from '@angular/core';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';

@Component({
    selector: 'app-contratos',
    templateUrl: './agua-home.html'
})
export class AguaHomeComponent implements OnInit {
    isLoading = false;

    constructor(private contraAgua: ContratoaguaService,
                private ctes: CtesAguapService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    goToForm() {
        this.router.navigate([this.ctes.rutaContraForm]);
    }

    gotoLectoMed() {
        this.router.navigate([this.ctes.rutaLectoMedForm]);
    }

    gotoPagos() {
        this.router.navigate([this.ctes.rutaPagos]);
    }

    _getRuta(grid) {
        const base = this.ctes.rutaListadosBase;
        return `${base}${grid}`;
    }

    gotoListaContratos() {
        this.router.navigate([this._getRuta(this.ctes.agp_contratos)]);
    }

    gotoListaLecturas() {
        this.router.navigate([this._getRuta(this.ctes.agp_lecturas)]);
    }
}
