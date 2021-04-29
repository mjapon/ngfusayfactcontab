import {Component, OnInit} from '@angular/core';
import {PersonaService} from '../../services/persona.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonEvService} from '../../services/personev.service';

@Component({
    selector: 'app-referenteview',
    template: `
        <div *ngIf="isLoading">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!isLoading">

            <h5 class="quitaPaddingMargin mb-1 ml-2">
                <span class="fas fa-user"></span> Datos del referente
            </h5>

            <div *ngIf="referente">
                <app-resumenref [referente]="referente" (evBtnTabClic)="onTabRefClic($event)"
                                (evBtnCerrar)="cancelCreaRef()" [totalestrns]="tottrns"></app-resumenref>
            </div>
            <div *ngIf="tabactive===1">
                <app-datospaciente [codPaciente]="codref" (pacienteLoaded)="onReferenteLoaded($event)"
                                   (pacienteSaved)="onReferenteSaved($event)"
                                   (datosIncompletosEv)="onDatosIncompletos($event)"
                                   [datosmedicos]="false"
                                   (creacionCancelada)="cancelCreaRef()"></app-datospaciente>
            </div>
            <div *ngIf="tabactive ===3">
                <app-factpagos [codpaciente]="codref" [clase]="1"
                               (evDeudasChange)="reloadStatusDeudas($event)"></app-factpagos>
            </div>
            <div *ngIf="tabactive ===5">
                <app-factpagos [codpaciente]="codref" [clase]="2"
                               (evDeudasChange)="reloadStatusDeudas($event)"></app-factpagos>
            </div>
            <div *ngIf="tabactive ===6">
                <app-credreflist [codref]="codref" [clase]="1"
                                 (evDeudasChange)="reloadStatusDeudas($event)"></app-credreflist>
            </div>
            <div *ngIf="tabactive ===7">
                <app-credreflist [codref]="codref" [clase]="2"
                                 (evDeudasChange)="reloadStatusDeudas($event)"></app-credreflist>
            </div>
        </div>
    `
})
export class ReferenteviewComponent implements OnInit {
    codref: number;
    isLoading: boolean;
    referente: any;
    tabactive: number;
    tottrns: any = {};

    constructor(private personaService: PersonaService,
                private route: ActivatedRoute,
                private personEvService: PersonEvService,
                private router: Router) {
        this.isLoading = true;
        this.route.paramMap.subscribe(params => {
            this.codref = parseInt(params.get('codref'), 10);
            this.isLoading = false;
            this.loadTotalesTransacc();
        });
    }

    ngOnInit(): void {
        this.tabactive = 1;
    }

    onReferenteLoaded($event: any) {
        this.referente = $event;
    }

    onReferenteSaved($event: any) {

    }

    onDatosIncompletos($event: any) {

    }

    cancelCreaRef() {
        this.router.navigate(['referentes']);
    }

    onTabRefClic($event: any) {
        this.tabactive = $event;
    }

    reloadStatusDeudas($event: any) {
        this.personEvService.publishUpdateDeudaMsg();
        this.loadTotalesTransacc();
    }

    loadTotalesTransacc() {
        this.personaService.getTotalesTransacc(this.codref).subscribe(res => {
            if (res.status === 200) {
                this.tottrns = res.totales;
            }
        });
    }
}
