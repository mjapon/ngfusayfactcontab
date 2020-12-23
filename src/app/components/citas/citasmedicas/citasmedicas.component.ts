import {Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {FechasService} from '../../../services/fechas.service';
import {CatalogosService} from '../../../services/catalogos.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {LugarService} from '../../../services/lugar.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {DomService} from '../../../services/dom.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {DOCUMENT} from '@angular/common';
import {CadenasutilService} from '../../../services/cadenasutil.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';

declare var $: any;

@Component({
    selector: 'app-citasmedicas',
    templateUrl: './citasmedicas.component.html',
    providers: [
        {provide: Window, useValue: window}
    ],
    styleUrls: ['./citasmedicas.component.css']
})
export class CitasmedicasComponent implements OnInit, OnDestroy {

    form: any;
    ciedataArray: Array<any>;
    antpers: Array<any>;
    currentDate = new Date();
    showBuscaPaciente = true;
    cirucPaciente: string;
    filtro: string;
    selectedSupTab: number;
    estadoCivilList: Array<any>;
    generosList: Array<any>;
    lugares: Array<any>;
    ocupaciones: Array<any>;
    historias: Array<any>;
    isHistoriaAntSel: boolean;
    historiaSel: any;
    rowHistoriaSel: any;
    tabsFisicos: any;
    selectedTab: number;
    accordionStatus: any;
    saved: boolean;
    codConsultaGen: any;
    pacienteSel: any;
    datosPacienteFull: any = {};
    pacientesArray: Array<any>;
    currentPagPacientes: number;
    hayMasFilasPac: boolean;
    showAnim: boolean;
    odontograma: any;
    datosAlertaImc: any;
    datosAlertaPresion: any;
    bottomAlcanzado: boolean;
    previustimer: any = 0;
    datosIncompletos: boolean;
    selectedDiags: any[];
    tipoHistoria: number;
    editando: boolean;
    codHistoriaEdit: number;

    tipoOdontogramaSel: number;

    @ViewChild('mainDiv') mainDiv: any;

    listener;
    subsCitasPlaned: Subscription;
    subsOdonto: Subscription;

    constructor(private citasMedicasServ: CitasMedicasService,
                private catalogosServ: CatalogosService,
                private personaService: PersonaService,
                private swalService: SwalService,
                private fechasService: FechasService,
                private arrayUtil: ArrayutilService,
                private domService: DomService,
                private lugarService: LugarService,
                private loadingUiService: LoadingUiService,
                private window: Window,
                @Inject(DOCUMENT) private document: Document,
                private renderer2: Renderer2,
                private route: ActivatedRoute,
                private cadutil: CadenasutilService,
                private cosMsgService: ConsMedicaMsgService
    ) {

        this.listener = this.renderer2.listen('window', 'scroll', (e) => {
            if (!this.bottomAlcanzado && this.showBuscaPaciente) {
                if ((window.innerHeight + window.pageYOffset + 100) >= (document.body.offsetHeight)) {
                    this.bottomAlcanzado = true;
                    this.loadMorePacientes();
                }
            }
        });

        this.route.paramMap.subscribe(params => {
            this.tipoHistoria = parseInt(params.get('tipo'), 10);
        });

        this.selectedSupTab = 1;
        this.tipoOdontogramaSel = 1;
    }

    auxLoadCatalogos(codcat: number, array: string) {
        this.catalogosServ.getCatalogos(codcat).subscribe(rescata => {
            if (rescata.status === 200) {
                this[array] = rescata.items;
            }
        });
    }

    auxLoadCiedata() {
        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            if (rescie.status === 200) {
                this.ciedataArray = rescie.cie10data;
            }
        });
    }

    auxLoadLugares() {
        this.lugarService.listarTodos().subscribe(resLugares => {
            if (resLugares.status === 200) {
                this.lugares = resLugares.items;
            }
        });
    }

    auxLoadTabs() {
        this.tabsFisicos = {
            a: {
                titulo: 'Datos Filiación',
                paso: 1,
                visible: true
            },
            b: {
                titulo: 'Motivo',
                paso: 2,
                visible: true
            },
            c: {
                titulo: 'Antecedentes',
                paso: 3,
                visible: true
            },
            d: {
                titulo: 'Rev x Sistemas',
                paso: 4,
                visible: true
            },
            e: {
                titulo: 'Exm Físico',
                paso: 5,
                visible: true
            },
            f: {
                titulo: 'Exm Complementario',
                paso: 6,
                visible: true
            },
            g: {
                titulo: 'Odontograma',
                paso: 7,
                visible: true
            },
            h: {
                titulo: 'Diagnóstico',
                paso: 8,
                visible: true
            }
        };

        if (this.tipoHistoria === 1) {
            const proppaso7 = 'g';
            const proppaso8 = 'h';
            this.tabsFisicos[proppaso7].visible = false;
            this.tabsFisicos[proppaso7].paso = 0;
            this.tabsFisicos[proppaso8].paso = 7;
        } else if (this.tipoHistoria === 2) {
            const paso4 = 'd';
            const paso5 = 'e';
            const paso6 = 'f';
            const paso7 = 'g';
            const paso8 = 'h';
            this.tabsFisicos[paso4].visible = false;
            this.tabsFisicos[paso4].paso = 0;
            this.tabsFisicos[paso5].paso = 4;
            this.tabsFisicos[paso6].visible = false;
            this.tabsFisicos[paso6].paso = 0;
            this.tabsFisicos[paso7].paso = 5;
            this.tabsFisicos[paso8].paso = 6;
        }
    }

    ngOnInit() {
        this.clearAll();
        this.initForm();
        this.auxLoadCiedata();
        this.auxLoadCatalogos(1, 'generosList');
        this.auxLoadCatalogos(2, 'estadoCivilList');
        this.auxLoadCatalogos(3, 'ocupaciones');
        this.auxLoadLugares();
        this.domService.setFocusTimeout('buscaPacNomCiInput', 700);
        this.auxLoadTabs();
        this.buscarPacientes();

        this.subsCitasPlaned = this.cosMsgService.message.subscribe(msg => {
            if (msg) {
                if (msg.tipo === 1) {// Mensaje de citas planificadas
                    this.selectPaciente(msg.msg);
                } else if (msg.tipo === 2) {
                    this.selectHistoriaForEdit(msg.msg);
                } else if (msg.tipo === 3) {
                    this.loadListaAtenciones();
                }
            }
        });
    }

    clearAll() {
        this.showBuscaPaciente = true;
        this.cirucPaciente = '';
        this.selectedTab = 1;
        this.datosAlertaImc = {};
        this.datosAlertaPresion = {};
        this.isHistoriaAntSel = false;
        this.historiaSel = {};
        this.rowHistoriaSel = {};
        this.saved = false;
        this.codConsultaGen = null;
        this.currentPagPacientes = 0;
        this.filtro = '';
        this.hayMasFilasPac = false;
        this.bottomAlcanzado = false;
        this.pacientesArray = [];
        this.showAnim = false;
        this.datosIncompletos = false;
        this.selectedDiags = [null];
        this.odontograma = '';
        this.accordionStatus = {
            citasPanel: false,
            datosPacPanel: false,
            motConsultaPanel: false,
            historiaSelPanel: false
        };
        this.editando = false;
    }

    initForm() {
        this.filtro = '';
        this.pacienteSel = null;
        this.pacientesArray = [];
        this.currentPagPacientes = 0;
        this.hayMasFilasPac = false;
        this.bottomAlcanzado = false;
        this.selectedDiags = [null];
        this.form = {
            paciente: {
                per_id: 0,
                per_ciruc: '',
                per_nombres: '',
                per_apellidos: '',
                per_direccion: '',
                per_telf: '',
                per_movil: '',
                per_email: '',
                per_fecreg: '',
                per_tipo: 1,
                per_lugnac: null,
                per_nota: '',
                per_fechanac: '',
                per_genero: null,
                per_estadocivil: null,
                per_lugresidencia: 0
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
            antecedentes: [],
            examsfisicos: [],
            revxsistemas: [],
            diagnostico: []
        };
    }

    initBuscaPaciente(focusInput: string) {
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasServ.getForm().subscribe(res => {
            if (res.status === 200) {
                const perCiruc = this.form.paciente.per_ciruc;
                this.form = res.form;
                this.form.paciente.per_ciruc = perCiruc;
                this.buscarPaciente(true, focusInput);
                this.showBuscaPaciente = false;
            }
        });
    }

    calcularIMC(it: any) {
        let valorPeso: any = '0';
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
        }
    }

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

    selectPaciente(row) {
        this.form.paciente.per_ciruc = row.per_ciruc;
        this.initBuscaPaciente('perNombresInput');
    }

    selectHistoriaForEdit(datosHistoria: any) {
        this.codHistoriaEdit = datosHistoria.cosm_id;
        this.editando = true;
        this.hideHistoriaSelPanel();
        this.selectPaciente({per_ciruc: datosHistoria.per_ciruc});
    }

    buscarPacientes() {
        this.showAnim = true;
        this.personaService.buscarPorNomapelCiPag(this.filtro, this.currentPagPacientes).subscribe(res => {
            if (res.status === 200) {
                this.pacientesArray.push.apply(this.pacientesArray, res.items);
                this.hayMasFilasPac = res.hasMore;
                if (res.hasMore) {
                    this.currentPagPacientes = res.nextp;
                    this.bottomAlcanzado = false;
                } else {
                    this.bottomAlcanzado = true;
                }
            }
            this.showAnim = false;
        });
    }

    loadListaAtenciones() {
        const per_ciruc = this.form.paciente.per_ciruc;
        this.citasMedicasServ.getListaAtenciones(per_ciruc).subscribe(resCitas => {
            if (resCitas.status === 200) {
                this.historias = resCitas.items;
            }
        });
    }

    crearPaciente() {
        this.showBuscaPaciente = false;
        if (this.cadutil.esSoloNumeros(this.filtro)) {
            this.form.paciente.per_ciruc = this.filtro;
        } else {
            this.form.paciente.per_ciruc = '';
        }
        this.initBuscaPaciente('perCirucInput');
    }

    logicaDatosIncompletos(showMessage) {
        this.datosIncompletos = true;
        this.selectedTab = 0;
        this.domService.setFocusTimeout('perNombresInput', 600);
        if (showMessage) {
            this.swalService.fireToastWarn('Datos incompletos del paciente, favor completar');
        }
    }

    reloadDatosPaciente() {
        const per_ciruc = this.form.paciente.per_ciruc;
        this.personaService.buscarPorCifull(per_ciruc).subscribe(res => {
            if (res.status === 200) {
                this.loadDataPerson(res.persona);
                this.datosPacienteFull = res.persona;
            }
        });
    }

    buscarPaciente(showMessage, focusInput) {
        const per_ciruc = this.form.paciente.per_ciruc;
        this.historias = [];
        this.datosIncompletos = false;
        this.loadingUiService.publishBlockMessage();
        this.personaService.buscarPorCifull(per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    if (showMessage) {
                        this.swalService.fireToastInfo('El paciente ya está registrado');
                    }
                    this.loadDataPerson(res.persona);
                    this.datosPacienteFull = res.persona;
                    this.citasMedicasServ.getListaAtenciones(per_ciruc).subscribe(resCitas => {
                        if (resCitas.status === 200) {
                            this.historias = resCitas.items;
                            this.antpers = resCitas.antpers;
                            if (this.antpers && this.antpers.length > 0) {
                                this.form.antecedentes = this.antpers;
                            }
                        }
                    });
                    if (this.editando) {
                        this.citasMedicasServ.getDatosHistoriaByCod(this.codHistoriaEdit).subscribe(resHis => {
                            if (resHis.status === 200) {
                                this.form.antecedentes = resHis.datoshistoria.antecedentes;
                                this.form.examsfisicos = resHis.datoshistoria.examsfisicos;
                                this.form.revxsistemas = resHis.datoshistoria.revxsistemas;
                                this.form.datosconsulta = resHis.datoshistoria.datosconsulta;
                                const cosm_diagnosticos = resHis.datoshistoria.datosconsulta.cosm_diagnosticos;
                                this.selectedDiags = [];
                                if (cosm_diagnosticos) {
                                    const diagsNumberArray = cosm_diagnosticos.split(',');
                                    for (const codDiag of diagsNumberArray) {
                                        const ciedDiag = this.arrayUtil.getFirstResult(
                                            this.ciedataArray,
                                            (el, idx, array) => {
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
                    } else {
                        this.domService.setFocusTimeout('motivoConsultaTextArea', 600);
                    }
                } else {
                    this.selectedTab = 0;
                    this.domService.setFocusTimeout(focusInput, 600);
                    if (showMessage) {
                        this.swalService.fireToastWarn('Nuevo paciente, debe ingresar los datos de filiación');
                    }
                    this.form.paciente.per_ciruc = per_ciruc;
                }
            }
        );
    }

    verificaPacienteRegistrado() {
        if (this.form.paciente.per_id === 0) {
            this.buscarPaciente(false, 'perNombresInput');
        }
    }

    guardarDiagnostico() {
        this.registrarCita();
    }

    auxGuardaTab(tabId, inputFocusId) {
        this.selectedTab = tabId;
        if (inputFocusId) {
            this.domService.setFocusTimeout(inputFocusId, 100);
        }

    }

    guardarExamCompl() {
        this.auxGuardaTab(6, 'diagnostico_id');
    }

    guardarOdontograma() {
        this.auxGuardaTab(5, 'diagnostico_id');
    }

    guardarExamenFisico() {
        if (this.tipoHistoria === 2) {
            this.auxGuardaTab(4, null);
        } else {
            this.auxGuardaTab(5, 'inexamcompl_0');
        }
    }

    guardarRevXSistemas() {
        this.auxGuardaTab(4, 'inexamfis_0');
    }

    guardaMotivoConsulta() {
        this.auxGuardaTab(2, 'inantecedentes_0');
    }

    guardarAntecedentes() {
        this.auxGuardaTab(3, 'inrevxsis_0');
    }

    guardaDatosPaciente() {
        const perId = this.form.paciente.per_id;
        const formPaciente = this.form.paciente;
        const estadoCivil = formPaciente.per_estadocivil;
        const residencia = formPaciente.per_lugresidencia;
        const genero = formPaciente.per_genero;

        if (!genero) {
            this.swalService.fireToastError('Debe seleccionar el genero del paciente');
            return;
        }

        if (!estadoCivil) {
            this.swalService.fireToastError('Debe seleccionar el estado civil del paciente');
            return;
        }

        const perEstadocivil = estadoCivil.lval_id;
        const perGenero = genero;
        const perLugresidencia = residencia ? residencia.lug_id : 0;

        const formToPost: any = {};
        for (const prop of Object.keys(formPaciente)) {
            formToPost[prop] = formPaciente[prop];
        }
        formToPost.per_estadocivil = perEstadocivil;
        formToPost.per_genero = perGenero;
        formToPost.per_lugresidencia = perLugresidencia;
        formToPost.per_fechanacp = this.fechasService.formatDate(formPaciente.per_fechanac);
        this.loadingUiService.publishBlockMessage();
        this.personaService.actualizar(perId, formToPost).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.selectedTab = 1;
                this.domService.setFocusTimeout('motivoConsultaTextArea', 600);
                if (res.per_id) {
                    this.form.paciente.per_id = res.per_id;
                    this.reloadDatosPaciente();
                }
            }
        });
    }

    registrarCita() {
        const msg = '¿Seguro?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                let fechaNac = '';
                if (this.form.paciente.per_fechanac) {
                    if (this.form.paciente.per_fechanac instanceof Date) {
                        fechaNac = this.fechasService.formatDate(this.form.paciente.per_fechanac);
                    } else {
                        fechaNac = this.form.paciente.per_fechanac;
                    }
                }

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
                formToPost.paciente.per_fechanac = fechaNac;
                formToPost.datosconsulta.cosm_fechaproxcita = fechaProxCita;
                formToPost.datosconsulta.cosm_tipo = this.tipoHistoria;
                formToPost.datosconsulta.diagnosticos = this.selectedDiags;
                this.loadingUiService.publishBlockMessage();
                if (this.tipoHistoria === 2) {
                    formToPost.datosconsulta.cosm_odontograma = this.odontograma;
                }
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

    hideHistoriaSelPanel() {
        $('#historiaSelPanel').collapse('hide');
        this.accordionStatus.historiaSelPanel = false;
    }

    toggleAcordion(inputid) {
        $('#' + inputid).collapse('toggle');
        this.accordionStatus[inputid] = !this.accordionStatus[inputid];
    }

    limpiar() {
        this.clearAll();
        this.buscarPacientes();
        this.showBuscaPaciente = true;
        this.domService.setFocusTimeout('buscaPacNomCiInput', 800);
    }

    loadMorePacientes() {
        if (this.hayMasFilasPac) {
            this.buscarPacientes();
        }
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

    sumarDias(ndias) {
        const fechaActual = new Date();
        this.form.datosconsulta.cosm_fechaproxcita = this.fechasService.sumarDias(fechaActual, ndias);
    }

    calcularEdad() {
        let edad = 0;
        if (this.form.paciente.per_fechanac) {
            edad = this.fechasService.getEdad(this.form.paciente.per_fechanac);
        }
        this.form.paciente.per_edad = edad;
    }

    delayKeyup(callback, ms, prevtimer, context) {
        clearTimeout(prevtimer);
        return setTimeout(() => {
            callback(context);
        }, ms);
    }

    filtroDelayFn(context) {
        context.currentPagPacientes = 0;
        context.pacientesArray = [];
        context.bottomAlcanzado = false;
        context.buscarPacientes();
    }

    onFiltroTyped() {
        this.previustimer = this.delayKeyup(this.filtroDelayFn, 600, this.previustimer, this);
    }

    ngOnDestroy() {
        this.listener();
        if (this.subsCitasPlaned) {
            this.subsCitasPlaned.unsubscribe();
        }
        if (this.subsOdonto) {
            this.subsOdonto.unsubscribe();
        }
    }

    showExamFisico(itExamFis): boolean {
        const nombreExamen = itExamFis.cmtv_nombre;
        const perGenero = this.form.paciente.per_genero;
        const setAntMujer = new Set();
        setAntMujer.add('ANT_A');
        setAntMujer.add('ANT_C');
        setAntMujer.add('ANT_FUM');
        setAntMujer.add('ANT_G');
        setAntMujer.add('ANT_HM');
        setAntMujer.add('ANT_HV');
        setAntMujer.add('ANT_P');
        setAntMujer.add('ANT_GINECOOBS');
        if (perGenero === '1') {
            return !setAntMujer.has(nombreExamen);
        } else {
            return true;
        }
    }

    getMessage(message: string) {
        this.odontograma = message;
    }

    loadDataPerson(persona: any) {
        const personaProps = ['per_id', 'per_nombres', 'per_apellidos', 'per_direccion', 'per_telf',
            'per_movil', 'per_email', 'per_tipo', 'per_lugnac', 'per_nota', 'per_edad'];

        personaProps.forEach(prop => {
            this.form.paciente[prop] = persona[prop];
        });
        this.form.paciente.per_fechanac = null;

        if (persona.per_fechanac && persona.per_fechanac.trim().length > 0) {
            this.form.paciente.per_fechanacstr = persona.per_fechanac;
            this.form.paciente.per_fechanac = this.fechasService.parseString(persona.per_fechanac);
        } else {
            this.logicaDatosIncompletos(true);
        }

        this.form.paciente.per_genero = persona.per_genero.toString();
        this.form.paciente.per_estadocivil = null;
        if (persona.per_estadocivil) {
            this.form.paciente.per_estadocivil = this.arrayUtil.getFirstResult(
                this.estadoCivilList,
                (el, idx, array) => {
                    return el.lval_id === persona.per_estadocivil;
                }
            );
        }

        this.form.paciente.per_lugresidencia = null;
        if (persona.per_lugresidencia) {
            this.form.paciente.per_lugresidencia = this.arrayUtil.getFirstResult(
                this.lugares,
                (el, idx, array) => {
                    return el.lug_id === persona.per_lugresidencia;
                }
            );
        }

        this.form.paciente.per_ocupacion = null;
        if (persona.per_ocupacion) {
            this.form.paciente.per_ocupacion = this.arrayUtil.getFirstResult(
                this.ocupaciones,
                (el, idx, array) => {
                    return el.lval_id === persona.per_ocupacion;
                }
            );
        }
    }

    selectSupTab(tab: number, event: Event) {
        this.selectedSupTab = tab;
        event.preventDefault();
        if (tab === 1) {
            this.domService.setFocusTimeout('buscaPacNomCiInput', 500);
        }
    }

    setTipoOdontograma(tipo: number) {
        this.tipoOdontogramaSel = tipo;
    }
}
