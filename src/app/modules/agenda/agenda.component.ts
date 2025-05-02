import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsMedicaMsgService} from '../../services/cons-medica-msg.service';
import {CitasodontmsgService} from '../../services/citasodontmsg.service';
import {FautService} from '../../services/faut.service';


@Component({
    selector: 'app-agenda',
    template: `
        <div>
            <div *ngIf="!isShowLista">
                <app-mvcalendar [tipoCita]="tipoCita" [showListado]="true" [enableCalendars]="true"
                                (evListado)="showListado($event)"></app-mvcalendar>
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
                private router: Router,
                private cosMsgService: ConsMedicaMsgService,
                private msgOdontService: CitasodontmsgService,
                private fautService: FautService) {
        this.route.paramMap.subscribe(params => {
            this.tipoCita = parseInt(params.get('tipo'), 10);
        });
    }

    ngOnInit(): void {
        this.isShowLista = true;
        setTimeout(() => {
            if (this.fautService.calendarType) {
                this.tipoCita = this.fautService.calendarType;
            }
        }, 500);
    }

    showListado($event) {
        this.tipoCita = $event;
        this.isShowLista = true;
    }

    transformPacToPerson(event: any) {
        return {msg: {per_id: event.pac_id, per_ciruc: event.ciruc_pac}, tipo: 1};
    }

    transformPacToPersonOdonto(event: any) {
        return {paciente: {per_id: event.pac_id, per_ciruc: event.ciruc_pac}, tipo: 1};
    }

    doRegAtencion($event: any) {
        const tipo_rounting_cita = $event.tipo_rounting_cita;
        if (tipo_rounting_cita === 2) {
            // Go to ficha adontologica
            this.router.navigate(['odonto']).then(() => {
                setTimeout(() => {
                    const paciente = this.transformPacToPersonOdonto($event);
                    this.msgOdontService.publishMessage(paciente);
                }, 500);
            });
        } else if (tipo_rounting_cita === 1) {
            // go to ficha medica
            this.router.navigate(['historiaclinica', '1']).then(() => {
                setTimeout(() => {
                    const paciente = this.transformPacToPerson($event);
                    this.cosMsgService.publishMessage(paciente);
                }, 500);
            });
        }
    }

    gotoCalendar($event: any) {
        this.tipoCita = $event;
        this.isShowLista = false;
    }
}
