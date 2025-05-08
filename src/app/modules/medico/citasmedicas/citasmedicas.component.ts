import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {FechasService} from '../../../services/fechas.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {DomService} from '../../../services/dom.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {TcitaService} from '../../../services/tcita.service';
import {CtesService} from '../../../services/ctes.service';


@Component({
    selector: 'app-citasmedicas',
    templateUrl: './citasmedicas.component.html',
    styleUrls: ['./citasmedicas.component.scss']
})
export class CitasmedicasComponent implements OnInit, OnDestroy {

    form: any;
    ciedataArray: Array<any>;
    showBuscaPaciente = true;
    selectedSupTab: number;
    historias: Array<any>;
    isHistoriaAntSel: boolean;
    rowHistoriaSel: any;
    selectedTab: number;
    selectedMainTab = 1;
    saved: boolean;
    codConsultaGen: any;
    datosPacienteFull: any = {};
    showAnim: boolean;
    datosAlertaImc: any;
    datosAlertaPresion: any;
    selectedDiags: any[];
    selectedMeds: any[];
    tipoHistoria: number;
    editando: boolean;
    codHistoriaEdit: number;
    pacienteSelected: any;
    isShowCalendar = false;
    antecedentes = [];
    hasAntencentes = false;
    editAntper = false;
    medicos: Array<any>;

    @ViewChild('mainDiv') mainDiv: any;
    @ViewChild('diagnosticoDiv') diagnosticoDiv: any;
    @ViewChild('proxcitaDiv') proxcitaDiv: any;

    subsCitasPlaned: Subscription;
    showCalendar: boolean;
    lastCita: any;


    constructor(private citasMedicasServ: CitasMedicasService,
                private lclStrgServ: LocalStorageService,
                private personaService: PersonaService,
                private swalService: SwalService,
                private fechasService: FechasService,
                private arrayUtil: ArrayutilService,
                private domService: DomService,
                private loadingUiService: LoadingUiService,
                private route: ActivatedRoute,
                private ctes: CtesService,
                private cosMsgService: ConsMedicaMsgService,
                private tcitaServ: TcitaService
    ) {
        this.route.paramMap.subscribe(params => {
            this.tipoHistoria = parseInt(params.get('tipo'), 10);
        });
        this.selectedSupTab = 1;
    }

    auxLoadCiedata() {
        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            if (rescie.status === 200) {
                this.ciedataArray = rescie.cie10data;
            }
        });
    }

    ngOnInit() {
        this.clearAll();
        this.initForm();
        this.auxLoadCiedata();
        this.domService.setFocusTm(this.ctes.buscaPacNomCiInput, 700);

        this.subsCitasPlaned = this.cosMsgService.message.subscribe(msg => {
            if (msg) {
                if (msg.tipo === 1) {// Cargar ficha clicina
                    this.selPacFromLista(msg.msg);
                } else if (msg.tipo === 2) { // Cargar historia anterior para edicion
                    this.selectHistoriaForEdit(msg.msg);
                } else if (msg.tipo === 3) { // Recargar listado de atenciones
                    this.loadListaAtenciones();
                }
            }
        });
        this.loadMedicos();
    }

    clearAll() {
        this.showBuscaPaciente = true;
        this.selectedTab = 1;
        this.datosAlertaImc = {};
        this.datosAlertaPresion = {};
        this.isHistoriaAntSel = false;
        this.rowHistoriaSel = {};
        this.datosPacienteFull = {per_id: 0, per_edad: {}};
        this.pacienteSelected = {per_id: 0, per_ciruc: ''};
        this.historias = [];
        this.saved = false;
        this.codConsultaGen = null;
        this.showAnim = false;
        this.selectedDiags = [null];
        this.selectedMeds = [null];
        this.editando = false;
        this.lastCita = {};
    }

    initForm() {
        this.selectedDiags = [null];
        this.selectedMeds = [null];
        this.form = {
            paciente: {
                per_id: 0,
                per_ciruc: ''
            },
            datosconsulta: {
                cosm_id: 0,
                pac_id: 0,
                med_id: 0,
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

    reloadFormConsulta() {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasServ.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.pacienteSelected = {
                    per_id: this.datosPacienteFull.per_id,
                    per_ciruc: this.datosPacienteFull.per_ciruc
                };
                this.form.paciente.per_id = this.pacienteSelected.per_id;
                this.loadListaAtenciones();
                this.domService.setFocusTm(this.ctes.motivoConsultaTextArea, 300);
            }
        });
    }

    loadAntecedentes() {
        this.antecedentes = [];
        this.citasMedicasServ.getAntecedentes(this.pacienteSelected.per_id).subscribe(res => {
            if (res.antecedentes) {
                this.antecedentes = res.antecedentes;
                this.hasAntencentes = res.hasvalue;
                console.log('Has antecedentes', this.hasAntencentes);
            }
        });
    }

    activateEditAntecedentes() {
        this.editAntper = true;
    }

    guardarAntecedentes() {
        this.citasMedicasServ.saveAntecedentes(this.pacienteSelected.per_id, this.antecedentes).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.editAntper = false;
                this.loadAntecedentes();
            }
        });
    }

    loadFormConsulta() {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasServ.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                if (this.pacienteSelected.per_id > 0) {
                    this.form.paciente.per_id = this.pacienteSelected.per_id;
                    this.loadListaAtenciones();
                    this.domService.setFocusTm(this.ctes.motivoConsultaTextArea, 300);
                } else {
                    this.form.paciente.per_id = 0;
                    this.selectedTab = 0;
                }

                this.showBuscaPaciente = false;

                if (this.editando) {
                    this.selectedTab = 1;
                    this.citasMedicasServ.getDatosHistoriaByCod(this.codHistoriaEdit).subscribe(resHis => {
                        if (resHis.status === 200) {
                            this.form.examsfisicos = resHis.datoshistoria.examsfisicos;
                            this.form.revxsistemas = resHis.datoshistoria.revxsistemas;
                            this.form.datosconsulta = resHis.datoshistoria.datosconsulta;
                            const cosm_diagnosticos = resHis.datoshistoria.datosconsulta.cosm_diagnosticos;
                            this.selectedDiags = [];
                            this.selectedMeds = [];
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
        /*let valorPeso: any = '0';
        let valorTalla: any = '0';
        let filaIMC: any;
        this.form.examsfisicos.forEach(e => {
            const nombredato = e.cmtv_nombre;
            if (nombredato === 'EXFIS_PESO') {
                valorPeso = e.valorreg;
            } else if (nombredato === 'EXFIS_TALLA') {
                valorTalla = e.valorreg;
            } else if (nombredato === 'EXFIS_IMC') {
                filaIMC = e;
            }
        });
        const valorPesoNumber = Number(valorPeso);
        const valorTallaNumber = Number(valorTalla);
        let imc = Number('0');
        if (valorTallaNumber !== 0) {
            imc = valorPesoNumber / (valorTallaNumber * valorTallaNumber);
        }
        const imcRounded = imc.toFixed(2);
        if (filaIMC) {
            filaIMC.valorreg = imcRounded;
            this.citasMedicasServ.getDescValExamFisico(3, imcRounded).subscribe(resimc => {
                if (resimc.status === 200) {
                    const result = resimc.result;
                    const color = resimc.color;
                    this.datosAlertaImc = {msg: result, color};
                }
            });
        }

        if (it.cmtv_nombre === 'EXFIS_IMC') {
            this.citasMedicasServ.getDescValExamFisico(3, imcRounded).subscribe(resa => {
                if (resa.status === 200) {
                    const result = resa.result;
                    const color = resa.color;
                    this.datosAlertaImc = {msg: result, color};
                }
            });
        } else if (it.cmtv_nombre === 'EXFIS_TA') {
            this.citasMedicasServ.getDescValExamFisico(1, it.valorreg).subscribe(resb => {
                if (resb.status === 200) {
                    const result = resb.result;
                    const color = resb.color;
                    this.datosAlertaPresion = {msg: result, color};
                }
            });
        }*/
    }

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

    selectHistoriaForEdit(datosHistoria: any) {
        this.codHistoriaEdit = datosHistoria.cosm_id;
        this.editando = true;
        this.selPacFromLista(datosHistoria);
    }

    loadListaAtenciones() {
        this.historias = [];
        this.citasMedicasServ.getListaAtenciones(this.pacienteSelected.per_ciruc).subscribe(resCitas => {
            if (resCitas.status === 200) {
                this.historias = resCitas.items;
            }
        });
    }

    guardarDiagnostico() {
        // Validamos que se ingres el galeno
        if (!this.selectedMeds || this.selectedMeds.length === 0) {
            this.swalService.fireError('Debe ingresar el profesional a cargo');
            return;
        } else if (!this.form.datosconsulta.cosm_motivo) {
            this.swalService.fireError('Debe ingresar el motivo de la consulta');
            return;
        }
        this.registrarCita();
    }

    siguiente() {
        this.selectedTab++;
        this.setFocusOnTAb();
    }

    auxSetFocus(inputFocusId) {
        this.domService.setFocusTm(inputFocusId, 100);
    }

    setFocusOnTAb() {
        if (this.selectedTab === 1) {
            this.auxSetFocus('motivoConsultaTextArea');
        } else if (this.selectedTab === 2) {
            this.auxSetFocus('inexamfis_0');
        } else if (this.selectedTab === 3) {
            this.auxSetFocus('inrevxsis_0');
        } else if (this.selectedTab === 4) {
            this.auxSetFocus('diagnostico_id');
        }
    }

    registrarCita() {
        const msg = '¿Confirma que desea registrar nueva atención?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                let fechaProxCita = '';
                if (this.form.datosconsulta.cosm_fechaproxcita) {
                    if (this.form.datosconsulta.cosm_fechaproxcita instanceof Date) {
                        fechaProxCita = this.fechasService.formatDate(this.form.datosconsulta.cosm_fechaproxcita);
                    } else {
                        fechaProxCita = this.form.datosconsulta.cosm_fechaproxcita;
                    }
                }
                const formToPost: any = {};
                for (const prop of Object.keys(this.form)) {
                    formToPost[prop] = this.form[prop];
                }

                formToPost.datosconsulta.cosm_fechaproxcita = fechaProxCita;
                formToPost.datosconsulta.cosm_tipo = this.tipoHistoria;
                formToPost.datosconsulta.diagnosticos = this.selectedDiags;
                formToPost.datosconsulta.medicos = this.selectedMeds;

                this.loadingUiService.publishBlockMessage();
                if (this.editando) {
                    this.citasMedicasServ.editarCita(formToPost).subscribe(res => {
                        if (res.status === 200) {
                            this.codConsultaGen = res.ccm;
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadListaAtenciones();
                            this.saved = true;
                        }
                    });
                } else {
                    this.citasMedicasServ.crearCita(formToPost).subscribe(res => {
                        if (res.status === 200) {
                            this.codConsultaGen = res.ccm;
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadListaAtenciones();
                            this.saved = true;
                        }
                    });
                }
            }
        });
    }

    limpiar() {
        this.clearAll();
        this.selectedMainTab = 1;
        this.selectedTab = 1;
        this.showBuscaPaciente = true;
        this.domService.setFocusTm(this.ctes.buscaPacNomCiInput, 800);
    }

    selectHistoriaAnt(row: any) {
        this.rowHistoriaSel = row;
        this.isHistoriaAntSel = true;
    }

    onCerrarDetHistoria(msg: any) {
        this.cerrarHistoriaAnt();
    }

    cerrarHistoriaAnt() {
        this.isHistoriaAntSel = false;
        setTimeout(() => {
            this.mainDiv.nativeElement.scrollIntoView({behavior: 'smooth'});
        }, 400);
    }

    imprimirReceta() {
        this.citasMedicasServ.imprimir(this.codConsultaGen);
    }

    ngOnDestroy() {
        if (this.subsCitasPlaned) {
            this.subsCitasPlaned.unsubscribe();
        }
    }

    showExamFisico(itExamFis): boolean {
        const nombreExamen = itExamFis.cmtv_nombre;
        const perGenero = this.datosPacienteFull.per_genero;
        const setAntMujer = new Set();
        setAntMujer.add('ANT_A');
        setAntMujer.add('ANT_C');
        setAntMujer.add('ANT_FUM');
        setAntMujer.add('ANT_G');
        setAntMujer.add('ANT_HM');
        setAntMujer.add('ANT_HV');
        setAntMujer.add('ANT_P');
        setAntMujer.add('ANT_GINECOOBS');
        if (parseInt(perGenero, 10) === 1) {
            return !setAntMujer.has(nombreExamen);
        } else {
            return true;
        }
    }

    selectSupTab(tab: number, event: Event) {
        this.selectedSupTab = tab;
        event.preventDefault();
        if (tab === 1) {
            this.domService.setFocusTm(this.ctes.buscaPacNomCiInput, 500);
        }
    }

    onCreaPaciente($event: any) {
        this.showBuscaPaciente = false;
        this.datosPacienteFull = {per_edad: {}};
        this.pacienteSelected = {per_ciruc: '', per_id: 0};
        this.loadFormConsulta();
    }

    selPacFromLista(row: any) {
        this.pacienteSelected.per_id = row.per_id;
        this.pacienteSelected.per_ciruc = row.per_ciruc;
        this.selectedMainTab = 1;
        this.selectedTab = 1;
        this.saved = false;
        this.loadFormConsulta();
    }

    onPacienteLoaded($event: any) {
        if (this.editando) {
            this.datosPacienteFull = $event;
        }

        if (this.datosPacienteFull.per_ciruc !== $event.per_ciruc && !this.editando) {
            this.datosPacienteFull = $event;
            this.reloadFormConsulta();
        }
        this.selectedTab = 1;
    }

    reloadDatosPaciente(perId) {
        this.personaService.buscarPorCodfull(perId).subscribe(res => {
            if (res.status === 200) {
                this.datosPacienteFull = res.persona;
            }
        });
    }

    onPacienteSaved($event: any) {
        this.datosPacienteFull.per_id = $event;
        this.selectedTab = 1;
        this.selectedMainTab = 2;
        this.form.paciente.per_id = $event;
        this.domService.setFocusTm(this.ctes.motivoConsultaTextArea, 600);
        this.reloadDatosPaciente(this.datosPacienteFull.per_id);
    }

    onDatosIncompletos($event: any) {
        this.selectedMainTab = 1;
        this.selectedTab = 1;
    }

    showModalCalendar() {
        this.lclStrgServ.setItem('PAC_FOR_CAL', JSON.stringify(this.datosPacienteFull));
        this.showCalendar = true; // modificado
    }

    closeModalCalendar() {
        this.showCalendar = false; // modificado
        this.scrollToDivDiagnos();
    }

    onCitaCreated($event: any) {
        this.showCalendar = false;
        this.loadLastCita();
        this.scrollToDivDiagnos();
    }

    loadLastCita() {
        this.lastCita = {};
        const cd = this.fechasService.getCurrentDateStr();
        this.form.datosconsulta.cosm_fechaproxcita = '';
        this.tcitaServ.getNextCita(this.datosPacienteFull.per_id, 1, cd).subscribe(res => {
            if (res.status === 200) {
                this.lastCita = res.cita;
                this.lastCita.texto = this.tcitaServ.getFechaHoraStr(this.lastCita);
                this.form.datosconsulta.cosm_fechaproxcita = this.lastCita.ct_fecha;
            }
        });
    }

    scrollToDivDiagnos() {
        setTimeout(() => {
            this.proxcitaDiv.nativeElement.scrollIntoView({behavior: 'smooth'});
        }, 400);
    }

    anularCita() {
        const msg = '¿Seguro que desea anular esta cita?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.tcitaServ.anular(this.lastCita.ct_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadLastCita();
                        }
                    });
                }
            }
        );
    }

    onRegistrarAtencionEv($event: any) {
        if ($event.pac_id) {
            const datoshistoria = {
                per_ciruc: $event.ciruc_pac,
                per_id: $event.pac_id
            };
            this.cerrarHistoriaAnt();
            this.cosMsgService.publishMessage({tipo: this.tipoHistoria, msg: datoshistoria});
        } else {
            this.swalService.fireWarning('Esta cita no tiene registrado un paciente, no se puede ver la ficha clinica');
        }
    }

    doGotoCalendar($event: any) {
        this.isShowCalendar = true;
    }

    showListado($event: any) {
        this.isShowCalendar = false;
    }

    changeMainTab(tab: number) {
        this.selectedMainTab = tab;
        if (this.selectedMainTab === 5) {
            this.loadLastCita();
            this.domService.setFocusTm('motivoConsultaTextArea', 500);
        } else if (this.selectedMainTab === 4) {
            this.loadListaAtenciones();
        } else if (this.selectedMainTab === 2) {
            this.loadAntecedentes();
        }
    }

    changeTab(tab: number) {
        this.selectedTab = tab;
        this.setFocusOnTAb();
    }

    clearInfoPacLocStorage() {
        this.lclStrgServ.removeItem('PAC_FOR_CAL');
        console.log('Limpiado paciente local storage');
    }

    onMedicoChange($event: any) {
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

    loadMedicos() {
        this.medicos = [];
        this.personaService.listarMedicos(1).subscribe(res => {
            if (res.status === 200) {
                this.medicos = res.medicos;
            }
        });
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

    loadEstadisticas() {
        console.log('Loas estadisticas-->');
        const desde = '01/01/2025';
        const hasta = this.fechasService.formatDate(new Date());
        this.citasMedicasServ.getEstadisticas(desde, hasta).subscribe(res => {
            console.log('Respuiesta es:', res);
        });
    }
}
