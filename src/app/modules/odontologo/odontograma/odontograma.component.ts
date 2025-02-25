import {Component, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {MenuItem} from 'primeng/api';
import {SwalService} from '../../../services/swal.service';
import {ToolsDienteService} from '../../../services/toolsdiente.service';
import {OdontogramaService} from '../../../services/odontograma.service';
import {LoadingUiService} from '../../../services/loading-ui.service';

@Component({
    selector: 'app-odontograma',
    templateUrl: './odontograma.component.html',
    styleUrls: ['./odontograma.component.scss']
})
export class OdontogramaComponent implements OnInit, OnDestroy, OnChanges {

    @Input()
    tipodontograma: number;

    @Input()
    codpaciente: number;

    dientesA: Array<any>;
    dientesB: Array<any>;
    dientesC: Array<any>;
    dientesD: Array<any>;

    tools: any;
    toolSelected: any;

    codSelectedTool: 0;
    selectedCssClass: string;
    operacionCapa: boolean;
    classTapa: string;
    classTapaLeche: string;
    dentadura: any;

    dienteSelected: any;
    rangoProtesis: number[];
    menuItemsTool: MenuItem[];
    tiposProtesis: any[];
    estadoProtesisSel: any;
    estadosProtesis: any[];
    tipoProtesisSel: any;
    zonasProtesis: any[];
    zonaProtesisSel: any;
    dientesProtesis: any[];
    protesisList: any[];
    showStateButtons: any[];

    tiposPiezas: any[];
    tipoPiezaSel: any;
    formOdontograma: any;

    @ViewChild('contextMenuDiente') contextMenuDiente: any;

    modalPiezaVisible: boolean;
    modalCreaProtesis: boolean;
    obsodontograma: string;
    estadoDienteStr: string;
    estadoDienteBg: string;
    private iniciaSelProt: boolean;
    allcssobj = {};

    isShowHisto = false;

    constructor(private render: Renderer2, private arrayUtil: ArrayutilService, private swalService: SwalService,
                private toolsDienteServ: ToolsDienteService,
                private odontoService: OdontogramaService, private loadingUiService: LoadingUiService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.codpaciente;
        if (chng.currentValue) {
            this.loadForm();
        } else {
            this.clearAll();
        }
    }

    ngOnDestroy(): void {
        this.modalPiezaVisible = false;
        this.modalCreaProtesis = false;
        this.dienteSelected = {};
        this.iniciaSelProt = false;
    }

    loadForm() {
        this.loadingUiService.publishBlockMessage();
        this.odontoService.getForm(this.codpaciente, this.tipodontograma).subscribe(res => {
            if (res.status === 200) {
                this.formOdontograma = res.form;
                this.loadDientesFromDb(res.form);
            }
        });

        this.odontoService.getCss().subscribe(rescss => {
            if (rescss.status === 200) {
                this.allcssobj = rescss.css;
            }
        });
    }

    ngOnInit(): void {
        this.tiposProtesis = this.toolsDienteServ.getTiposProtesis();
        this.zonasProtesis = [{label: 'Palatino', value: 1}, {label: 'Lingual', value: 2}];
        this.tiposPiezas = [{label: 'Protesis', value: 1}, {label: 'Retenedor', value: 2}];
        this.estadosProtesis = [{label: 'Realizado', value: 1}, {label: 'Por realizar', value: 2}];
        this.estadoProtesisSel = this.estadosProtesis[0].value;
        this.obsodontograma = '';
        this.loadDientes();
        this.initTools();
        this.selectedCssClass = '';
        this.menuItemsTool = [];
        this.rangoProtesis = [];
        this.dientesProtesis = [];
        this.protesisList = [];
    }

    clearAll() {
        this.loadDientes();
        this.clearProtesisList();
        this.obsodontograma = '';
    }

    clearProtesisList() {
        this.dientesProtesis = [];
        this.protesisList = [];
    }

    showModalPieza(diente) {
        this.dienteSelected = diente;
        this.estadoProtesisSel = this.estadosProtesis[0];
        // Actualizar estado  array dientes
        this.modalPiezaVisible = true;
        this.updateStatebuttons();
    }

    updateStatebuttons() {
        this.estadoDienteStr = this.toolsDienteServ.getStrState(this.dienteSelected);
        this.estadoDienteBg = this.toolsDienteServ.getColorState(this.dienteSelected);
        this.showStateButtons = [
            this.toolsDienteServ.isShowTrataPend(this.dienteSelected),
            this.toolsDienteServ.isShowTrataHecho(this.dienteSelected),
            this.toolsDienteServ.isShowTratExt(this.dienteSelected),
            this.toolsDienteServ.isShowTrataClear(this.dienteSelected),
        ];
    }

    initTools(): void {
        this.tools = this.toolsDienteServ.getTools();
    }

    auxLoadDientes(inicio: number, array: Array<any>, signo: number, numdientes: number, cudr: any) {
        let tipoDiente = 'D';
        if (numdientes === 5) {
            tipoDiente = 'L';
        }
        for (let i = 0; i < numdientes; i++) {
            const numDiente = inicio + (i * signo);
            const diente = {
                numero: numDiente,
                tipo: tipoDiente,
                t: {estilos: {}, tools: []},
                b: {estilos: {}, tools: []},
                l: {estilos: {}, tools: []},
                r: {estilos: {}, tools: []},
                c: {estilos: {}, tools: []},
                tapaVisible: false,
                classTapa: '',
                tools: [],
                texto: '',
                cdr: cudr,
                estado: 0,
                protesis: 0
            };
            array.push(diente);
        }
    }

    getEstadoDiente(diente: any) {
        return this.toolsDienteServ.getStrState(diente, false);
    }

    getCssClass(estilos) {
        return Object.values(estilos);
    }

    loadDientes() {
        this.dientesA = [];
        this.dientesB = [];
        this.dientesC = [];
        this.dientesD = [];
        const numDientes = 8;
        const numDientesNinio = 5;
        if (this.tipodontograma === 1) {
            this.auxLoadDientes(18, this.dientesA, -1, numDientes, 'A');
            this.auxLoadDientes(21, this.dientesB, 1, numDientes, 'B');
            this.auxLoadDientes(48, this.dientesC, -1, numDientes, 'C');
            this.auxLoadDientes(31, this.dientesD, 1, numDientes, 'D');
        } else {
            this.auxLoadDientes(55, this.dientesA, -1, numDientesNinio, 'A');
            this.auxLoadDientes(61, this.dientesB, 1, numDientesNinio, 'B');
            this.auxLoadDientes(85, this.dientesC, -1, numDientesNinio, 'C');
            this.auxLoadDientes(71, this.dientesD, 1, numDientesNinio, 'D');
        }

        this.dentadura = {
            A: this.dientesA, B: this.dientesB, C: this.dientesC, D: this.dientesD
        };
    }

    loadDientesFromDb(datosodonto: any) {
        try {
            if (datosodonto.od_odontograma) {
                const dentadura = JSON.parse(datosodonto.od_odontograma);
                if (dentadura) {
                    this.dentadura = dentadura;
                }
            } else {
                this.loadDientes();
            }

            if (datosodonto.od_protesis) {
                const protesis = JSON.parse(datosodonto.od_protesis);
                if (protesis) {
                    this.protesisList = protesis;
                }
            } else {
                this.clearProtesisList();
            }

            if (datosodonto.od_obsodonto) {
                this.obsodontograma = datosodonto.od_obsodonto;
            } else {
                this.obsodontograma = '';
            }
        } catch (e) {
            this.clearAll();
        }
    }

    clearDienteCssTBLRC(diente: any) {
        diente.t = {estilos: {}, tools: []};
        diente.b = {estilos: {}, tools: []};
        diente.l = {estilos: {}, tools: []};
        diente.r = {estilos: {}, tools: []};
        diente.c = {estilos: {}, tools: []};
        diente.tools = [];
        diente.tapaVisible = false;
        diente.classTapa = '';
        diente.protesis = 0;
        diente.tipoprotesis = 0;
        diente.estado = 0;
    }

    auxToggleClass(diente: any, lado: string) {
        let cssclass = this.selectedCssClass;
        if (this.toolSelected) {
            if (this.operacionCapa) {
                if (diente.tapaVisible) {
                    diente.tapaVisible = false;
                    diente.classTapa = '';
                } else {
                    diente.tapaVisible = true;
                    if (diente.tipo === 'L') {
                        diente.classTapa = this.classTapaLeche;
                    } else {
                        diente.classTapa = this.classTapa;
                    }
                }
                const tools = diente.tools;
                if (tools.includes(this.codSelectedTool)) {
                    this.arrayUtil.removeElement(tools, this.codSelectedTool);
                } else {
                    tools.push(this.codSelectedTool);
                }
            } else {
                const estilos = diente[lado].estilos;
                let cssprop = 'fondo';
                if (cssclass === 'caries-grande' || cssclass === 'caries-pequenio' || cssclass === 'caries-mediano') {
                    if (this.arrayUtil.contains(Object.values(estilos), 'obturado-grande')) {
                        cssprop = 'borde';
                        cssclass = 'caries-grande-borde';
                    }
                }
                if (estilos[cssprop]) {
                    delete estilos[cssprop];
                } else {
                    estilos[cssprop] = cssclass;
                }
                diente[lado].tools = [];
                Object.values(estilos).forEach(it => {
                    const idtoolit = this.getCodToolFromEstilo(it.toString());
                    if (idtoolit) {
                        diente[lado].tools.push(idtoolit);
                    }
                });

                if (diente[lado].tools.length === 1) {
                    const codtoold = diente[lado].tools[0];
                    if (codtoold === 14 || codtoold === 16 || codtoold === 17) {
                        if (codtoold === 14) {
                            diente[lado].estilos = {fondo: 'caries-grande'};
                        } else if (codtoold === 16) {
                            diente[lado].estilos = {fondo: 'caries-pequenio'};
                        } else if (codtoold === 17) {
                            diente[lado].estilos = {fondo: 'caries-mediano'};
                        }
                    }
                }
            }
        } else {
            this.swalService.fireToastWarn('Primero seleccione una herramienta');
        }
    }

    toggleClassTop(diente: any) {
        this.auxToggleClass(diente, 't');
    }

    toggleClassBottom(diente: any) {
        this.auxToggleClass(diente, 'b');
    }

    toggleClassLeft(diente: any) {
        this.auxToggleClass(diente, 'l');
    }

    toggleClassRight(diente: any) {
        this.auxToggleClass(diente, 'r');
    }

    toggleClassCenter(diente: any) {
        this.auxToggleClass(diente, 'c');
    }

    cssSelectedTool(idTool) {
        return this.codSelectedTool === idTool ? 'btn-success' : 'btn-outline-dark';
    }

    getCodToolFromEstilo(estilo: string) {
        let codtool = 0;
        switch (estilo) {
            case 'caries-grande':
                codtool = 14;
                break;
            case 'caries-pequenio':
                codtool = 16;
                break;
            case 'caries-mediano':
                codtool = 17;
                break;
            case 'obturado-mediano':
                codtool = 19;
                break;
            case 'obturado-grande':
                codtool = 13;
                break;
            case 'caries-grande-borde':
                codtool = 14;
                break;
            default:
                codtool = null;
                break;
        }
        return codtool;
    }

    selectTool(idTool) {
        this.codSelectedTool = idTool;
        this.toolSelected = this.tools[idTool];
        this.operacionCapa = false;
        if (this.toolSelected.cssClass) {
            this.selectedCssClass = this.toolSelected.cssClass;
        }
        if (this.toolSelected.classTapa) {
            this.operacionCapa = true;
            this.classTapa = this.toolSelected.classTapa;
        }
        if (this.toolSelected.classTapaLeche) {
            this.operacionCapa = true;
            this.classTapaLeche = this.toolSelected.classTapaLeche;
        }
    }

    isDienteModif(diente: any) {
        if (diente.tools.length > 0) {
            return true;
        }
        return Object.values(diente.t.estilos).length > 0 ||
            Object.values(diente.b.estilos).length > 0 ||
            Object.values(diente.l.estilos).length > 0 ||
            Object.values(diente.r.estilos).length > 0 ||
            Object.values(diente.c.estilos).length > 0;
    }

    getNextCuadr(currentCuadr) {
        let nextCuadr = null;
        switch (currentCuadr) {
            case 'A': {
                nextCuadr = 'B';
                break;
            }
            case 'B': {
                nextCuadr = 'C';
                break;
            }
            case 'C': {
                nextCuadr = 'D';
                break;
            }
            case 'D': {
                nextCuadr = null;
                break;
            }
            default: {
                nextCuadr = null;
                break;
            }
        }
        return nextCuadr;
    }

    getPreviusCuadr(currentCuadr) {
        let backCuadr = null;
        switch (currentCuadr) {
            case 'A': {
                backCuadr = null;
                break;
            }
            case 'B': {
                backCuadr = 'A';
                break;
            }
            case 'C': {
                backCuadr = 'B';
                break;
            }
            case 'D': {
                backCuadr = 'C';
                break;
            }
            default: {
                backCuadr = null;
                break;
            }
        }
        return backCuadr;
    }

    nextDiente() {
        if (this.dienteSelected) {
            this.guardarOdontograma(true);
            const cuandrante = this.dienteSelected.cdr;
            if (this.dentadura[cuandrante]) {
                const indexDS = this.dentadura[cuandrante].indexOf(this.dienteSelected);
                if (indexDS !== -1 && indexDS < (this.dentadura[cuandrante].length - 1)) {
                    this.dienteSelected = this.dentadura[cuandrante][indexDS + 1];
                    this.updateStatebuttons();
                } else {
                    const nextCuadr = this.getNextCuadr(cuandrante);
                    if (nextCuadr) {
                        this.dienteSelected = this.dentadura[nextCuadr][0];
                        this.updateStatebuttons();
                    } else {
                        alert('Llegaste al final');
                    }
                }
            }
        }
    }

    backDiente() {
        if (this.dienteSelected) {
            this.guardarOdontograma(true);
            const cuandrante = this.dienteSelected.cdr;
            if (this.dentadura[cuandrante]) {
                const indexDS = this.dentadura[cuandrante].indexOf(this.dienteSelected);
                if (indexDS !== -1 && indexDS > 0) {
                    this.dienteSelected = this.dentadura[cuandrante][indexDS - 1];
                    this.updateStatebuttons();
                } else {
                    const backCuadr = this.getPreviusCuadr(cuandrante);
                    if (backCuadr) {
                        const cuadrlen = this.dentadura[backCuadr].length;
                        this.dienteSelected = this.dentadura[backCuadr][cuadrlen - 1];
                        this.updateStatebuttons();
                    } else {
                        alert('Se alcanzó el inicio');
                    }
                }
            }
        }
    }

    checkUncheckTool(idTool: number) {
        this.toolsDienteServ.checkUncheckTool(idTool, this.dienteSelected);
    }

    cssMarkedTool(idTool: number) {
        return this.dienteSelected.tools.indexOf(idTool) >= 0 ? 'btn-success' : 'btn-outline-dark';
    }

    cerrarDialogDiente() {
        this.modalPiezaVisible = false;
        this.dienteSelected = null;
        this.guardarOdontograma(true);
    }

    showModalProtesis() {
        this.dientesProtesis = [];
        this.tipoProtesisSel = null;
        this.zonaProtesisSel = null;
        this.tipoPiezaSel = null;
        this.estadoProtesisSel = null;
        this.modalCreaProtesis = true;
    }

    closeModalProtesis() {
        this.modalCreaProtesis = false;
    }

    loadDientesForProtesis(startA, endA, startB, endB, issel, tipo) {
        this.dientesProtesis = [];
        for (let i = startA; i >= endA; i--) {
            this.dientesProtesis.push({value: i, sel: issel, tipo});
        }
        for (let i = startB; i <= endB; i++) {
            this.dientesProtesis.push({value: i, sel: issel, tipo});
        }
    }

    onZonaProtChange($event: any) {
        const issel = this.tipoProtesisSel === 3;
        const tipo = this.tiposPiezas[0].value;
        if (this.zonaProtesisSel === 1) {
            this.loadDientesForProtesis(18, 11, 21, 28, issel, tipo);
        } else {
            this.loadDientesForProtesis(48, 41, 31, 38, issel, tipo);
        }
    }

    getDientesProtesisMarked() {
        return this.dientesProtesis.filter(it => it.sel);
    }

    dientesProtesisMarked() {
        return this.getDientesProtesisMarked().length > 0;
    }

    creaProtesis() {
        const dientprot = this.getDientesProtesisMarked();
        if (dientprot.length > 0) {
            dientprot.forEach(e => {
                // Esto es el tipo de pieza si es protesis o retenedor
                if (e.tipo === 2) {
                    e.protesis = -1;
                } else {
                    e.protesis = this.estadoProtesisSel;
                    e.tipoprotesis = this.tipoProtesisSel;
                }
                const itdiente = this.toolsDienteServ.buscaPiezaDental(this.dentadura, e.value);
                if (itdiente) {
                    itdiente.protesis = e.protesis;
                    if (e.protesis !== -1) {
                        itdiente.tipoprotesis = e.tipoprotesis;
                    }
                }
            });
            const newprotesis = {
                numero: this.protesisList.length + 1,
                piezas: dientprot.filter(e => e.tipo === 1).map(x => x.value),
                retens: dientprot.filter(e => e.tipo === 2).map(x => x.value),
                tipo: this.tiposProtesis[this.tipoProtesisSel - 1].label,
                estado: this.estadosProtesis[this.estadoProtesisSel - 1].label
            };
            this.protesisList.push(newprotesis);
            this.modalCreaProtesis = false;
        }
    }

    onMouseDownProtDiente(it: any) {
        if (this.tipoPiezaSel && this.tipoProtesisSel < 3) {
            it.sel = true;
            it.tipo = this.tipoPiezaSel;
            this.iniciaSelProt = true;
        }
    }

    onMouseOverProtDiente(it: any) {
        if (this.iniciaSelProt && this.tipoProtesisSel < 3) {
            it.sel = true;
            it.tipo = this.tipoPiezaSel;
        }
    }

    onMouseUpProtDiente(it: any) {
        if (this.iniciaSelProt && this.tipoProtesisSel < 3) {
            it.sel = true;
            it.tipo = this.tipoPiezaSel;
            this.iniciaSelProt = false;

            if (this.tipoProtesisSel === 2) {
                this.tipoPiezaSel = 1;
            }
        }
    }

    limpiarSelProtesis() {
        this.dientesProtesis.forEach(e => {
            e.sel = false;
        });
    }

    onTipoProtesisChange($event: any) {
        this.tipoPiezaSel = this.tiposPiezas[0].value;
        this.estadoProtesisSel = null;
        this.zonaProtesisSel = null;
    }

    onEstadoProtesisSel($event: any) {
    }

    clearProtesis(protesis: any) {
        protesis.piezas.forEach(x => {
            const piezadental = this.toolsDienteServ.buscaPiezaDental(this.dentadura, x);
            if (piezadental) {
                piezadental.protesis = 0;
            }
        });

        protesis.retens.forEach(x => {
            const piezadental = this.toolsDienteServ.buscaPiezaDental(this.dentadura, x);
            if (piezadental) {
                piezadental.protesis = 0;
            }
        });
        this.arrayUtil.removeElement(this.protesisList, protesis);
    }

    guardarOdontograma(silent = false) {
        this.formOdontograma.od_tipo = this.tipodontograma;
        this.formOdontograma.od_odontograma = JSON.stringify(this.dentadura);
        this.formOdontograma.od_protesis = JSON.stringify(this.protesisList);
        this.formOdontograma.od_obs = this.obsodontograma;
        if (this.formOdontograma.pac_id) {
            if (!silent) {
                this.loadingUiService.publishBlockMessage();
            }
            this.odontoService.guardar(this.formOdontograma).subscribe(res => {
                if (res.status === 200) {
                    if (!silent) {
                        this.swalService.fireToastSuccess(res.msg);
                    }
                    this.formOdontograma.od_id = res.od_id;
                }
            });
        } else {
            this.swalService.fireToastError('Primero debe registrar el paciente antes de registrar el odontograma');
        }
    }

    onModalPiezaHide($event: any) {
        this.guardarOdontograma(true);
    }

    saveOdontoSilent() {
        this.guardarOdontograma(false);
    }

    changeState($event: MouseEvent) {
        $event.preventDefault();
        const result = this.toolsDienteServ.changeState(this.dienteSelected);
        if (result) {
            this.saveChangeState();
        }
    }

    saveChangeState() {
        this.guardarOdontograma(false);
        this.updateStatebuttons();
    }

    changeStateExt($event: MouseEvent) {
        $event.preventDefault();
        const result = this.toolsDienteServ.changeStateExt(this.dienteSelected);
        if (result) {
            this.saveChangeState();
        }
    }

    changeStateClear($event: MouseEvent) {
        $event.preventDefault();
        const result = this.toolsDienteServ.changeStateClear(this.dienteSelected);
        if (result) {
            this.saveChangeState();
        }
    }

    showHideHisto() {
        this.isShowHisto = !this.isShowHisto;
    }
}
