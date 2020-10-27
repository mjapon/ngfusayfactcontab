import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {Subscription} from 'rxjs';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {MenuItem} from "primeng";
import {SwalService} from "../../../services/swal.service";

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
    items: MenuItem[];

    constructor(private citasMedicasServ: CitasMedicasService,
                private loadingUiService: LoadingUiService,
                private swalService: SwalService,
                private cosmedicamsgService: ConsMedicaMsgService) {

    }

    ngOnInit(): void {
        this.historiaSel = {datosconsulta: {}, antecedentes: [], revxsistemas: [], examsfisicos: [], paciente: {}};
        this.loadDatosCita();

        this.items = [
            {
                label: 'Imprimir Historia', icon: 'pi pi-print', command: () => {
                    this.imprimirHistoria();
                }
            },
            {
                label: 'Imprimir Receta', icon: 'pi pi-print', command: () => {
                    this.imprimirRecetaAnterior();
                }
            },
            {
                label: 'Editar', icon: 'pi pi-pencil', command: () => {
                    this.editar();
                }
            },
            {
                label: 'Anular', icon: 'pi pi-trash', command: () => {
                    this.anular();
                }
            }
        ];
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
        const datoshistoria = {cosm_id: this.rowHistoriaSel.cosm_id, per_ciruc: this.rowHistoriaSel.per_ciruc};
        this.cerrarHistoriaAnt();
        this.cosmedicamsgService.publishMessage({tipo: 2, msg: datoshistoria});
    }
}
