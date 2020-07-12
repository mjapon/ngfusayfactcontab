import {Component, OnInit} from '@angular/core';
import {CitasMedicasService} from '../../../services/citas-medicas.service';
import {FechasService} from '../../../services/fechas.service';
import {CatalogosService} from '../../../services/catalogos.service';
import {PersonaService} from '../../../services/persona.service';
import {SwalService} from '../../../services/swal.service';
import {DateFormatPipe} from '../../../pipes/date-format.pipe';
import {LugarService} from '../../../services/lugar.service';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {DomService} from '../../../services/dom.service';

declare var $: any;

@Component({
    selector: 'app-citasmedicas',
    templateUrl: './citasmedicas.component.html',
    styleUrls: ['./citasmedicas.component.css']
})
export class CitasmedicasComponent implements OnInit {

    form: any;
    ciedataArray: Array<any>;
    antpers: Array<any>;
    es: any;
    maxDate = new Date();
    showBuscaPaciente = true;
    cirucPaciente: string;

    estadoCivilList: Array<any>;
    generosList: Array<any>;
    selectedEstCivil: any;
    lugares: Array<any>;
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

    constructor(private citasMedicasServ: CitasMedicasService,
                private catalogosServ: CatalogosService,
                private personaService: PersonaService,
                private dateFormatPipe: DateFormatPipe,
                private swalService: SwalService,
                private fechasService: FechasService,
                private arrayUtil: ArrayutilService,
                private domService: DomService,
                private lugarService: LugarService) {
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

        this.lugarService.listarTodos().subscribe(resLugares => {
            if (resLugares.status === 200) {
                this.lugares = resLugares.items;
            }
        });

        this.domService.setFocusTimeout('initBuscaPacInput', 600);

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

        this.accordionStatus = {
            citasPanel: false,
            datosPacPanel: false,
            motConsultaPanel: false,
            historiaSelPanel: false
        };
    }

    initform() {
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

    initBuscaPaciente() {
        this.citasMedicasServ.getForm().subscribe(res => {
            if (res.status === 200) {
                let per_ciruc = this.form.paciente.per_ciruc;
                this.form = res.form;
                this.form.paciente.per_ciruc = per_ciruc;
                this.buscarPaciente(true);
                this.showBuscaPaciente = false;
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

    buscarPaciente(showMessage) {
        const per_ciruc = this.form.paciente.per_ciruc;
        this.historias = [];
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
                    this.domService.setFocusTimeout('perNombresInput', 600);
                    if (showMessage) {
                        this.swalService.fireToastWarn('Nuevo paciente, debe ingresar los datos de filiación');
                    }
                }
                this.showTab(this.selectedTabId);
            }
        );
    }

    verificaPacienteRegistrado() {
        if (this.form.paciente.per_id === 0) {
            this.buscarPaciente(false);
        }
    }

    validarDatosRequeridosPaciente() {
        let formPaciente = this.form.paciente;
        formPaciente.per_ciruc;
        formPaciente.per_nombres;
        formPaciente.per_fechanac;
        formPaciente.per_genero;
        formPaciente.per_estadocivil;
        formPaciente.per_movil;
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
        let formPaciente = this.form.paciente;
        let estadoCivil = formPaciente.per_estadocivil;
        let residencia = formPaciente.per_lugresidencia;
        let genero = formPaciente.per_genero;

        if (!genero) {
            this.swalService.fireToastError('Debe seleccionar el genero del paciente');
            return;
        }

        if (!estadoCivil) {
            this.swalService.fireToastError('Debe seleccionar el estado civil del paciente');
            return;
        }

        let per_estadocivil = estadoCivil.lval_id;
        let per_genero = genero;
        let per_lugresidencia = residencia ? residencia.lug_id : 0;

        const formToPost: any = {};
        for (const prop of Object.keys(formPaciente)) {
            formToPost[prop] = formPaciente[prop];
        }
        formToPost.per_estadocivil = per_estadocivil;
        formToPost.per_genero = per_genero;
        formToPost.per_lugresidencia = per_lugresidencia;
        const fechaNacimiento = this.dateFormatPipe.transform(formPaciente.per_fechanac);
        formToPost.per_fechanacp = fechaNacimiento;
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
                const fechaNac = this.dateFormatPipe.transform(this.form.paciente.per_fechanac);
                const formToPost: any = {};
                for (const prop of Object.keys(this.form)) {
                    formToPost[prop] = this.form[prop];
                }
                formToPost.paciente.per_fechanac = fechaNac;
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
        this.form.paciente.per_ciruc = '';
        this.domService.setFocusTimeout('initBuscaPacInput', 600);
    }

    selectHistoriaAnt(row: any) {
        this.rowHistoriaSel = row;
        this.citasMedicasServ.getDatosHistoriaByCod(row.cosm_id).subscribe(res => {
            if (res.status === 200) {
                this.historiaSel = res.datoshistoria;
                this.isHistoriaAntSel = true;
                if (!this.accordionStatus.historiaSelPanel) {
                    setTimeout(() => {
                        this.toggleAcordion('historiaSelPanel');
                    }, 500);
                }
            }
        });
    }

    cerrarHistoriaAnt() {
        this.toggleAcordion('historiaSelPanel');
        this.isHistoriaAntSel = false;
    }

    imprimirReceta() {
        this.citasMedicasServ.imprimir(this.codConsultaGen);
    }

    imprimirRecetaAnterior() {
        this.citasMedicasServ.imprimir(this.rowHistoriaSel.cosm_id);
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

        this.form.paciente.per_fechanac = null;
        if (persona.per_fechanac && persona.per_fechanac.trim().length > 0) {
            const fechaNacimiento = this.fechasService.parseString(persona.per_fechanac);
            this.form.paciente.per_fechanac = fechaNacimiento;
        }

        this.form.paciente.per_genero = persona.per_genero.toString();

        this.form.paciente.per_estadocivil = null;
        if (persona.per_estadocivil) {
            const dbEstadoCivil = this.arrayUtil.getFirstResult(
                this.estadoCivilList,
                (el, idx, array) => {
                    return el.lval_id === persona.per_estadocivil;
                }
            );
            this.form.paciente.per_estadocivil = dbEstadoCivil;
        }

        this.form.paciente.per_lugresidencia = null;
        if (persona.per_lugresidencia) {
            const dbLugResidencia = this.arrayUtil.getFirstResult(
                this.lugares,
                (el, idx, array) => {
                    return el.lug_id === persona.per_lugresidencia;
                }
            );
            this.form.paciente.per_lugresidencia = dbLugResidencia;
        }
    }
}
