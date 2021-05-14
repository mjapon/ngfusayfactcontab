import {Component, OnInit} from '@angular/core';
import {ContratoaguaService} from '../../../services/contratoagua.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-contratos',
    templateUrl: './contrato-agua.component.html'
})
export class ContratoAguaComponent implements OnInit {
    isLoading = false;

    constructor(private contraAgua: ContratoaguaService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    goToForm() {
        this.router.navigate(['aguap', 'contratos', 'form']);
    }
}
