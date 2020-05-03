import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {LocalStorageService} from './services/local-storage.service';
import {NavigationEnd, Router} from '@angular/router';
import {FautService} from './services/faut.service';
import {faBoxes} from '@fortawesome/free-solid-svg-icons';

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

    constructor(private authService: AuthService,
                private localStorageService: LocalStorageService,
                private router: Router,
                private fautService: FautService) {
        this.migasApp = [
            {label: 'Inicio', routerLink: 'lghome'},
            {label: 'Productos y servicios', routerLink: 'mercaderia'}
        ];
    }

    ngOnInit(): void {
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
                    /*
                    {
                        label: 'Eventos',
                        icon: 'pi pi-pw',
                        expanded: false,
                        items: [
                            {label: 'Crear', icon: 'pi pi-fw pi-item', routerLink: 'eventosform'}
                        ]
                    },
                    {
                        label: 'Productos',
                        icon: 'pi pi-pw',
                        expanded: false,
                        items: [
                            {label: 'Listado', icon: 'pi pi-fw pi-item', routerLink: 'mercaderia'}
                        ]
                    },
                    */
                    {label: 'Citas Médicas', icon: 'pi pi-fw pi-calendar', routerLink: 'citasmedicas'},
                ];
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