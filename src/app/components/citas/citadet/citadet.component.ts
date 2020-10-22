import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-citadet',
    templateUrl: './citadet.component.html',
    styleUrls: ['./citadet.component.css']
})
export class CitadetComponent implements OnInit, OnDestroy {

    @Input() rowHistoriaSel: any;
    @Input() isCollapse: boolean;
    @Output() closed = new EventEmitter<any>();

    subsCitasPlaned: Subscription;
    historiaSel: any;

    constructor(private citasMedicasServ: CitasMedicasService,
                private loadingUiService: LoadingUiService) {

    }

    ngOnInit(): void {
        this.historiaSel = {datosconsulta: {}, antecedentes: [], revxsistemas: [], examsfisicos: [], paciente: {}};
        this.loadDatosCita();
    }

    ngOnDestroy() {
        if (this.subsCitasPlaned) {
            this.subsCitasPlaned.unsubscribe();
        }
    }

    loadDatosCita() {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasServ.getDatosHistoriaByCod(this.rowHistoriaSel.cosm_id).subscribe(res => {
            if (res.status === 200) {
                this.historiaSel = res.datoshistoria;
            }
        });
    }

    imprimirRecetaAnterior() {
        this.citasMedicasServ.imprimir(this.rowHistoriaSel.cosm_id);
    }

    imprimirHistoria() {
        this.citasMedicasServ.imprimirHistoria(this.rowHistoriaSel.cosm_id);
    }

    cerrarHistoriaAnt() {
        this.closed.emit('');
    }
}
