import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FautService} from '../../services/faut.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(private fautService: FautService,
                private router: Router) {
    }

    ngOnInit() {
        if (this.fautService.isAuthenticated()) {
            this.goToLoggedHome();
        } else {
            this.goToEvento();
        }
    }

    goToEvento() {
        this.router.navigate(['home']);
    }

    goToLoggedHome() {
        this.router.navigate(['lghome']);
    }

}
