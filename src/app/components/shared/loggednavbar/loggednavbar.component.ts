import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {NavigationEnd, NavigationStart, Router, RouterEvent} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {filter} from 'rxjs/operators';
import {TtpdvService} from '../../../services/ttpdv.service';
import {SwalService} from '../../../services/swal.service';
import {SeccionService} from '../../../services/seccion.service';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
    selector: 'app-loggednavbar',
    templateUrl: './loggednavbar.component.html'
})
export class LoggednavbarComponent implements OnInit {
    userinfo: any;
    seccion: any;
    empNombreComercial: any;
    menuApp: MenuItem[];
    isLogged: boolean;
    isSideVisible = false;
    versionApp = '';
    secciones: Array<any> = [];
    ttpdvs: Array<any> = [];
    currTdvcod = 1;

    hideShowSide = true;

    @Output() evHideMenu = new EventEmitter();

    constructor(private fautService: FautService,
                private swalService: SwalService,
                private seccionService: SeccionService,
                private ttpdvService: TtpdvService,
                private localStorage: LocalStorageService,
                private router: Router) {
        this.userinfo = {};
        this.menuApp = [];
        /*
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
        });*/
    }

    ngOnInit() {
        const userInfoSaved = this.fautService.getUserInfoSaved();
        if (userInfoSaved) {
            this.userinfo = userInfoSaved;
        }
        this.loadSeciones();
        this.loadTtpdvs();

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
            } else if (msg === 'updateTdvcod') {
                this.currTdvcod = this.fautService.getTdvCodigo();
            } else if (msg === 'logout') {
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
            } else if (msg === 'updateSecciones') {
                this.loadSeciones();
            } else if (msg === 'updateTtpdvs') {
                this.loadTtpdvs();
            }

            if (this.isLogged) {
            }
        });
        this.isLogged = this.fautService.isAuthenticated();

        const value = this.localStorage.getItem('sidehidemenu');
        this.hideShowSide = true;
        if (value === '1') {
            this.hideShowSide = false;
        }
        this.evHideMenu.emit(this.hideShowSide);
        console.log('value', value);
    }

    logout() {
        this.fautService.clearInfoAuthenticated();
        this.fautService.publishMessage('logout');
        this.router.navigate(['/']);
    }

    goHome() {
        this.router.navigate(['lghome']);
    }

    cambiarTtpdv(ttpdv) {
        this.ttpdvService.setTdvcodigo(ttpdv.tdv_codigo).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess('Nuevo punto de emisión seleccionado');
                this.fautService.updateTokenAndTdvcod(res.token, ttpdv.tdv_codigo);
            }
        });
    }

    cambiarSeccion(seccion) {
        this.seccionService.setSeccion(seccion.sec_id).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess('Nueva sección seleccionada');
                this.fautService.updateTokenAndSec(res.token, res.seccion);
                this.seccion = res.seccion;
                this.fautService.publishMessage('updateSeccion');
                this.fautService.setTtpdvs(res.ttpdvs);
                this.fautService.updateTokenAndTdvcod(res.token, res.tdv_codigo);
                this.fautService.publishMessage('updateTtpdvs');
            }
        });
    }

    loadSeciones() {
        this.secciones = this.fautService.getSecciones();
        this.seccion = this.fautService.getSeccionInfoSaved();
    }

    loadTtpdvs() {
        this.ttpdvs = this.fautService.getTtpdvs();
        this.currTdvcod = this.fautService.getTdvCodigo();
    }

    toggleSidebar() {
        this.isSideVisible = !this.isSideVisible;
    }

    sidebar() {
        console.log('sidebar-->');
        this.hideShowSide = !this.hideShowSide;
        this.evHideMenu.emit(this.hideShowSide);
        this.localStorage.setItem('sidehidemenu', this.hideShowSide ? '0' : '1');

    }
}
