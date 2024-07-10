import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomService} from '../../services/dom.service';

@Component({
    selector: 'app-referentes',
    template: `
        <h1 class="bd-title mb-1">
            <i class="fa-solid fa-address-book"></i>
            Referentes</h1>
        <app-listadorefs (evSelPaciente)="onSelPaciente($event)"
                         (evCrearPaciente)="onCreaPaciente($event)"></app-listadorefs>

    `
})
export class ReferenteslistComponent implements OnInit {

    constructor(private router: Router, private domService: DomService) {

    }

    ngOnInit(): void {
        this.domService.setFocusTm('buscaPacNomCiInput',500);
    }

    onSelPaciente($event: any) {
        this.router.navigate(['referentes', $event.per_id]);
    }

    onCreaPaciente($event: any) {
        this.router.navigate(['referentes', 0]);
    }
}
