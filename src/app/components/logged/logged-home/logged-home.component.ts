import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';
import {SeccionService} from '../../../services/seccion.service';
import {SwalService} from '../../../services/swal.service';
import {MenuItem} from 'primeng/api';
import {FechasService} from '../../../services/fechas.service';
import {DatosloggedService} from '../../../services/datoslogged.service';

@Component({
    selector: 'app-logged-home',
    templateUrl: './logged-home.component.html',
    styles: [
            `.datouser {
            background: #e2e2e2;
            border-radius: 5px;
        }
        `]
})
export class LoggedHomeComponent implements OnInit {

    menuApp: MenuItem[];
    secciones: Array<any>;
    seccion: any = {};
    userinfo: any = {};
    fechaactualstr = '';
    accesosdir: Array<any> = [];
    isLoading = false;
    datosempresa: any = {};
    vapp = '';

    constructor(private fautService: FautService,
                private router: Router,
                private fechasService: FechasService,
                private seccionService: SeccionService,
                private datosLoggedServ: DatosloggedService,
                private swalService: SwalService) {
        this.menuApp = [];
    }

    ngOnInit() {
        const menuApp = this.fautService.getMenuApp();
        if (menuApp) {
            this.menuApp = menuApp;
        }
        this.loadSeciones();
        this.fautService.source.subscribe(msg => {
            if (msg === 'updateSecciones') {
                this.loadSeciones();
            } else if (msg === 'loadmenu') {
                const menu = this.fautService.getMenuApp();
                if (menu) {
                    this.menuApp = menu;
                }
            }
        });

        const userInfoSaved = this.fautService.getUserInfoSaved();
        if (userInfoSaved) {
            this.userinfo = userInfoSaved;
        }

        this.fechaactualstr = '';

        this.loadDatosLogged();
    }

    loadDatosLogged() {
        this.isLoading = true;
        this.datosLoggedServ.getDatosLogged().subscribe(res => {
            this.isLoading = false;
            if (res.status === 200) {
                this.fechaactualstr = res.datlogged.fecha;
                this.accesosdir = res.datlogged.accesosdir;
                this.fautService.setMenuApp(res.datlogged.menu);
                this.fautService.setVersionApp(res.datlogged.vapp);
                this.fautService.publishMessage('loadmenu');
                this.fautService.publishMessage('loadvapp');
                this.datosempresa = res.datlogged.datosemp;
            }
        });
    }

    loadSeciones() {
        this.secciones = this.fautService.getSecciones();
        this.seccion = this.fautService.getSeccionInfoSaved();
    }

    cambiarSeccion(seccion) {
        this.seccionService.setSeccion(seccion.sec_id).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess('Nueva sección seleccionada');
                this.fautService.updateToken(res.token, res.seccion);
                this.seccion = res.seccion;
                this.fautService.publishMessage('updateSeccion');
            }
        });
    }

    changeCss(acc: any, estilo: string) {
        acc.css = estilo;
    }

    onAccDirOver(acc: any) {
        this.changeCss(acc, 'btn-outline-primary');
    }

    onAccDirOut(acc: any) {
        this.changeCss(acc, 'btn-outline-secondary');
    }

    doroute(acc: any) {
        this.router.navigate([acc.route]);
    }
}
