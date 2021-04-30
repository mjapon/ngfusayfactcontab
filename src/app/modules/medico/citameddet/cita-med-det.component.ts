import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {Subscription} from 'rxjs';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {SwalService} from '../../../services/swal.service';

@Component({
    selector: 'app-citameddet',
    templateUrl: './cita-med-det.component.html',
    styleUrls: ['./cita-med-det.component.css']
})
export class CitaMedDetComponent implements OnInit, OnDestroy {

    @Input() rowHistoriaSel: any;
    @Input() showFichaCli: boolean;
    @Output() closed = new EventEmitter<any>();

    subsCitasPlaned: Subscription;
    historiaSel: any;
    showAnim: any;

    constructor(private citasMedicasServ: CitasMedicasService,
                private loadingUiService: LoadingUiService,
                private swalService: SwalService,
                private cosmedicamsgService: ConsMedicaMsgService) {

    }

    ngOnInit(): void {
        setTimeout(() => {
            this.showAnim = true;
        }, 100);
        this.historiaSel = {datosconsulta: {}, antecedentes: [], revxsistemas: [], examsfisicos: [], paciente: {}};
        this.loadDatosCita();
    }

    ngOnDestroy() {
        if (this.subsCitasPlaned) {
            this.subsCitasPlaned.unsubscribe();
        }
    }

    loadDatosCita() {
        this.citasMedicasServ.getDatosHistoriaByCod(this.rowHistoriaSel.cosm_id).subscribe(res => {
            if (res.status === 200) {
                this.historiaSel = res.datoshistoria;
                setTimeout(() => {
                    this.showAnim = false;
                }, 100);
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

    anular() {
        const motivo = prompt('Ingrese el motivo de la anulación', '');
        if (motivo) {
            this.citasMedicasServ.anular(this.rowHistoriaSel.cosm_id, motivo).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.cerrarHistoriaAnt();
                    this.cosmedicamsgService.publishReloadHistorias();
                }
            });
        }
    }

    auximprime(tipo: number, event: Event) {
        event.preventDefault();
        if (tipo === 1) {
            this.imprimirHistoria();
        } else if (tipo === 2) {
            this.imprimirRecetaAnterior();
        }
    }

    auxEditaAnula(tipo: number, event: Event) {
        event.preventDefault();
        if (tipo === 1) {
            this.editar();
        } else if (tipo === 2) {
            this.anular();
        }
    }

    editar() {
        const datoshistoria = {
            cosm_id: this.rowHistoriaSel.cosm_id,
            per_ciruc: this.rowHistoriaSel.per_ciruc,
            per_id: this.historiaSel.paciente.per_id
        };
        this.cerrarHistoriaAnt();
        this.cosmedicamsgService.publishMessage({tipo: 2, msg: datoshistoria});
    }

    verFichaClinica() {
        const datoshistoria = {
            per_ciruc: this.rowHistoriaSel.per_ciruc,
            per_id: this.historiaSel.paciente.per_id
        };
        this.cerrarHistoriaAnt();
        this.cosmedicamsgService.publishMessage({tipo: 1, msg: datoshistoria});
    }

    hasAntecedentes() {
        return this.historiaSel.antecedentes.filter(it => it.valorreg).length > 0;
    }

    hasExamsFisico() {
        const val = this.historiaSel.examsfisicos.filter(it => it.valorreg).length > 0;
        return val || this.historiaSel.datosconsulta.cosm_hallazgoexamfis;
    }

    hasRevXSistemas() {
        return this.historiaSel.revxsistemas.filter(it => it.valorreg).length > 0;
    }

}
