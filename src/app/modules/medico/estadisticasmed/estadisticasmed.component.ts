import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {ApprangofechasComponent} from '../../../components/shared/apprangofechas/apprangofechas.component';
import {FechasService} from '../../../services/fechas.service';

@Component({
    selector: 'app-estadisticasmed',
    templateUrl: './estadisticasmed.component.html',
    styleUrl: './estadisticasmed.component.scss'
})
export class EstadisticasmedComponent implements OnInit, AfterViewInit {

    @ViewChild('apprangofechasComponent') apprangofechasComponent: ApprangofechasComponent;
    filters: any = {desde: '', hasta: ''};
    estadisticas = [];
    detalles = [];
    isLoading = false;
    isShowDetalles = false;
    rows = 20;

    constructor(private citasMedicasServ: CitasMedicasService,
                private fechasService: FechasService) {
    }

    ngOnInit(): void {
        console.log('on init');
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.apprangofechasComponent.doFilterFec(2,
                {
                    preventDefault() {
                        console.log('preventdefault');
                    }
                });
        });
    }

    loadData() {
        console.log('filtros:', this.filters);
        console.log('Loading data-->');
        this.isLoading = true;
        const fechas = this.fechasService.getDateFilters(this.filters)
        const desde = fechas.desde;
        const hasta = fechas.hasta;
        this.citasMedicasServ.getEstadisticas(desde, hasta).subscribe(res => {
            console.log('Respuiesta es:', res);
            this.isLoading = false;
            if (res.status === 200) {
                this.estadisticas = res.resultados;
            }
        });
    }

    loadDetallesAndShowModal(row: any, tipo: number) {
        console.log('row:', row);
        let consultas = row.cons_conjuntas;
        if (tipo === 2) {
            consultas = row.cons_unitarias;
        }
        this.isLoading = true;
        this.citasMedicasServ.getDetallesEstadisticas(consultas).subscribe(res => {
            console.log('Valor de respuesta es:', res);
            this.isLoading = false;
            if (res.status === 200) {
                this.detalles = res.detalles;
                this.isShowDetalles = true;
            }
        });
    }

    onHideDetalles() {
        this.detalles = [];
    }

    cerrarDetalles() {
        this.isShowDetalles = false;
    }

    protected readonly Math = Math;
}
