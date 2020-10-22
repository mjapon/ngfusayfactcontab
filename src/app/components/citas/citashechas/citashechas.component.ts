import {Component, Input, OnInit} from '@angular/core';
import {FechasService} from '../../../services/fechas.service';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {DateFormatPipe} from '../../../pipes/date-format.pipe';

@Component({
    selector: 'app-citashechas',
    templateUrl: './citashechas.component.html',
    styleUrls: ['./citashechas.component.css']
})
export class CitashechasComponent implements OnInit {
    desde: Date;
    hasta: Date;
    es: any;
    filtro: string;
    atencionesArray: Array<any>;
    pagina: number;
    showAnim: boolean;
    showfiltro: boolean;
    hasMore: boolean;
    rowHistoriaSel: any;
    showModalDet: boolean;
    @Input() tipocita: number;

    constructor(private fechasService: FechasService,
                private citasMedicasServ: CitasMedicasService,
                private dateFormatPipe: DateFormatPipe) {
    }

    ngOnInit(): void {
        this.es = this.fechasService.getLocaleEsForPrimeCalendar();
        this.clearAll();
        this.buscar();
    }

    clearAll() {
        this.atencionesArray = new Array<any>();
        this.pagina = 0;
        this.filtro = '';
        this.showAnim = false;
        this.showfiltro = false;
        this.hasMore = false;
        this.desde = null;
        this.hasta = null;
        this.showModalDet = false;
    }

    toggleShowFiltro() {
        this.showfiltro = !this.showfiltro;
        if (!this.showfiltro) {
            this.desde = null;
            this.hasta = null;
            this.filtro = '';
            this.buscar();
        }
    }

    onFiltroTyped() {
        console.log('onfiltro typed');
    }

    loadMore() {
        let desdeStr = '';
        let hastaStr = '';
        if (this.desde) {
            desdeStr = this.dateFormatPipe.transform(this.desde);
        }
        if (this.hasta) {
            hastaStr = this.dateFormatPipe.transform(this.hasta);
        }

        this.showAnim = true;
        this.citasMedicasServ.listarPrevias(this.tipocita, this.filtro, desdeStr, hastaStr, this.pagina).subscribe(res => {
            this.showAnim = false;
            if (res.status === 200) {
                this.atencionesArray.push.apply(this.atencionesArray, res.items);
                this.hasMore = res.hasMore;
                if (res.hasMore) {
                    this.pagina = res.nextp;
                }
            }
        });
    }

    buscar() {
        this.atencionesArray = new Array<any>();
        this.pagina = 0;
        this.loadMore();
    }

    selectPaciente(item: any) {
        this.rowHistoriaSel = item;
        this.showModalDet = true;
    }

    onCerrarDetHistoria($event: any) {
        this.showModalDet = false;
    }
}
