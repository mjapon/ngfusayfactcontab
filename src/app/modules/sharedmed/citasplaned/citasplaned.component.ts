import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {PersonaService} from '../../../services/persona.service';
import {TcitaService} from '../../../services/tcita.service';

@Component({
    selector: 'app-citasplaned',
    styleUrl: 'citasplaned.component.scss',
    templateUrl: './citasplaned.component.html'
})
export class CitasplanedComponent implements OnInit, OnChanges {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    tipoFiltro = 0;
    fechasstr: string;
    personsCita: Array<any>;
    personCitaSel: number;
    rows = 50;
    page = 0;

    @Input() tipocita: number;
    @Output() registraAtencionEv = new EventEmitter<any>();
    @Output() gotoCalendarEv = new EventEmitter<any>();
    @Input() disablecals = true;

    rowHistoriaSel: any;
    showModalDet: boolean;


    constructor(private loadingUiService: LoadingUiService,
                private citasMedicasService: CitasMedicasService,
                private tcitaService: TcitaService) {
    }

    ngOnInit(): void {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.tipoFiltro = 0;
        this.fechasstr = '';
        this.loadPersonsCita();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const tipcitaChange = changes.tipocita;
        if (tipcitaChange.currentValue) {
            this.personCitaSel = tipcitaChange.currentValue;
            this.loadGrid();
        }
    }

    loadGrid() {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasService.listarProximas(this.tipoFiltro, this.tipocita).subscribe(res => {
            this.cols = res.grid.cols;
            this.items = res.grid.data;
            this.fechasstr = res.fechas;
        });
    }

    verCita(item: any) {
        this.rowHistoriaSel = item;
        this.showModalDet = true;
    }

    clickFiltro(tipo, event: Event) {
        event.preventDefault();
        if (this.tipoFiltro !== tipo) {
            this.tipoFiltro = tipo;
            this.loadGrid();
        } else {
            this.clearFiltro();
        }
    }

    clearFiltro() {
        this.tipoFiltro = 0;
        this.fechasstr = '';
        this.loadGrid();
    }

    onCerrarModalCitaCal($event: any) {
        this.showModalDet = false;
    }

    gotoCalendar() {
        this.gotoCalendarEv.emit(this.tipocita);
    }

    onrowclic(rowData) {
        this.rowHistoriaSel = rowData;
        this.showModalDet = true;
    }

    onRegistraAtencionEv($event: any) {
        this.showModalDet = false;
        this.registraAtencionEv.emit($event);
    }

    loadPersonsCita() {
        this.personsCita = [];
        this.tcitaService.getPersonsCita().subscribe(res => {
            if (res.status === 200) {
                this.personsCita = res.personscita;
            }
        });
    }

    onPersonCitaChange($event: any) {
        if (this.personCitaSel) {
            if (this.personCitaSel !== this.tipocita) {
                this.tipocita = this.personCitaSel;
                this.loadGrid();
            }
        }
    }

    protected readonly Math = Math;
}
