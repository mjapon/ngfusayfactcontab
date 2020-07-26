import {Component, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {FechasService} from '../../../services/fechas.service';
import {CatalogosService} from '../../../services/catalogos.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {DateFormatPipe} from '../../../pipes/date-format.pipe';
import {LugarService} from '../../../services/lugar.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {DomService} from '../../../services/dom.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {DOCUMENT} from '@angular/common';
import {CadenasutilService} from '../../../services/cadenasutil.service';

declare var $: any;

@Component({
    selector: 'app-citasmedicas',
    templateUrl: './citasmedicas.component.html',
    providers: [
        {provide: Window, useValue: window}
    ],
    styleUrls: ['./citasmedicas.component.css']
})
export class CitasmedicasComponent implements OnInit {

    form: any;
    ciedataArray: Array<any>;
    antpers: Array<any>;
    es: any;
    currentDate = new Date();
    showBuscaPaciente = true;
    cirucPaciente: string;
    filtro: string;

    estadoCivilList: Array<any>;
    generosList: Array<any>;
    lugares: Array<any>;
    ocupaciones: Array<any>;
    historias: Array<any>;
    isHistoriaAntSel: boolean;
    historiaSel: any;
    rowHistoriaSel: any;
    tabs: Array<any>;
    selectedTab: number;
    selectedTabId: string;
    accordionStatus: any;
    saved: boolean;
    codConsultaGen: any;
    pacienteSel: any;
    pacientesArray: Array<any>;
    currentPagPacientes: number;
    hayMasFilasPac: boolean;

    datosAlertaImc: any;
    datosAlertaPresion: any;
    bottomAlcanzado: boolean;
    previustimer: any = 0;

    @ViewChild('divHistoriaAnt') divHistoriaAnt: any;
    @ViewChild('mainDiv') mainDiv: any;
    @ViewChild('divListaPacientes') divListaPaciente: any;

    listener;

    constructor(private citasMedicasServ: CitasMedicasService,
                private catalogosServ: CatalogosService,
                private personaService: PersonaService,
                private dateFormatPipe: DateFormatPipe,
                private swalService: SwalService,
                private fechasService: FechasService,
                private arrayUtil: ArrayutilService,
                private domService: DomService,
                private lugarService: LugarService,
                private loadingUiService: LoadingUiService,
                private window: Window,
                @Inject(DOCUMENT) private document: Document,
                private renderer2: Renderer2,
                private cadutil: CadenasutilService) {

        this.listener = this.renderer2.listen('window', 'scroll', (e) => {
            if (!this.bottomAlcanzado) {
                if ((window.innerHeight + window.pageYOffset + 100) >= (document.body.offsetHeight)) {
                    this.bottomAlcanzado = true;
                    this.loadMorePacientes();
                }
            }
        });
    }

    ngOnInit(): void {
        this.clearAll();
        this.initform();

        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            if (rescie.status === 200) {
                this.ciedataArray = rescie.cie10data;
            }
        });

        this.es = this.fechasService.getLocaleEsForPrimeCalendar();

        this.catalogosServ.getCatalogos(1).subscribe(resa => {
            if (resa.status === 200) {
                this.generosList = resa.items;
            }
        });

        this.catalogosServ.getCatalogos(2).subscribe(resb => {
            if (resb.status === 200) {
                this.estadoCivilList = resb.items;
            }
        });

        this.catalogosServ.getCatalogos(3).subscribe(resc => {
            if (resc.status === 200) {
                this.ocupaciones = resc.items;
            }
        });

        this.lugarService.listarTodos().subscribe(resLugares => {
            if (resLugares.status === 200) {
                this.lugares = resLugares.items;
            }
        });

        this.domService.setFocusTimeout('buscaPacNomCiInput', 700);

        this.accordionStatus = {
            citasPanel: false,
            datosPacPanel: false,
            motConsultaPanel: false,
            historiaSelPanel: false
        };

        this.tabs = [
            {titulo: 'Datos de Filiación', paso: 1, panelid: 'panelDatosFil'},
            {titulo: 'Motivo de Consulta', paso: 2, panelid: 'panelMotConsulta'},
            {titulo: 'Antecedentes', paso: 3, panelid: 'panelAntecedentes'},
            {titulo: 'Revisión por sistemas', paso: 4, panelid: 'panelRevXSis'},
            {titulo: 'Examen Físico', paso: 5, panelid: 'panelExamFisico'},
            {titulo: 'Exms. Complementarios', paso: 6, panelid: 'panelExamComple'},
            {titulo: 'Diagnóstico', paso: 7, panelid: 'panelDiagnostico'}
        ];
        this.selectedTab = 2;
        this.selectedTabId = 'panelMotConsulta';
        this.datosAlertaImc = {};
        this.datosAlertaPresion = {};

        this.buscarPacientes();
    }

    clearAll() {
        this.showBuscaPaciente = true;
        this.cirucPaciente = '';
        this.selectedTab = 2;
        this.selectedTabId = 'panelMotConsulta';
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

        this.accordionStatus = {
            citasPanel: false,
            datosPacPanel: false,
            motConsultaPanel: false,
            historiaSelPanel: false
        };
    }

    initform() {
        this.pacienteSel = null;
        this.pacientesArray = [];
        this.currentPagPacientes = 0;
        this.filtro = '';
        this.hayMasFilasPac = false;
        this.bottomAlcanzado = false;

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
                user_crea: ''
            },
            antecedentes: [],
            examsfisicos: [],
            revxsistemas: [],
            diagnostico: []
        };
    }

    clearForm() {
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
                user_crea: ''
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

    selectPaciente(row) {
        this.form.paciente.per_ciruc = row.per_ciruc;
        this.initBuscaPaciente('perNombresInput');
    }

    buscarPacientes() {
        this.loadingUiService.publishBlockMessage();
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
        });
    }

    showTab(tabId) {
        $('#' + tabId).tab('show');
        $('#tabcab_' + tabId).addClass('active');
    }

    hideTab(tabId) {
        $('#' + tabId).removeClass('active');
        $('#tabcab_' + tabId).removeClass('active');
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

    buscarPaciente(showMessage, focusInput) {
        const per_ciruc = this.form.paciente.per_ciruc;
        this.historias = [];
        this.loadingUiService.publishBlockMessage();
        this.personaService.buscarPorCi(per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    if (showMessage) {
                        this.swalService.fireToastInfo('El paciente ya está registrado');
                    }
                    this.loadDataPerson(res.persona);
                    this.citasMedicasServ.getListaAtenciones(per_ciruc).subscribe(resCitas => {
                        if (resCitas.status === 200) {
                            this.historias = resCitas.items;
                            this.antpers = resCitas.antpers;
                            if (this.antpers && this.antpers.length > 0) {
                                this.form.antecedentes = this.antpers;
                            }
                        }
                    });
                    this.domService.setFocusTimeout('motivoConsultaTextArea', 600);
                } else {
                    this.selectedTabId = 'panelDatosFil';
                    this.selectedTab = 1;
                    this.domService.setFocusTimeout(focusInput, 600);
                    if (showMessage) {
                        this.swalService.fireToastWarn('Nuevo paciente, debe ingresar los datos de filiación');
                    }
                    this.clearForm();
                    this.form.paciente.per_ciruc = per_ciruc;
                }
                this.showTab(this.selectedTabId);
            }
        );
    }

    verificaPacienteRegistrado() {
        if (this.form.paciente.per_id === 0) {
            this.buscarPaciente(false, 'perNombresInput');
        }
    }

    guardarExamCompl() {
        this.selectedTab = 7;
        this.selectedTabId = 'panelDiagnostico';
        this.showTab(this.selectedTabId);
        this.hideTab('panelExamComple');
        this.domService.setFocusTimeout('diagnostico_id', 100);
    }

    guardarDiagnostico() {
        this.registrarCita();
    }

    guardarExamenFisico() {
        this.selectedTab = 6;
        this.selectedTabId = 'panelExamComple';
        this.showTab(this.selectedTabId);
        this.hideTab('panelExamFisico');
        this.domService.setFocusTimeout('inexamcompl_0', 100);
    }

    guardarRevXSistemas() {
        this.selectedTab = 5;
        this.selectedTabId = 'panelExamFisico';
        this.showTab(this.selectedTabId);
        this.hideTab('panelRevXSis');
        this.domService.setFocusTimeout('inexamfis_0', 100);
    }

    guardaMotivoConsulta() {
        this.selectedTab = 3;
        this.selectedTabId = 'panelAntecedentes';
        this.showTab(this.selectedTabId);
        this.hideTab('panelMotConsulta');
        this.domService.setFocusTimeout('inantecedentes_0', 100);
    }

    guardarAntecedentes() {
        this.selectedTab = 4;
        this.selectedTabId = 'panelRevXSis';
        this.showTab(this.selectedTabId);
        this.hideTab('panelAntecedentes');
        this.domService.setFocusTimeout('inrevxsis_0', 100);
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
        formToPost.per_fechanacp = this.dateFormatPipe.transform(formPaciente.per_fechanac);
        this.loadingUiService.publishBlockMessage();
        this.personaService.actualizar(perId, formToPost).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.selectedTab = 2;
                this.selectedTabId = 'panelMotConsulta';
                this.showTab(this.selectedTabId);
                this.hideTab('panelDatosFil');
                this.domService.setFocusTimeout('motivoConsultaTextArea', 600);
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
                        fechaNac = this.dateFormatPipe.transform(this.form.paciente.per_fechanac);
                    } else {
                        fechaNac = this.form.paciente.per_fechanac;
                    }
                }

                let fechaProxCita = '';
                if (this.form.datosconsulta.cosm_fechaproxcita) {
                    if (this.form.datosconsulta.cosm_fechaproxcita instanceof Date) {
                        fechaProxCita = this.dateFormatPipe.transform(this.form.datosconsulta.cosm_fechaproxcita);
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
                this.loadingUiService.publishBlockMessage();
                this.citasMedicasServ.crearCita(formToPost).subscribe(res => {
                    if (res.status === 200) {
                        this.codConsultaGen = res.ccm;
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadListaAtenciones();
                        this.saved = true;
                    }
                });
            }
        });
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
        this.loadingUiService.publishBlockMessage();
        this.citasMedicasServ.getDatosHistoriaByCod(row.cosm_id).subscribe(res => {
            if (res.status === 200) {
                this.historiaSel = res.datoshistoria;
                this.isHistoriaAntSel = true;
                if (!this.accordionStatus.historiaSelPanel) {
                    setTimeout(() => {
                        this.toggleAcordion('historiaSelPanel');
                    }, 500);
                }
                setTimeout(() => {
                    this.divHistoriaAnt.nativeElement.scrollIntoView({behavior: 'smooth'});
                }, 700);
            }
        });
    }

    cerrarHistoriaAnt() {
        this.toggleAcordion('historiaSelPanel');
        this.isHistoriaAntSel = false;
        setTimeout(() => {
            this.mainDiv.nativeElement.scrollIntoView({behavior: 'smooth'});
        }, 400);
    }

    imprimirReceta() {
        this.citasMedicasServ.imprimir(this.codConsultaGen);
    }

    imprimirRecetaAnterior() {
        this.citasMedicasServ.imprimir(this.rowHistoriaSel.cosm_id);
    }

    imprimirHistoria() {
        this.citasMedicasServ.imprimirHistoria(this.rowHistoriaSel.cosm_id);
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
        context.currentPagPacientes = 0;
        context.bottomAlcanzado = false;
        context.buscarPacientes();
    }

    onFiltroTyped() {
        this.previustimer = this.delayKeyup(this.filtroDelayFn, 600, this.previustimer, this);
    }

    private loadDataPerson(persona: any) {
        this.form.paciente.per_id = persona.per_id;
        this.form.paciente.per_nombres = persona.per_nombres;
        this.form.paciente.per_apellidos = persona.per_apellidos;
        this.form.paciente.per_direccion = persona.per_direccion;
        this.form.paciente.per_telf = persona.per_telf;
        this.form.paciente.per_movil = persona.per_movil;
        this.form.paciente.per_email = persona.per_email;
        this.form.paciente.per_tipo = persona.per_tipo;
        this.form.paciente.per_lugnac = persona.per_lugnac;
        this.form.paciente.per_nota = persona.per_nota;
        this.form.paciente.per_edad = persona.per_edad;

        this.form.paciente.per_fechanac = null;
        if (persona.per_fechanac && persona.per_fechanac.trim().length > 0) {
            this.form.paciente.per_fechanac = this.fechasService.parseString(persona.per_fechanac);
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
}
