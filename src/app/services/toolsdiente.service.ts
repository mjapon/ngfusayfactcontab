import {Injectable} from '@angular/core';
import {ArrayutilService} from './arrayutil.service';

@Injectable({
    providedIn: 'root'
})
export class ToolsDienteService {
    tiposProtesis: any[];
    tools: any;

    constructor(private arrayUtil: ArrayutilService) {
        this.tiposProtesis = [
            {label: 'Fija', value: 1},
            {label: 'Removible', value: 2},
            {label: 'Total', value: 3}
        ];
        this.tools = {
            1: {
                codigo: 1,
                nombre: 'Sellante necesario',
                classTapa: 'm-aster-rojo',
                classTapaLeche: 'm-aster-rojo-leche',
                grupo: 1
            },
            2: {
                codigo: 2,
                nombre: 'Sellante realizado',
                classTapa: 'm-aster-azul',
                classTapaLeche: 'm-aster-azul-leche',
                grupo: 1
            },
            3: {
                codigo: 3,
                nombre: 'Extracción Indicada',
                classTapa: 'm-x-rojo',
                classTapaLeche: 'm-x-rojo-leche',
                grupo: 2
            },
            4: {
                codigo: 4,
                nombre: 'Pérdida por caries',
                classTapa: 'm-x-azul',
                classTapaLeche: 'm-x-azul-leche',
                grupo: 2
            },
            5: {
                codigo: 5,
                nombre: 'Pérdida (otra causa)',
                classTapa: 'm-x-rojo',
                classTapaLeche: 'm-x-rojo-leche',
                grupo: 2
            },
            6: {
                codigo: 6,
                nombre: 'Endodoncia Necesaria',
                classTapa: 'm-endo-rojo',
                classTapaLeche: 'm-endo-rojoleche',
                grupo: 3
            },
            7: {
                codigo: 7,
                nombre: 'Endodoncia Realizada',
                classTapa: 'm-endo-azul',
                classTapaLeche: 'm-endo-azulleche',
                grupo: 3
            },
            8: {codigo: 8, nombre: 'Prótesis Fija', cssClass: ''},
            9: {codigo: 9, nombre: 'Prótesis Removible', cssClass: ''},
            10: {codigo: 10, nombre: 'Prótesis Total', cssClass: ''},
            11: {
                codigo: 11,
                nombre: 'Corona Necesaria',
                classTapa: 'm-corona-rojo',
                classTapaLeche: 'm-corona-rojoleche',
                grupo: 4
            },
            12: {
                codigo: 12,
                nombre: 'Corona Realizada',
                classTapa: 'm-corona-azul',
                classTapaLeche: 'm-corona-azulleche',
                grupo: 4
            },
            13: {codigo: 13, nombre: 'Obturado', cssClass: 'obturado-grande'},
            14: {codigo: 14, nombre: 'Caries', cssClass: 'caries-grande'},
            15: {
                codigo: 15, nombre: 'Implante', classTapa: 'dienteproblemas',
                classTapaLeche: 'implante'
            },
            16: {codigo: 16, nombre: 'Caries Incipiente', cssClass: 'caries-pequenio'},
            17: {codigo: 17, nombre: 'Caries', cssClass: 'caries-mediano'},
            18: {codigo: 18, nombre: 'Diente Sano', classTapa: 'dientesano'},
            19: {codigo: 19, nombre: 'Obturado', cssClass: 'obturado-mediano'}
        };
    }

    getTools() {
        return this.tools;
    }

    getConfigs() {
        return {
            configA: {t: 'Vestibular', b: 'Palatino', l: 'Distal', r: 'Mesial', c: 'Oclusal'},
            configB: {t: 'Vestibular', b: 'Palatino', l: 'Mesial', r: 'Distal', c: 'Oclusal'},
            configC: {t: 'Lingual', b: 'Vestibular', l: 'Distal', r: 'Mesial', c: 'Oclusal'},
            configD: {t: 'Lingual', b: 'Vestibular', l: 'Mesial', r: 'Distal', c: 'Oclusal'}
        };
    }

    buscaPiezaDental(dentadura: any, numpieza: number) {
        let filtered = dentadura.A.filter(e => e.numero === numpieza);
        if (filtered.length > 0) {
            return filtered[0];
        } else {
            filtered = dentadura.B.filter(e => e.numero === numpieza);
            if (filtered.length > 0) {
                return filtered[0];
            } else {
                filtered = dentadura.C.filter(e => e.numero === numpieza);
                if (filtered.length > 0) {
                    return filtered[0];
                } else {
                    filtered = dentadura.D.filter(e => e.numero === numpieza);

                    if (filtered.length > 0) {
                        return filtered[0];
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    dienteIsProt(diente: any) {
        return diente.protesis ? diente.protesis > 0 : false;
    }

    getTipoProtesis(diente: any) {
        return this.tiposProtesis[diente.tipoprotesis - 1];
    }

    tieneHerramientaGrupo(idTool: number, diente: any) {
        const dtools = this.getTools();
        const tools = diente.tools;
        const tool = dtools[idTool];
        const result = [];
        const grupotool = tool.grupo;
        if (grupotool) {
            tools.forEach((idtoolit) => {
                const toolitem = dtools[idtoolit];
                if (toolitem && idtoolit !== idTool) {
                    if (toolitem.grupo && toolitem.grupo === grupotool) {
                        result.push(idtoolit);
                    }
                }
            });
        }
        return result;
    }

    checkUncheckTool(idTool: number, diente: any) {
        const dtools = this.getTools();
        const tools = diente.tools;
        if (tools.includes(idTool)) {
            this.arrayUtil.removeElement(tools, idTool);
        } else {
            tools.push(idTool);
        }

        const toolsgrupo = this.tieneHerramientaGrupo(idTool, diente);
        if (toolsgrupo.length > 0) {
            toolsgrupo.forEach(idtoolit => {
                this.arrayUtil.removeElement(tools, idtoolit);
            });
        }

        diente.tapaVisible = false;
        diente.classTapa = '';

        if (this.arrayUtil.contains(tools, 1) || this.arrayUtil.contains(tools, 2) || this.arrayUtil.contains(tools, 18)
            || this.arrayUtil.contains(tools, 3) || this.arrayUtil.contains(tools, 4)) {
            let thetool = 1;
            if (this.arrayUtil.contains(tools, 2)) {
                thetool = 2;
            }
            if (this.arrayUtil.contains(tools, 18)) {
                thetool = 18;
            }
            if (this.arrayUtil.contains(tools, 3)) {
                thetool = 3;
            }
            if (this.arrayUtil.contains(tools, 4)) {
                thetool = 4;
            }
            const tool = dtools[thetool];
            diente.tapaVisible = true;
            diente.classTapa = tool.classTapa;
        }
    }

    getTiposProtesis() {
        return this.tiposProtesis;
    }

    isShowTratExt(diente) {
        return true;
    }

    isShowTrataPend(diente) {
        return [0, 2, 3].includes(diente?.estado);
    }

    isShowTrataHecho(diente) {
        return diente?.estado === 1;
    }

    isShowTrataClear(diente) {
        const estado = diente?.estado || 0;
        return estado > 0;
    }

    changeState(diente): number {
        const currentState = diente.estado ? diente.estado : 0;
        let newState = 0;
        let msg = '';
        if ([0, 2, 3].includes(currentState)) {
            newState = 1;
            msg = ' iniciar tratamiento?';
        } else if (currentState === 1) {
            newState = 2;
            msg = ' marcar como tratamiento realizado?';
        }
        if (newState > 0) {
            if (confirm(`¿Confirma que desea ${msg}`)) {
                diente.estado = newState;
                return 1;
            }
        }
        return 0;
    }

    changeStateExt(diente): number {
        if (confirm('¿Confirma marca tratamiento externo?')) {
            diente.estado = 3;
            return 1;
        }
        return 0;
    }

    changeStateClear(diente): number {
        if (confirm('¿Confirma limpiar estado?')) {
            diente.estado = 0;
            return 1;
        }
        return 0;
    }

    getStrState(diente: any, isCeroStr = true) {
        const estados: Array<string> = [
            'Cambiar estado',
            'Tratamiento Iniciado',
            'Tratamiento finalizado',
            'Tratamiento externo'
        ];
        const state = diente?.estado || 0;
        if (!isCeroStr) {
            estados[0] = '';
        }
        return estados[state];
    }

    getColorState(diente: any) {
        const state = diente?.estado || 0;
        const colors = ['primary', 'warning', 'success', 'info'];
        return colors[state];
    }


}
