import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';
import {SeccionService} from '../../../services/seccion.service';
import {SwalService} from '../../../services/swal.service';
import {MenuItem} from 'primeng/api';


@Component({
    selector: 'app-logged-home',
    templateUrl: './logged-home.component.html',
    styleUrls: ['./logged-home.component.css']
})
export class LoggedHomeComponent implements OnInit {

    menuApp: MenuItem[];
    secciones: Array<any>;
    seccion: any;

    constructor(private fautService: FautService,
                private router: Router,
                private seccionService: SeccionService,
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

}
