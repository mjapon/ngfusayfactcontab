import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
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

    constructor(private authService: AuthService,
                private localStorageService: LocalStorageService,
                private router: Router,
                private fautService: FautService,
                private loadingUiService: LoadingUiService,
                private config: PrimeNGConfig,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.blocked = false;
        this.translateService.setDefaultLang('es');
        this.translate('es');
        this.isLogged = this.fautService.isAuthenticated();
        this.fautService.source.subscribe(msg => {
            if (msg === 'logout') {
                this.isLogged = false;
            } else if (msg === 'login') {
                this.isLogged = true;
            }
            if (this.isLogged) {
                //
            }
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
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
