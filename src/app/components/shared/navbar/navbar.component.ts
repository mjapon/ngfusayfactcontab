import {Component, NgZone, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    items: MenuItem[];

    isLogged: boolean;

    user: User;

    constructor(
        private router: Router,
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private afAuth: AngularFireAuth,
        private ngZone: NgZone
    ) {
    }

    ngOnInit() {
        this.authService.currentMessage.subscribe(message => {
            this.isLogged = false;
            if ('true' === message) {
                this.isLogged = true;
            }
        });

        this.afAuth.user.subscribe(user => {
            if (user) {
                this.user = user;
            } else {
                this.user = null;
                this.ngZone.run(() => {
                    this.router.navigate(['']);
                });
            }
        });

        this.isLogged = this.authService.isAuthenticated();
        this.items = [
            {
                label: 'Inicio'
            },
            {
                label: 'Principal',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        items: [{label: 'Project'}, {label: 'Other'}]
                    },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Reportes',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {label: 'Delete', icon: 'pi pi-fw pi-trash'},
                    {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
                ]
            },
            {
                label: 'Administracion',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {label: 'Delete', icon: 'pi pi-fw pi-trash'},
                    {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
                ]
            }
        ];
    }

    goToIngresar() {
        this.router.navigate(['login']);
    }

    goToSalir() {
        this.isLogged = false;
        this.localStorageService.removeItem('userDataSession');
        this.localStorageService.removeItem('islogged');
        this.authService.changeMessage('false');
        this.router.navigate(['/']);
    }
}
