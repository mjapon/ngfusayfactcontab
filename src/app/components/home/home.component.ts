import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SwalService} from '../../services/swal.service';
import {FautService} from '../../services/faut.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(private fautService: FautService,
                private router: Router,
                private swalService: SwalService
    ) {
    }

    ngOnInit() {
        if (this.fautService.isAuthenticated()) {
            this.goToLoggedHome();
        } else {
            this.goToEvento();
        }
    }

    goToEvento() {
        this.router.navigate(['congreso2020']);
    }

    goToLoggedHome() {
        this.router.navigate(['lghome']);
    }

}
