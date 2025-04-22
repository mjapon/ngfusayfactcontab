import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {forkJoin, Subscription} from 'rxjs';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {SwalService} from '../../../services/swal.service';
import {CtesService} from '../../../services/ctes.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {PersonaService} from '../../../services/persona.service';

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
    selectedMeds: any[];
    form: any;
    editing = false;
    datosAlertaPresion: any;
    datosAlertaImc: any;
    medicos: Array<any>;

    constructor(private citasMedicasServ: CitasMedicasService,
                private loadingUiService: LoadingUiService,
                private arrayUtil: ArrayutilService,
                private ctes: CtesService,
                private swalService: SwalService,
                private personaService: PersonaService,
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
        this.medicos = [];
        this.loadingUiService.publishBlockMessage();
        forkJoin({
            data1: this.citasMedicasServ.getCie10Data(),
            data2: this.personaService.listarMedicos(1),
            data3: this.citasMedicasServ.getForm()
        }).subscribe({
            next: (result) => {
                if (result.data1.status === 200) {
                    this.ciedataArray = result.data1.cie10data;
                }
                if (result.data2.status === 200) {
                    this.medicos = result.data2.medicos;
                }
                if (result.data3) {
                    this.processFormConsulta(result.data3);
                }
                this.loadingUiService.publishUnblockMessage();
                this.editing = true;
            }
        });
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
                formToPost.datosconsulta.medicos = this.selectedMeds;

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

    initForm() {
        this.selectedDiags = [null];
        this.selectedMeds = [null];
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

    processFormConsulta(res) {
        if (res.status === 200) {
            this.form = res.form;
            this.form.paciente.per_id = this.historiaSel.paciente.per_id;
            this.citasMedicasServ.getDatosHistoriaByCod(this.rowHistoriaSel.cosm_id).subscribe(resHis => {
                if (resHis.status === 200) {
                    this.form.examsfisicos = resHis.datoshistoria.examsfisicos;
                    this.form.revxsistemas = resHis.datoshistoria.revxsistemas;
                    this.form.datosconsulta = resHis.datoshistoria.datosconsulta;
                    const cosm_diagnosticos = resHis.datoshistoria.datosconsulta.cosm_diagnosticos;
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

                    const meds = resHis.datoshistoria.medicos || [];
                    this.selectedMeds = [];
                    meds.forEach(medit => this.selectedMeds.push(medit.med_id));
                    this.selectedDiags.push(null);
                    this.selectedMeds.push(null);
                }
            });
        }
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

    addMedico() {
        if (this.selectedMeds[this.selectedMeds.length - 1] != null) {
            this.selectedMeds.push(null);
        } else {
            this.swalService.fireToastWarn('Debe especificar el médico para agregar otros');
        }
    }

    removeDiagnostico(diag: any) {
        this.arrayUtil.removeElement(this.selectedDiags, diag);
    }

    removeMedico(med: any) {
        this.arrayUtil.removeElement(this.selectedMeds, med);
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

    onMedicoChange() {
        if (this.selectedMeds.length > 1) {
            const lastMed = this.selectedMeds[this.selectedMeds.length - 1];
            const alreadySelected = this.selectedMeds.slice(0, this.selectedMeds.length - 1).includes(lastMed);
            if (alreadySelected) {
                const medico = this.arrayUtil.getFirstResult(this.medicos, it => it.med_id === lastMed);
                this.swalService.fireInfo('El médico(a) ' + (medico ? medico.nomapel : '') + ' ya fue seleccionado(a), escoja otro(a)');
                this.arrayUtil.removeElement(this.selectedMeds, lastMed);
                setTimeout(() => {
                    this.selectedMeds.push(null);
                }, 500);
            }
        }
    }

    onDiagnosticoChange() {
        if (this.selectedDiags.length > 1) {
            const lastDiag = this.selectedDiags[this.selectedDiags.length - 1];
            const alreadySelected = this.selectedDiags.slice(0, this.selectedDiags.length - 1).includes(lastDiag);
            if (alreadySelected) {
                const diag = this.arrayUtil.getFirstResult(this.ciedataArray, it => it.cie_key === lastDiag.cie_key);
                this.swalService.fireInfo('El diagnóstico ' + (diag ? diag.cie_key : '') + ' ya fue seleccionado, escoja otro');
                this.arrayUtil.removeElement(this.selectedDiags, lastDiag);
                setTimeout(() => {
                    this.selectedDiags.push(null);
                }, 500);
            }
        }
    }
}
