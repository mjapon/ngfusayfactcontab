import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';
import {SeccionService} from "../../../services/seccion.service";
import {SwalService} from "../../../services/swal.service";

@Component({
    selector: 'app-logged-home',
    templateUrl: './logged-home.component.html',
    styleUrls: ['./logged-home.component.css']
})
export class LoggedHomeComponent implements OnInit {

    menu: any;
    secciones: Array<any>;
    seccion: any;

    constructor(private fautService: FautService,
                private router: Router,
                private seccionService: SeccionService,
                private swalService: SwalService) {
    }

    ngOnInit() {
        const menuFrom = this.fautService.getMenuApp();
        this.loadSeciones();
        this.fautService.source.subscribe(msg => {
            if (msg === 'updateSecciones') {
                this.loadSeciones();
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
                this.fautService.publishMessage("updateSeccion");
            }
        });
    }

}
