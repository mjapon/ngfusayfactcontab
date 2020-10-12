import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng';

@Component({
    selector: 'app-loggednavbar',
    templateUrl: './loggednavbar.component.html',
    styleUrls: ['./loggednavbar.component.css']
})
export class LoggednavbarComponent implements OnInit {
    userinfo: any;
    seccion: any;
    empNombreComercial: any;
    menuApp: MenuItem[];
    isLogged: boolean;

    constructor(private fautService: FautService,
                private router: Router) {
        this.userinfo = {};
        this.menuApp = new Array();
    }

    ngOnInit() {
        const userInfoSaved = this.fautService.getUserInfoSaved();
        if (userInfoSaved) {
            this.userinfo = userInfoSaved;
        }
        this.seccion = this.fautService.getSeccionInfoSaved();
        this.empNombreComercial = this.fautService.getNombreComercialSaved();
        if (!this.empNombreComercial) {
            this.empNombreComercial = 'SmartFact';
        }

        const menuAppCli = this.fautService.getMenuApp();
        if (menuAppCli) {
            this.menuApp = menuAppCli;
        }

        this.fautService.source.subscribe(msg => {
            if (msg === 'updateSeccion') {
                this.seccion = this.fautService.getSeccionInfoSaved();
            }
            if (msg === 'logout') {
                this.isLogged = false;
            } else if (msg === 'login') {
                this.isLogged = true;
            } else if (msg === 'loadmenu') {
                const menu = this.fautService.getMenuApp();
                if (menu) {
                    this.menuApp = menu;
                }
            }

            if (this.isLogged) {

            }
        });
        this.isLogged = this.fautService.isAuthenticated();
    }

    logout() {
        this.fautService.clearInfoAuthenticated();
        this.fautService.publishMessage('logout');
        this.router.navigate(['/']);
    }

    goHome() {
        this.router.navigate(['lghome']);
    }
}