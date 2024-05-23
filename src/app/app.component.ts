import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LocalStorageService} from './services/local-storage.service';
import {NavigationEnd, Router} from '@angular/router';
import {FautService} from './services/faut.service';
import {LoadingUiService} from './services/loading-ui.service';
import {TranslateService} from '@ngx-translate/core';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import {FacteContribService} from './services/facte/contrib.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'sysprint';
    isLogged = false;
    isLoggedFacte = false;
    blocked = false;
    stylemaindiv: string;
    classrouteroutlet: string;
    isshowAppMenu: boolean;


    menuApp: MenuItem[];

    constructor(private localStorageService: LocalStorageService,
                private router: Router,
                private fautService: FautService,
                private contribService: FacteContribService,
                private loadingUiService: LoadingUiService,
                private config: PrimeNGConfig,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.stylemaindiv = 'width: 100%;';
        this.classrouteroutlet = '';
        this.isshowAppMenu = true;
        this.blocked = false;
        this.translateService.setDefaultLang('es');
        this.translate('es');
        this.isLogged = this.fautService.isAuthenticated();
        this.isLoggedFacte = this.contribService.isAuthenticated();
        if (this.isLogged) {
            if (this.isshowAppMenu) {
                this.classrouteroutlet = 'ms-2 mt-2 me-0';
                this.stylemaindiv = 'width: 92%;';
            } else {
                this.classrouteroutlet = '';
                this.stylemaindiv = 'width: 100%;';
            }
        } else {
            this.classrouteroutlet = '';
            this.stylemaindiv = 'width: 100%;';
        }
        this.fautService.source.subscribe(msg => {
            if (msg === 'logout') {
                this.isLogged = false;
                this.classrouteroutlet = '';
            } else if (msg === 'login') {
                this.isLogged = true;
                this.classrouteroutlet = 'ms-2 mt-2 me-0';
            } else if (msg === 'hideappmenu') {
                this.hideMenu();
            }
            if (this.isLogged) {
                if (this.isshowAppMenu) {
                    this.stylemaindiv = 'width: 92%;';
                    this.classrouteroutlet = 'ms-2 mt-2 me-0';
                } else {
                    this.stylemaindiv = 'width: 100%;';
                    this.classrouteroutlet = '';
                }
            } else {
                this.classrouteroutlet = '';
                this.stylemaindiv = 'width: 100%;';
            }
        });

        this.contribService.source.subscribe(msg => {
            if (msg === 'loginFacte') {
                this.isLoggedFacte = true;
            } else if (msg === 'logoutFacte') {
                this.isLoggedFacte = false;
            }
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });

        this.menuApp = [];
        this.loadmenu();
    }

    loadmenu(){
        const menuAppCli = this.fautService.getMenuApp();
        if (menuAppCli) {
            this.menuApp = menuAppCli;
        }
    }

    hideMenu() {
        if (this.isshowAppMenu) {
            this.isshowAppMenu = false;
            this.stylemaindiv = 'width: 100%;';
            this.classrouteroutlet = '';
        } else {
            this.isshowAppMenu = true;
            this.stylemaindiv = 'width: 92%;';
            this.classrouteroutlet = 'ms-2 mt-2 me-0';
        }
    }

    translate(lang: string) {
        this.translateService.get('primeng').subscribe(res => {
            this.config.setTranslation(res);
        });
    }

    ngAfterViewInit(): void {
        this.loadingUiService.source.subscribe(msg => {
            setTimeout(() => {
                if (msg === 'block') {
                    this.blocked = true;
                } else if (msg === 'unblock') {
                    this.blocked = false;
                }
            });
        });
    }
}
