import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-referentes',
    template: `
        <h5 class="quitaPaddingMargin mb-2 mt-1 ms-2">
            <span class="fas fa-users"></span> Referentes
        </h5>
        <app-listadorefs (evSelPaciente)="onSelPaciente($event)"
                         (evCrearPaciente)="onCreaPaciente($event)"></app-listadorefs>

    `
})
export class ReferenteslistComponent implements OnInit {

    constructor(private router: Router) {

    }

    ngOnInit(): void {
    }

    onSelPaciente($event: any) {
        this.router.navigate(['referentes', $event.per_id]);
    }

    onCreaPaciente($event: any) {
        this.router.navigate(['referentes', 0]);
    }
}
