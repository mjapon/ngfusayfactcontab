import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PersonaService} from '../../services/persona.service';

@Component({
    selector: 'app-listadopacientes',
    template: `
        <div>
            <div class="row">
                <div class="col">
                    <input class="form-control form-rounded" id="buscaPacNomCiInput" type="text"
                           autocomplete="false"
                           placeholder="Buscar referente por nombres o número de cédula" [(ngModel)]="filtro"
                           (keyup)="onFiltroTyped()">
                </div>
                <div class="col-3">
                    <button class="btn btn-outline-primary btn-block" (click)="crearPaciente()"> Nuevo <span
                            class="fa fa-plus-circle"></span></button>
                </div>
            </div>
            <div style="padding-top: 10px">
                <div class="divpacientesemtpy rounded-lg"
                     *ngIf="pacientesArray.length===0 && filtro && filtro.trim().length>0 && !showAnim">
                    <div class="text-center">
                        <h3 class="text-muted"> No hay resultados <i class="fa fa-search"></i></h3>
                    </div>
                </div>
                <div class="divpacientes rounded-lg">
                    <div *ngIf="showAnim">
                        <app-loading></app-loading>
                    </div>
                    <div class="list-group" *ngIf="pacientesArray.length>0">
                        <a class="list-group-item list-group-item-action hand" *ngFor="let item of pacientesArray"
                           (click)="selectPaciente(item)">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div style="padding-right:20px !important; width: 6%">
                                    <img src="assets/imgs/{{item.per_genero===2?'female.png':'male.png'}}" alt="Avatar">
                                </div>
                                <div style="width: 90%">
                                    <h6 class="mb-0">{{item.nomapel}}</h6>
                                    <p class="mb-0 text-muted">
                                        <h7>{{item.per_ciruc}}</h7>
                                    </p>
                                    <p class="mb-0 text-muted">
                                        <h7>{{item.lugresidencia}}</h7>
                                    </p>
                                </div>
                                <div>
                                    <i class="fa fa-chevron-right"></i>
                                </div>
                            </div>
                        </a>
                        <a class="list-group-item list-group-item-action" *ngIf="hayMasFilasPac">
                            <p class="text-center">
                                <button class="btn btn-outline-primary" (click)="loadMorePacientes()"> Listar mas
                                </button>
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ListadopacientesComponent implements OnInit {

    @Output() evCrearPaciente = new EventEmitter<any>();
    @Output() evSelPaciente = new EventEmitter<any>();

    filtro: string;
    previustimer: any = 0;
    pacientesArray: Array<any>;
    currentPagPacientes: number;
    showAnim: boolean;
    hayMasFilasPac: boolean;

    constructor(private personaService: PersonaService) {
    }

    ngOnInit(): void {
        this.filtro = '';
        this.pacientesArray = [];
        this.currentPagPacientes = 0;
        this.hayMasFilasPac = false;
        this.buscarPacientes();
    }

    delayKeyup(callback, ms, prevtimer, context) {
        clearTimeout(prevtimer);
        return setTimeout(() => {
            callback(context);
        }, ms);
    }

    filtroDelayFn(context) {
        context.currentPagPacientes = 0;
        context.pacientesArray = [];
        context.bottomAlcanzado = false;
        context.buscarPacientes();
    }

    onFiltroTyped() {
        this.previustimer = this.delayKeyup(this.filtroDelayFn, 600, this.previustimer, this);
    }

    crearPaciente() {
        this.evCrearPaciente.emit(this.filtro);
    }

    loadMorePacientes() {
        if (this.hayMasFilasPac) {
            this.buscarPacientes();
        }
    }

    buscarPacientes() {
        this.showAnim = true;
        this.personaService.buscarPorNomapelCiPag(this.filtro, this.currentPagPacientes).subscribe(res => {
            if (res.status === 200) {
                this.pacientesArray.push.apply(this.pacientesArray, res.items);
                this.hayMasFilasPac = res.hasMore;
                if (res.hasMore) {
                    this.currentPagPacientes = res.nextp;
                }
            }
            this.showAnim = false;
        });
    }

    selectPaciente(item: any) {
        this.evSelPaciente.emit(item);
    }
}
