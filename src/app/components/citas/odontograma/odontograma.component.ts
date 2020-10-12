import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {MenuItem} from 'primeng';
import {SwalService} from '../../../services/swal.service';
import {ChangeodontoService} from '../../../services/changeodonto.service';
import {Subscription} from 'rxjs';

interface Pocision {
    top: number;
    left: number;
}

declare var $: any;


@Component({
    selector: 'app-odontograma',
    templateUrl: './odontograma.component.html',
    styleUrls: ['./odontograma.component.css']
})
export class OdontogramaComponent implements OnInit, OnDestroy {

    dientesA: Array<any>;
    dientesB: Array<any>;
    dientesC: Array<any>;
    dientesD: Array<any>;

    dientesLecheA: Array<any>;
    dientesLecheB: Array<any>;
    dientesLecheC: Array<any>;
    dientesLecheD: Array<any>;

    tools: any;
    toolSelected: any;
    codSelectedTool: 0;
    selectedCssClass: string;
    operacionCapa: boolean;
    classTapa: string;
    classTapaLeche: string;
    dentadura: any;

    menuItemsDiente: MenuItem[];
    textos: any;
    configA = {t: 'Vestibular', b: 'Palatino', l: 'Distal', r: 'Mesial', c: 'Oclusal'};
    configB = {t: 'Vestibular', b: 'Palatino', l: 'Mesial', r: 'Distal', c: 'Oclusal'};
    configC = {t: 'Lingual', b: 'Vestibular', l: 'Distal', r: 'Mesial', c: 'Oclusal'};
    configD = {t: 'Lingual', b: 'Vestibular', l: 'Mesial', r: 'Distal', c: 'Oclusal'};

    @ViewChild('contextMenuDiente') contextMenuDiente: any;

    @Output() messageToEmit = new EventEmitter<string>();

    subscription: Subscription;

    constructor(private render: Renderer2, private arrayUtil: ArrayutilService, private swalService: SwalService,
                private changeOdonto: ChangeodontoService) {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.loadDientes();
        this.initTools();
        this.selectedCssClass = '';
        this.menuItemsDiente = [];
        this.textos = {a: '', b: '', c: '', d: ''};
        this.subscription = this.changeOdonto.message.subscribe(msg => {
            if (msg) {
                if (msg === 'clear') {
                    this.loadDientes();
                } else {
                    try {
                        const odontoparsed = JSON.parse(msg.toString());
                        this.loadDientesFromDb(odontoparsed);
                    } catch (error) {
                        console.log('Error al parsear texto de odontograma desde la base de datos', error);
                    }
                }
            }
        });
    }

    showSetTextoDiente(event: any) {
        const diente = event.item.state;
        const obsdiente = diente.texto ? diente.texto : '';
        const textodiente = prompt('Observación', obsdiente);
        if (textodiente) {
            diente.texto = textodiente.trim();
            event.context.updateTextos();
        }
    }

    cambiarEstadoExterno(event) {
        const diente = event.item.state;
        const msg = '¿Confirma marca tratamiento externo?';
        const estadoDiente = diente.estado ? diente.estado : 0;
        if (estadoDiente === 0) {
            if (confirm(msg)) {
                diente.estado = 3;
                event.context.updateTextos();
            }
        }
    }

    cambiarEstadoDiente(event) {
        let msg = '¿Confirma que desea ';
        const diente = event.item.state;
        let estadoDiente = diente.estado ? diente.estado : 0;
        if (estadoDiente === 0 || estadoDiente === 2) {
            estadoDiente = 1;
            msg += ' iniciar tratamiento?';
        } else if (estadoDiente === 1) {
            estadoDiente = 2;
            msg += ' marcar como tratamiento realizado?';
        }
        if (confirm(msg)) {
            diente.estado = estadoDiente;
            event.context.updateTextos();
        }
    }

    loadContexMenu(diente) {
        this.menuItemsDiente = [];
        const estadoDiente = diente.estado ? diente.estado : 0;
        let txtestado = '';
        let addCambiaEstado = false;
        if (estadoDiente === 0 || estadoDiente === 2) {
            txtestado = 'Marcar tratamiento pendiente';
            addCambiaEstado = true;
        } else if (estadoDiente === 1) {
            txtestado = 'Marcar tratamiento realizado';
            addCambiaEstado = true;
        }
        // tslint:disable-next-line:prefer-const
        let self = this;
        if (addCambiaEstado) {
            this.menuItemsDiente.push({
                label: txtestado,
                command: (event => {
                    event.context = self;
                    self.cambiarEstadoDiente(event);
                }),
                state: diente
            });
        }

        if (estadoDiente === 0) {
            txtestado = 'Marcar tratamiento externo';
            this.menuItemsDiente.push({
                label: txtestado,
                command: (event => {
                    event.context = self;
                    self.cambiarEstadoExterno(event);
                }),
                state: diente
            });
        }

        const texto = diente.texto ? diente.texto : '';
        if (texto.trim().length > 0) {
            this.menuItemsDiente.push({
                label: texto,
                command: (event => {
                    event.context = self;
                    this.showSetTextoDiente(event);
                }),
                state: diente
            });
        } else {
            this.menuItemsDiente.push({
                label: 'Observación',
                command: (event => {
                    event.context = self;
                    this.showSetTextoDiente(event);
                }),
                state: diente
            });
        }
    }

    initTools(): void {
        this.tools = {
            1: {
                codigo: 1,
                nombre: 'Sellante necesario',
                classTapa: 'm-aster-rojo',
                classTapaLeche: 'm-aster-rojo-leche'
            },
            2: {
                codigo: 2,
                nombre: 'Sellante realizado',
                classTapa: 'm-aster-azul',
                classTapaLeche: 'm-aster-azul-leche'
            },
            3: {
                codigo: 3,
                nombre: 'Extracción Indicada',
                classTapa: 'm-x-rojo',
                classTapaLeche: 'm-x-rojo-leche'
            },
            4: {
                codigo: 4,
                nombre: 'Pérdida por caries',
                classTapa: 'm-x-azul',
                classTapaLeche: 'm-x-azul-leche'
            },
            5: {
                codigo: 5,
                nombre: 'Pérdida (otra causa)',
                classTapa: 'm-x-rojo',
                classTapaLeche: 'm-x-rojo-leche'
            },
            6: {
                codigo: 6,
                nombre: 'Endodoncia Necesaria',
                classTapa: 'm-endo-rojo',
                classTapaLeche: 'm-endo-rojoleche'
            },
            7: {
                codigo: 7,
                nombre: 'Endodoncia Realizada',
                classTapa: 'm-endo-azul',
                classTapaLeche: 'm-endo-azulleche'
            },
            8: {codigo: 8, nombre: 'Prótesis Fija', cssClass: ''},
            9: {codigo: 9, nombre: 'Prótesis Removible', cssClass: ''},
            10: {codigo: 10, nombre: 'Prótesis Total', cssClass: ''},
            11: {
                codigo: 11,
                nombre: 'Corona Necesaria',
                classTapa: 'm-corona-rojo',
                classTapaLeche: 'm-corona-rojoleche'
            },
            12: {
                codigo: 12,
                nombre: 'Corona Realizada',
                classTapa: 'm-corona-azul',
                classTapaLeche: 'm-corona-azulleche'
            },
            13: {codigo: 13, nombre: 'Obturado', cssClass: 'fondoazul'},
            14: {codigo: 14, nombre: 'Caries', cssClass: 'fondorojo'},
            15: {
                codigo: 15, nombre: 'Implante', classTapa: 'implante',
                classTapaLeche: 'implante'
            },
            16: {codigo: 16, nombre: 'Caries', cssClass: 'caries-pequeño'},
            17: {codigo: 17, nombre: 'Caries', cssClass: 'caries-mediano'}

        };
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
                t: {estilos: {}},
                b: {estilos: {}},
                l: {estilos: {}},
                r: {estilos: {}},
                c: {estilos: {}},
                tapaVisible: false,
                classTapa: '',
                tools: [],
                texto: '',
                cdr: cudr,
                estado: 0
            };
            array.push(diente);
        }
    }

    getBadgeStatus(diente: any) {
        let status = 'secondary';
        const estado = diente.estado ? diente.estado : 0;
        switch (estado) {
            case 0:
                status = 'secondary';
                break;
            case 1:
                status = 'danger';
                break;
            case 2:
                status = 'success';
                break;
            case 3:
                status = 'info';
                break;
            default:
                status = 'secondary';
                break;
        }
        return status;
    }

    getCssClass(estilos) {
        return Object.values(estilos);
    }

    loadDientes() {
        this.dientesA = [];
        this.dientesB = [];
        this.dientesC = [];
        this.dientesD = [];
        this.dientesLecheA = [];
        this.dientesLecheB = [];
        this.dientesLecheC = [];
        this.dientesLecheD = [];
        const numDientes = 8;
        const numDientesNiño = 5;
        this.auxLoadDientes(18, this.dientesA, -1, numDientes, 'A');
        this.auxLoadDientes(21, this.dientesB, 1, numDientes, 'B');
        this.auxLoadDientes(48, this.dientesC, -1, numDientes, 'C');
        this.auxLoadDientes(31, this.dientesD, 1, numDientes, 'D');

        this.auxLoadDientes(55, this.dientesLecheA, -1, numDientesNiño, 'A');
        this.auxLoadDientes(61, this.dientesLecheB, 1, numDientesNiño, 'B');
        this.auxLoadDientes(85, this.dientesLecheC, -1, numDientesNiño, 'C');
        this.auxLoadDientes(71, this.dientesLecheD, 1, numDientesNiño, 'D');

        this.dentadura = {
            A: this.dientesA, B: this.dientesB, C: this.dientesC, D: this.dientesD,
            lA: this.dientesLecheA, lB: this.dientesLecheB, lC: this.dientesLecheC, lD: this.dientesLecheD
        };
    }

    loadDientesFromDb(dentadura: any) {
        this.dentadura = dentadura;
        this.updateTextos();
    }

    clearDienteCssTBLRC(diente: any) {
        diente.t = {estilos: [], tools: {}};
        diente.b = {estilos: [], tools: {}};
        diente.l = {estilos: [], tools: {}};
        diente.r = {estilos: [], tools: {}};
        diente.c = {estilos: [], tools: {}};
        diente.tools = [];
    }

    auxToggleClass(diente: any, lado: string) {
        let cssclass = this.selectedCssClass;
        if (this.toolSelected) {
            if (this.operacionCapa) {
                this.clearDienteCssTBLRC(diente);
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
                if (cssclass === 'fondorojo' || cssclass === 'caries-pequeño' || cssclass === 'caries-mediano') {
                    if (this.arrayUtil.contains(Object.values(estilos), 'fondoazul')) {
                        cssprop = 'borde';
                        cssclass = 'borderojo';
                    }
                }
                if (diente[lado].estilos[cssprop]) {
                    delete diente[lado].estilos[cssprop];
                } else {
                    diente[lado].estilos[cssprop] = cssclass;
                }
            }

            this.updateTextos();
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
        return this.codSelectedTool === idTool ? 'btn-success' : 'btn-outline-secondary';
    }

    getCodToolFromEstilo(estilo: string) {
        let codtool = 0;
        switch (estilo) {
            case 'fondoazul':
                codtool = 13;
                break;
            case 'fondorojo':
                codtool = 14;
                break;
            case 'borderojo':
                codtool = 14;
                break;
            default:
                codtool = 14;
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

    getDescLadoDiente(diente: any, lado: string) {
        const cuadrante = diente.cdr;
        let config;
        switch (cuadrante) {
            case 'A':
                config = this.configA;
                break;
            case 'B':
                config = this.configB;
                break;
            case 'C':
                config = this.configC;
                break;
            case 'D':
                config = this.configD;
                break;
            default:
                config = this.configA;
                break;
        }
        if (config) {
            return config[lado];
        }
        return 'Lado';
    }

    getTextoLadoDiente(diente: any, lado: string) {
        let result = '<i>' + this.getDescLadoDiente(diente, lado) + '</i>:';
        const toolstring = [];
        Object.values(diente[lado].estilos).forEach(tool => {
            if (tool) {
                const idtool = this.getCodToolFromEstilo(tool.toString());
                if (this.tools[idtool]) {
                    toolstring.push(this.tools[idtool].nombre);
                }
            }
        });
        result += toolstring.join();
        return result + '  ';
    }

    getTextoDienteModif(diente: any): string {
        let result = '<b>' + diente.numero + ': </b>';
        if (diente.tools.length > 0) {
            const toolstring = [];
            diente.tools.forEach(tool => {
                if (tool) {
                    toolstring.push(this.tools[tool].nombre);
                }
            });
            result += toolstring.join();
        }

        if (Object.values(diente.t.estilos).length > 0) {
            result += this.getTextoLadoDiente(diente, 't');
        }
        if (Object.values(diente.b.estilos).length > 0) {
            result += this.getTextoLadoDiente(diente, 'b');
        }
        if (Object.values(diente.l.estilos).length > 0) {
            result += this.getTextoLadoDiente(diente, 'l');
        }
        if (Object.values(diente.r.estilos).length > 0) {
            result += this.getTextoLadoDiente(diente, 'r');
        }
        if (Object.values(diente.c.estilos).length > 0) {
            result += this.getTextoLadoDiente(diente, 'c');
        }
        if (diente.texto.trim().length > 0) {
            result += ' ' + diente.texto;
        }
        return result;
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

    getTextoBloqueDent(arrayDent: Array<any>): string {
        const dientesstring = [];
        arrayDent.forEach(diente => {
            if (this.isDienteModif(diente)) {
                const textoDiente = this.getTextoDienteModif(diente);
                dientesstring.push(textoDiente);
            }
        });
        return dientesstring.join('<br>');
    }

    clickTapaDiente(diente: any) {
        diente.tapaVisible = false;
        diente.classTapa = '';
    }

    updateTextos() {
        this.textos.a = this.getTextoBloqueDent(this.dentadura.A) + '<br>' + this.getTextoBloqueDent(this.dentadura.lA);
        this.textos.b = this.getTextoBloqueDent(this.dentadura.B) + '<br>' + this.getTextoBloqueDent(this.dentadura.lB);
        this.textos.c = this.getTextoBloqueDent(this.dentadura.lC) + '<br>' + this.getTextoBloqueDent(this.dentadura.C);
        this.textos.d = this.getTextoBloqueDent(this.dentadura.lD) + '<br>' + this.getTextoBloqueDent(this.dentadura.D);
        this.messageToEmit.emit(JSON.stringify(this.dentadura));
    }

    onContextMenuDiente(diente: any, event: MouseEvent) {
        this.loadContexMenu(diente);
        this.contextMenuDiente.show();
        const offset = $(event.target).offset();
        offset.top += 10;
        offset.left += 10;
        $('#contextmenumj').offset(offset);
        return false;
    }


}
