import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-loggednavbar',
    templateUrl: './loggednavbar.component.html',
    styleUrls: ['./loggednavbar.component.css']
})
export class LoggednavbarComponent implements OnInit {

    userinfo: any;
    seccion: any;

    constructor(private fautService: FautService,
                private router: Router) {
        this.userinfo = {};
    }


    ngOnInit() {
        const userInfoSaved = this.fautService.getUserInfoSaved();
        if (userInfoSaved) {
            this.userinfo = userInfoSaved;
        }
        this.seccion = this.fautService.getSeccionInfoSaved();

        this.fautService.source.subscribe(msg => {
            if (msg === 'updateSeccion') {
                this.seccion = this.fautService.getSeccionInfoSaved();
            }
        });
    }

    logout() {
        this.fautService.clearInfoAuthenticated();
        this.fautService.publishMessage('logout');
        this.router.navigate(['/']);
    }

}
