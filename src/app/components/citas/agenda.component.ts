import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SwalService} from '../../services/swal.service';


@Component({
    selector: 'app-agenda',
    template: `
        <div>
            <div *ngIf="!isShowLista">
                <app-odcalendar [tipoCita]="tipoCita" [showListado]="true" [enableCalendars]="true"
                                (evListado)="showListado($event)"></app-odcalendar>
            </div>
            <div *ngIf="isShowLista">
                <app-citasplaned [disablecals]="false" [tipocita]="tipoCita" (gotoCalendarEv)="gotoCalendar($event)"
                                 (registraAtencionEv)="doRegAtencion($event)"></app-citasplaned>
            </div>
        </div>

    `
})
export class AgendaComponent implements OnInit {

    tipoCita: number;
    isShowLista: boolean;

    constructor(private route: ActivatedRoute,
                private swalService: SwalService) {
        this.route.paramMap.subscribe(params => {
            this.tipoCita = parseInt(params.get('tipo'), 10);
        });
    }

    ngOnInit(): void {
        this.isShowLista = true;
    }

    showListado($event) {
        this.tipoCita = $event;
        this.isShowLista = true;
    }

    doRegAtencion($event: any) {
        this.swalService.fireToastInfo('No implementado');
    }

    gotoCalendar($event: any) {
        this.tipoCita = $event;
        this.isShowLista = false;
    }
}
