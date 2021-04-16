import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {NavigationEnd, NavigationStart, Router, RouterEvent} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-loggednavbar',
    templateUrl: './loggednavbar.component.html',
    styles: [
            `.leftpanel {
            overflow-y: scroll;
            height: calc(100vh - 85px);
        }
        `]
})
export class LoggednavbarComponent implements OnInit {
    userinfo: any;
    seccion: any;
    empNombreComercial: any;
    menuApp: MenuItem[];
    isLogged: boolean;
    isSideVisible = false;
    versionApp = '';

    constructor(private fautService: FautService,
                private router: Router) {
        this.userinfo = {};
        this.menuApp = [];
        router.events.pipe(
            filter((ev): ev is RouterEvent => {
                return ev instanceof RouterEvent;
            })
        ).subscribe((evn: RouterEvent) => {
            if (evn instanceof NavigationStart) {
                this.isSideVisible = false;
            } else if (evn instanceof NavigationEnd) {
                // console.log('Evento NavigationEnd: ', evn);
            }
        });
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
            } else if (msg === 'loadvapp') {
                this.versionApp = this.fautService.getVersionApp() || '';
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

    hideAppMenu() {
        this.fautService.publishMessage('hideappmenu');
    }

    toggleSidebar() {
        this.isSideVisible = !this.isSideVisible;
    }
}
