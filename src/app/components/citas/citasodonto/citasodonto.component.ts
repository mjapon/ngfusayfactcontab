import {Component, OnInit} from '@angular/core';
import {PersonaService} from '../../../services/persona.service';
import {LoadingUiService} from '../../../services/loading-ui.service';

@Component({
    selector: 'app-citasodonto',
    templateUrl: './citasodonto.component.html',
    styleUrls: ['./citasodonto.component.css']
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

    constructor(private personaService: PersonaService,
                private loadUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.clearAll();
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
        //console.log('onAntePerSave saved', $event);
    }

    onExamFisSave($event: any) {
        //console.log('onExamFisSave saved', $event);
    }

    setTipoOdontograma(tipo: number) {
        this.tipoOdontogramaSel = tipo;
    }

    guardarOdontograma() {
        //console.log('clic guardar odontograma');
    }

    onRegistraAtencionEv($event: any) {
        this.loadUiService.publishBlockMessage();
        this.personaService.buscarPorCodfull($event.pac_id).subscribe(res => {
            if (res.status === 200) {
                this.pacienteSelected = res.persona;
                this.showFichaClinica = true;
            }
        });
    }
}
