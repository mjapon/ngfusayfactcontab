import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {NavigationEnd, NavigationStart, Router, RouterEvent} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {filter} from 'rxjs/operators';
import {TtpdvService} from '../../../services/ttpdv.service';
import {SwalService} from '../../../services/swal.service';
import {SeccionService} from '../../../services/seccion.service';

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
    secciones: Array<any> = [];
    ttpdvs: Array<any> = [];
    currTdvcod = 1;

    constructor(private fautService: FautService,
                private swalService: SwalService,
                private seccionService: SeccionService,
                private ttpdvService: TtpdvService,
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
                /*
                this.swalService.fireToastSuccess('Nueva sección seleccionada y punto de emisión seleccionado');
                this.fautService.updateTokenAndSec(res.token, res.seccion);
                this.seccion = res.seccion;
                this.fautService.publishMessage('updateSeccion');
                this.fautService.setTtpdvs(res.ttpdvs);
                this.ttpdvs = res.ttpdvs;
                this.fautService.updateTokenAndTdvcod(res.token, res.tdv_codigo);
                 */
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

    hideAppMenu() {
        this.fautService.publishMessage('hideappmenu');
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
}
