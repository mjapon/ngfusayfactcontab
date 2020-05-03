import {Component, OnInit} from '@angular/core';
import {PacienteService} from "../../services/paciente.service";
import {Router} from "@angular/router";


declare var $: any;
declare const FB: any;
declare const gapi: any;

@Component({
    selector: 'app-telemedicina',
    templateUrl: './telemedicina.component.html',
    styleUrls: ['./telemedicina.component.css']
})
export class TelemedicinaComponent implements OnInit {

    constructor(
        private pacienteService: PacienteService,
        private router: Router
    ) {
    }

    ngOnInit() {

    }

    gotoLoginPaciente() {
        if (this.pacienteService.isAuthenticated()) {
            this.router.navigate(['citasPaciente']);
        } else {
            this.router.navigate(['ingresoPaciente']);
        }
    }

}
