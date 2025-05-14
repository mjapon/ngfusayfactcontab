import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';
import {SeccionService} from '../../../services/seccion.service';
import {SwalService} from '../../../services/swal.service';
import {MenuItem} from 'primeng/api';
import {DatosloggedService} from '../../../services/datoslogged.service';
import {TtpdvService} from '../../../services/ttpdv.service';

@Component({
    selector: 'app-logged-home',
    templateUrl: './logged-home.component.html',
    styles: [
        `.datouser {
            background: #e2e2e2;
            border-radius: 5px;
        }

        .page-container {
            position: relative;
            min-height: 88vh;
        }

        .content-wrap {
            padding-bottom: 0rem;
        }

        .footerd {
            /*position: absolute;
            bottom: 0;*/
            width: 100%;
            height: 3rem;
        }`]
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
    infofactele: any = {};

    constructor(private fautService: FautService,
                private router: Router,
                private seccionService: SeccionService,
                private ttpdvService: TtpdvService,
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
            } else if (msg === 'updateSeccion') {
                this.seccion = this.fautService.getSeccionInfoSaved();
            } else if (msg === 'changeSecFromNav') {
                this.loadDatosLogged();
            }
        });

        const userInfoSaved = this.fautService.getUserInfoSaved();
        if (userInfoSaved) {
            this.userinfo = userInfoSaved;
        }

        this.fechaactualstr = '';

        this.loadDatosLogged();

        // Verificar si se debe traer la informacion del punto de emision
        this.checkTtpdv();

    }

    checkTtpdv() {
        if (!this.fautService.isTdvCodSaved()) {
            this.ttpdvService.listarMin().subscribe(restpdv => {
                if (restpdv.status === 200) {
                    if (restpdv.ttpdvs) {
                        this.fautService.setTtpdvs(restpdv.ttpdvs);
                        const tdvcod = restpdv.ttpdvs[0].tdv_codigo;
                        this.ttpdvService.setTdvcodigo(tdvcod).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess('Nuevo punto de emisión seleccionado');
                                this.fautService.updateTokenAndTdvcod(res.token, tdvcod);
                            }
                        });
                    }
                    this.fautService.publishMessage('updateTtpdvs');
                }
            });
        }
    }

    loadDatosLogged() {
        this.isLoading = true;
        this.datosLoggedServ.getDatosLogged().subscribe(res => {
            this.isLoading = false;
            if (res.status === 200) {
                this.fechaactualstr = res.datlogged.fecha;
                this.accesosdir = res.datlogged.accesosdir; // TODO: Esto se debe quitar
                this.fautService.setMenuApp(res.datlogged.menu);
                this.fautService.setVersionApp(res.datlogged.vapp);
                this.fautService.setEmpCodigoFromRest(res.datlogged.emp);
                this.fautService.publishMessage('loadmenu');
                this.fautService.publishMessage('loadvapp');
                this.datosempresa = res.datlogged.datosemp;
                this.fautService.calendarType = res.datlogged.sec_calendar || 0;
                this.fautService.countLoaded++;
                if (res.infofactele) {
                    this.infofactele = res.infofactele;
                }
                this.fautService.publishMessage('updateCalendar');
            }
        });
    }

    loadSeciones() {
        this.seccionService.listarUserSecs().subscribe(ressec => {
            if (ressec.status === 200) {
                this.secciones = ressec.items;
            }
        });
        this.seccion = this.fautService.getSeccionInfoSaved();
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
            this.loadDatosLogged();
        });
    }

    changeCss(acc: any, estilo: string) {
        acc.css = estilo;
    }

    onAccDirOver(acc: any) {
        this.changeCss(acc, 'btnmenuin');
    }

    onAccDirOut(acc: any) {
        this.changeCss(acc, 'btnmenuout');
    }

    doroute(acc: any) {
        this.router.navigate([acc.route]);
    }

}
