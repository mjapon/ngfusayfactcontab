import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {LocalStorageService} from './services/local-storage.service';
import {NavigationEnd, Router} from '@angular/router';
import {FautService} from './services/faut.service';
import {LoadingUiService} from './services/loading-ui.service';

declare let gtag: Function;
declare let fbq: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'sysprint';

    isLogged = false;
    migasApp;
    menuApp;
    showMenu = true;
    blocked = false;

    constructor(private authService: AuthService,
                private localStorageService: LocalStorageService,
                private router: Router,
                private fautService: FautService,
                private loadingUiService: LoadingUiService) {
        this.migasApp = [
            {label: 'Inicio', routerLink: 'lghome'},
            {label: 'Productos y servicios', routerLink: 'mercaderia'}
        ];
    }

    ngOnInit(): void {
        this.blocked = false;
        this.isLogged = this.fautService.isAuthenticated();
        this.fautService.source.subscribe(msg => {
            if (msg === 'logout') {
                this.isLogged = false;
            } else if (msg === 'login') {
                this.isLogged = true;
            }
            if (this.isLogged) {
                this.menuApp = [
                    {label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: 'lghome'},
                    {label: 'Tickets', icon: 'pi pi-fw pi-ticket', routerLink: 'tickets'},
                    {label: 'Eventos', icon: 'pi pi-fw pi-tag', routerLink: 'eventosform'},
                    {label: 'Productos', icon: 'pi pi-fw pi-th-large', routerLink: 'mercaderia'},
                    {label: 'Mis Citas Médicas', icon: 'pi pi-fw pi-calendar', routerLink: 'miscitasmedicas'},
                    {label: 'Historias Clínicas', icon: 'pi pi-fw pi-calendar', routerLink: 'historiaclinica'},
                ];
            }
        });

        this.loadingUiService.source.subscribe(msg => {
            if (msg === 'block') {
                this.blocked = true;
            } else if (msg === 'unblock') {
                this.blocked = false;
            }
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    toggleShowMenu() {
        this.showMenu = !this.showMenu;
    }
}
