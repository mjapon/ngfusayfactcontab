import {Component, Input, OnInit} from '@angular/core';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';

@Component({
    selector: 'app-citasplaned',
    templateUrl: './citasplaned.component.html',
    styleUrls: ['./citasplaned.component.css']
})
export class CitasplanedComponent implements OnInit {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    enableBtns: boolean;
    tipoFiltro: number;
    fechasstr: string;
    @Input() tipocita: number;

    constructor(private loadingUiService: LoadingUiService,
                private citasMedicasService: CitasMedicasService,
                private cosmedicamsgService: ConsMedicaMsgService) {
    }

    ngOnInit(): void {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.tipoFiltro = 0;
        this.fechasstr = '';
        this.loadGrid();
    }

    loadGrid() {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasService.listarProximas(this.tipoFiltro, this.tipocita).subscribe(res => {
            this.cols = res.grid.cols;
            this.items = res.grid.data;
            this.fechasstr = res.fechas;
        });
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    crerCita(rowData) {
        this.cosmedicamsgService.publishMessage({tipo: 1, msg: rowData});
    }

    clickFiltro(tipo, event: Event) {
        event.preventDefault();
        this.tipoFiltro = tipo;
        this.loadGrid();
    }

    clearFiltro() {
        this.tipoFiltro = 0;
        this.fechasstr = '';
        this.loadGrid();
    }
}
