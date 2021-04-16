import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LocalStorageService} from './services/local-storage.service';
import {NavigationEnd, Router} from '@angular/router';
import {FautService} from './services/faut.service';
import {LoadingUiService} from './services/loading-ui.service';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'sysprint';
    isLogged = false;
    blocked = false;
    stylemaindiv: string;
    classrouteroutlet: string;
    isshowAppMenu: boolean;

    constructor(private localStorageService: LocalStorageService,
                private router: Router,
                private fautService: FautService,
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
        if (this.isLogged) {
            if (this.isshowAppMenu) {
                this.classrouteroutlet = 'ml-2 mt-2 mr-0';
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
                this.classrouteroutlet = 'ml-2 mt-2 mr-0';
            } else if (msg === 'hideappmenu') {
                this.hideMenu();
            }
            if (this.isLogged) {
                if (this.isshowAppMenu) {
                    this.stylemaindiv = 'width: 92%;';
                    this.classrouteroutlet = 'ml-2 mt-2 mr-0';
                } else {
                    this.stylemaindiv = 'width: 100%;';
                    this.classrouteroutlet = '';
                }
            } else {
                this.classrouteroutlet = '';
                this.stylemaindiv = 'width: 100%;';
            }
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    hideMenu() {
        if (this.isshowAppMenu) {
            this.isshowAppMenu = false;
            this.stylemaindiv = 'width: 100%;';
            this.classrouteroutlet = '';
        } else {
            this.isshowAppMenu = true;
            this.stylemaindiv = 'width: 92%;';
            this.classrouteroutlet = 'ml-2 mt-2 mr-0';
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
