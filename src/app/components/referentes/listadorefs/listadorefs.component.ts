import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PersonaService} from '../../../services/persona.service';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-listadorefs',
    styleUrls: ['./listadorefs.component.scss'],
    templateUrl: './listadorefs.component.html'
})
export class ListadorefsComponent implements OnInit {

    @Input() tipo = 0;
    @Output() evCrearPaciente = new EventEmitter<any>();
    @Output() evSelPaciente = new EventEmitter<any>();

    filtro: string;
    previustimer: any = 0;
    pacientesArray: Array<any>;
    currentPagPacientes: number;
    showAnim: boolean;
    hayMasFilasPac: boolean;
    randomStyles = [];

    constructor(private personaService: PersonaService,
                private domService: DomService) {
    }

    ngOnInit(): void {
        this.filtro = '';
        this.pacientesArray = [];
        this.currentPagPacientes = 0;
        this.hayMasFilasPac = false;
        this.buscarPacientes();
        for (let i = 0; i < 72; i++) {
            this.randomStyles.push(Math.floor(Math.random() * 71) + 1);
        }
    }

    getIndex(index) {
        const rangeMin = 1;
        const rangeMax = 72;
        return Math.round(((index / (this.randomStyles.length - 1)) * (rangeMax - rangeMin)) + rangeMin);
    }

    filtroDelayFn(context) {
        context.currentPagPacientes = 0;
        context.pacientesArray = [];
        context.bottomAlcanzado = false;
        context.buscarPacientes();
    }

    onFiltroTyped() {
        this.previustimer = this.domService.delayKeyup(this.filtroDelayFn, 600, this.previustimer, this);
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
        this.personaService.buscarPorNomapelCiPag(this.filtro, this.currentPagPacientes, this.tipo).subscribe(res => {
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

    getIniciales(nombreCompleto) {
        const preposiciones = ['la', 'de'];

        let palabras = nombreCompleto.trim().split(/\s+/);
        palabras = palabras.filter(palabra => !preposiciones.includes(palabra.toLowerCase()));

        if (palabras.length >= 3) {
            return palabras[0][0] + palabras[2][0];
        } else if (palabras.length >= 2) {
            return palabras[0][0] + palabras[1][0];
        } else if (palabras.length > 0) {
            return nombreCompleto.substring(0, 2);
        }

        return '..';
    }
}
