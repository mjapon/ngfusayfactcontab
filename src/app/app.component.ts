import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {LocalStorageService} from './services/local-storage.service';
import {NavigationEnd, Router} from '@angular/router';
import {FautService} from './services/faut.service';

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
        /*
        router.events.subscribe((y: NavigationEnd) => {
          if(y instanceof NavigationEnd){
            gtag('config','UA-157924627-1',{'page_path' : y.url});
            fbq('track', 'PageView');
          }
        });
        */

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
                    {
                        label: 'Tickets',
                        icon: 'pi pi-fw pi-pencil',
                        expanded: true,
                        items: [
                            {label: 'Listado', icon: 'pi pi-fw ', routerLink: 'tickets'}
                        ]
                    },
                    {
                        label: 'Eventos',
                        icon: 'pi pi-pw pi-file',
                        expanded: true,
                        items: [
                            {label: 'Crear', icon: 'pi pi-fw pi-item', routerLink: 'eventosform'}
                        ]
                    },
                    {
                        label: 'Productos y servicios',
                        icon: 'pi pi-fw ',
                        expanded: true,
                        items: [
                            {label: 'Listado', icon: 'pi pi-fw ', routerLink: 'mercaderia'}
                        ]
                    }
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