import {Component, OnInit} from '@angular/core';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cobroagua',
    templateUrl: './cobroagua.component.html'
})
export class CobroaguaComponent implements OnInit {
    isLoading = false;

    constructor(private ctes: CtesAguapService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    doCancel() {
        this.router.navigate([this.ctes.rutaContra()]);
    }

    doSave() {

    }
}
