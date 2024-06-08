import {Component, OnInit} from '@angular/core';
import {PersonaService} from '../../../services/persona.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {Router} from '@angular/router';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-citasodonto',
    templateUrl: './citasodonto.component.html'
})
export class CitasodontoComponent implements OnInit {
    selectedMasterTab: number;
    selectedSupTab: number;
    selectedTab: number;
    showFichaClinica: boolean;
    pacienteSelected: any;
    datosIncompletos: boolean;
    datosPacienteFull: any;
    tipoOdontogramaSel: number;
    isShowCalendar = false;

    constructor(private personaService: PersonaService,
                private domService:DomService,
                private loadUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.clearAll();
        this.domService.setFocusTm('buscaPacNomCiInput',500);
    }

    selectSupTab(tab: number, event: Event) {
        this.selectedSupTab = tab;
        event.preventDefault();
    }

    onSelectMasterTab($event) {
        this.selectedMasterTab = $event;
    }

    onCreaPaciente($event: any) {
        this.pacienteSelected = {per_id: 0};
        this.showFichaClinica = true;
    }

    onSelPaciente($event: any) {
        this.pacienteSelected = $event;
        this.showFichaClinica = true;
    }

    clearAll() {
        this.selectedMasterTab = 1;
        this.selectedSupTab = 1;
        this.selectedTab = 0;
        this.showFichaClinica = false;
        this.pacienteSelected = null;
        this.datosIncompletos = false;
        this.datosPacienteFull = {};
        this.tipoOdontogramaSel = 1;
    }

    realoadDatosPaciente() {
        this.loadUiService.publishBlockMessage();
        this.personaService.buscarPorCodfull(this.pacienteSelected.per_id).subscribe(res => {
            if (res.status === 200) {
                this.datosPacienteFull = res.persona;
                this.pacienteSelected = res.persona;
            }
        });
    }

    limpiar() {
        this.clearAll();
    }

    onPacienteLoaded($event: any) {
        this.datosPacienteFull = $event;
        this.pacienteSelected = $event;
    }

    onPacienteSaved($event: any) {
        if (this.pacienteSelected.per_id === 0) {
            this.pacienteSelected.per_id = $event;
        }
        this.realoadDatosPaciente();
    }

    onAntePerSave($event: any) {
    }

    onExamFisSave($event: any) {
    }

    setTipoOdontograma(tipo: number) {
        this.tipoOdontogramaSel = tipo;
    }

    auxShowFichaClinica(perid: number) {
        this.loadUiService.publishBlockMessage();
        this.personaService.buscarPorCodfull(perid).subscribe(res => {
            if (res.status === 200) {
                this.pacienteSelected = res.persona;
                this.showFichaClinica = true;
            }
        });
    }

    onRegistraAtencionEv($event: any) {
        this.auxShowFichaClinica($event.pac_id);
    }

    onCancelarAgenda($event: any) {
        this.selectedMasterTab = 1;
    }

    onEventoCreated($event: any) {
        this.selectedMasterTab = 1;
    }

    doGotoCalendar($event: any) {
        this.isShowCalendar = true;
    }

    showListado($event: any) {
        this.isShowCalendar = false;
    }

    doShowHistoria($event) {
        this.auxShowFichaClinica($event.per_id);
    }
}
