import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-citasplaned',
    templateUrl: './citasplaned.component.html',
    styleUrls: ['./citasplaned.component.css']
})
export class CitasplanedComponent implements OnInit {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    tipoFiltro: number;
    fechasstr: string;
    @Input() tipocita: number;
    @Output() registraAtencionEv = new EventEmitter<any>();

    rowHistoriaSel: any;
    showModalDet: boolean;

    constructor(private loadingUiService: LoadingUiService,
                private citasMedicasService: CitasMedicasService,
                private cosmedicamsgService: ConsMedicaMsgService,
                private router: Router) {
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

    verCita(item: any) {
        this.rowHistoriaSel = item;
        this.showModalDet = true;
    }

    clickFiltro(tipo, event: Event) {
        event.preventDefault();
        this.tipoFiltro = tipo;
        this.loadGrid();
    }

    onCerrarDetHistoria($event: any) {
        this.showModalDet = false;
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
        this.router.navigate(['calendario', this.tipocita]);
    }

    onrowclic(rowData) {
        this.rowHistoriaSel = rowData;
        this.showModalDet = true;
    }

    onRegistraAtencionEv($event: any) {
        this.showModalDet = false;
        this.registraAtencionEv.emit($event);
    }
}
