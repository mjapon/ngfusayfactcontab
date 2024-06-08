import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {Subscription} from 'rxjs';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {SwalService} from '../../../services/swal.service';
import {CtesService} from '../../../services/ctes.service';
import {ArrayutilService} from '../../../services/arrayutil.service';

@Component({
    selector: 'app-citameddet',
    templateUrl: './cita-med-det.component.html',
    styleUrls: ['./cita-med-det.component.scss']
})
export class CitaMedDetComponent implements OnInit, OnDestroy {

    @Input() rowHistoriaSel: any;
    @Input() showFichaCli: boolean;
    @Output() closed = new EventEmitter<any>();

    subsCitasPlaned: Subscription;
    historiaSel: any;
    showAnim: any;

    // Para edicion de historia
    ciedataArray: Array<any>;
    selectedDiags: any[];
    form: any;
    editing = false;
    datosAlertaPresion: any;
    datosAlertaImc: any;

    constructor(private citasMedicasServ: CitasMedicasService,
                private loadingUiService: LoadingUiService,
                private arrayUtil: ArrayutilService,
                private ctes: CtesService,
                private swalService: SwalService,
                private cosmedicamsgService: ConsMedicaMsgService) {

    }

    ngOnInit(): void {
        setTimeout(() => {
            this.showAnim = true;
        }, 100);
        this.historiaSel = {datosconsulta: {}, revxsistemas: [], examsfisicos: [], paciente: {}};
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
                console.log('historia:', this.historiaSel);
                setTimeout(() => {
                    this.showAnim = false;
                }, 100);
            }
        });
    }

    loadDataForEdit() {
        this.datosAlertaPresion = {};
        this.datosAlertaImc = {};
        this.initForm();
        this.auxLoadCiedata();
        this.editing = true;
    }

    calcularIMC(it: any) {
        const resultIMC: any = {};
        this.citasMedicasServ.calcularIMC(it, this.form.examsfisicos, resultIMC, () => {
            if (resultIMC.imc) {
                this.datosAlertaImc = resultIMC.imc;
            }
            if (resultIMC.presion) {
                this.datosAlertaPresion = resultIMC.presion;
            }
        });
    }

    guardar() {
        const msg = '¿Confirma que desea actualizar los datos?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                const formToPost: any = {};
                for (const prop of Object.keys(this.form)) {
                    formToPost[prop] = this.form[prop];
                }
                formToPost.datosconsulta.diagnosticos = this.selectedDiags;

                this.loadingUiService.publishBlockMessage();
                console.log('form topost', formToPost);
                this.citasMedicasServ.editarCita(formToPost).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.editing = false;
                        this.rowHistoriaSel.cosm_id = res.ccm;
                        this.loadDatosCita();
                    }
                });
            }
        });
    }

    // Logica para editar
    auxLoadCiedata() {
        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            if (rescie.status === 200) {
                this.ciedataArray = rescie.cie10data;
                this.loadFormConsulta();
            }
        });
    }

    initForm() {
        this.selectedDiags = [null];
        this.form = {
            paciente: {
                per_id: this.historiaSel.paciente.per_id,
                per_ciruc: ''
            },
            datosconsulta: {
                cosm_id: this.historiaSel.datosconsulta.cosm_id,
                pac_id: this.historiaSel.paciente.per_id,
                med_id: this.historiaSel.datosconsulta.med_id,
                cosm_fechacita: '',
                cosm_fechacrea: '',
                cosm_motivo: '',
                cosm_enfermactual: '',
                cosm_hallazgoexamfis: '',
                cosm_exmscompl: '',
                cosm_tratamiento: '',
                cosm_receta: '',
                cosm_recomendaciones: '',
                user_crea: '',
                cosm_odontograma: ''
            },
            examsfisicos: [],
            revxsistemas: [],
            diagnostico: []
        };
    }

    loadFormConsulta() {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasServ.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.form.paciente.per_id = this.historiaSel.paciente.per_id;
                this.citasMedicasServ.getDatosHistoriaByCod(this.rowHistoriaSel.cosm_id).subscribe(resHis => {
                    if (resHis.status === 200) {
                        this.form.examsfisicos = resHis.datoshistoria.examsfisicos;
                        this.form.revxsistemas = resHis.datoshistoria.revxsistemas;
                        this.form.datosconsulta = resHis.datoshistoria.datosconsulta;
                        const cosm_diagnosticos = resHis.datoshistoria.datosconsulta.cosm_diagnosticos;
                        console.log('Diagnositocos:', this.form);
                        console.log(cosm_diagnosticos);
                        this.selectedDiags = [];
                        if (cosm_diagnosticos) {
                            const diagsNumberArray = cosm_diagnosticos.split(',');
                            for (const codDiag of diagsNumberArray) {
                                const ciedDiag = this.arrayUtil.getFirstResult(
                                    this.ciedataArray, el => {
                                        return parseInt(el.cie_id, 10) === parseInt(codDiag, 10);
                                    }
                                );
                                if (ciedDiag) {
                                    this.selectedDiags.push(ciedDiag);
                                }
                            }
                        }
                        this.selectedDiags.push(null);
                    }
                });
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

    /*auxEditaAnula(tipo: number, event: Event) {
        event.preventDefault();
        if (tipo === 1) {
            this.swalService.fireDialog(this.ctes.msgConfirmEditReg).then(confirm => {
                if (confirm.value) {
                    this.editar();
                }
            });

        } else if (tipo === 2) {
            this.anular();
        }
    }*/

    /*editar() {
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
    }*/

    addDiagnostico() {
        if (this.selectedDiags[this.selectedDiags.length - 1] != null) {
            this.selectedDiags.push(null);
        } else {
            this.swalService.fireToastWarn('Debe especificar el diagnóstico para agregar otros');
        }
    }

    removeDiagnostico(diag: any) {
        this.arrayUtil.removeElement(this.selectedDiags, diag);
    }

    hasExamsFisico() {
        const val = this.historiaSel.examsfisicos.filter(it => it.valorreg).length > 0;
        return val || this.historiaSel.datosconsulta.cosm_hallazgoexamfis;
    }

    hasRevXSistemas() {
        return this.historiaSel.revxsistemas.filter(it => it.valorreg).length > 0;
    }

    cancelar() {
        this.editing = false;
    }
}
