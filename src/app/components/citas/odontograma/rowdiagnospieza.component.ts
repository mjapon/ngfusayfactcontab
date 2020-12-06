import {Component, Input, OnInit} from '@angular/core';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {ToolsDienteService} from '../../../services/toolsdiente.service';

@Component({
    selector: 'app-diagnospieza',
    template: `
        <div class=" d-flex flex-wrap justify-content-start">
            <div class="d-flex flex-wrap justify-content-start"
                 *ngIf="itdiente.t.tools&&itdiente.t.tools.length>0">
                <div *ngFor="let idtool of itdiente.t.tools" class="m-1">
                                            <span class="p-1 border border-secondary rounded-left">
                                                {{getDescLadoDiente(itdiente, 't')}}:
                                                {{tools[idtool] ? tools[idtool].nombre : ''}}</span>
                    <span title="Quitar" (click)="quitarToolLado(itdiente, idtool,'t')"
                          class="hand border p-1 border-secondary rounded-right"> <i
                            class="fa fa-times-circle"></i> </span>
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start"
                 *ngIf="itdiente.b.tools&&itdiente.b.tools.length>0">
                <div *ngFor="let idtool of itdiente.b.tools" class="m-1">
                                            <span class="p-1 border border-secondary rounded-left">
                                                {{getDescLadoDiente(itdiente, 'b')}}:
                                                {{tools[idtool] ? tools[idtool].nombre : ''}}</span>
                    <span title="Quitar" (click)="quitarToolLado(itdiente, idtool,'b')"
                          class="hand border p-1 border-secondary rounded-right"> <i
                            class="fa fa-times-circle"></i> </span>
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start"
                 *ngIf="itdiente.l.tools&&itdiente.l.tools.length>0">
                <div *ngFor="let idtool of itdiente.l.tools" class="m-1">
                                            <span class="p-1 border border-secondary rounded-left">
                                                {{getDescLadoDiente(itdiente, 'l')}}:
                                                {{tools[idtool] ? tools[idtool].nombre : ''}}</span>
                    <span title="Quitar" (click)="quitarToolLado(itdiente, idtool,'l')"
                          class="hand border p-1 border-secondary rounded-right"> <i
                            class="fa fa-times-circle"></i> </span>
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start"
                 *ngIf="itdiente.r.tools&&itdiente.r.tools.length>0">
                <div *ngFor="let idtool of itdiente.r.tools" class="m-1">
                                            <span class="p-1 border border-secondary rounded-left">
                                                {{getDescLadoDiente(itdiente, 'r')}}:
                                                {{tools[idtool] ? tools[idtool].nombre : ''}}</span>
                    <span title="Quitar" (click)="quitarToolLado(itdiente, idtool,'r')"
                          class="hand border p-1 border-secondary rounded-right"> <i
                            class="fa fa-times-circle"></i> </span>
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start"
                 *ngIf="itdiente.c.tools&&itdiente.c.tools.length>0">
                <div *ngFor="let idtool of itdiente.c.tools" class="m-1">
                                            <span class="p-1 border border-secondary rounded-left">
                                                {{getDescLadoDiente(itdiente, 'c')}}:
                                                {{tools[idtool] ? tools[idtool].nombre : ''}}</span>
                    <span title="Quitar" (click)="quitarToolLado(itdiente, idtool,'c')"
                          class="hand border p-1 border-secondary rounded-right"> <i
                            class="fa fa-times-circle"></i> </span>
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start"
                 *ngIf="itdiente.tools&&itdiente.tools.length>0">
                <div *ngFor="let idtool of itdiente.tools" class="m-1">
                    <span class="p-1 border border-secondary rounded-left"> {{tools[idtool] ? tools[idtool].nombre : ''}}</span>
                    <span title="Quitar" (click)="quitarTool(itdiente, idtool)"
                          class="hand border p-1 border-secondary rounded-right"> <i
                            class="fa fa-times-circle"></i> </span>
                </div>
            </div>
        </div>
    `
})
export class RowdiagnospiezaComponent implements OnInit {

    @Input() itdiente: any;

    configA: any;
    configB: any;
    configC: any;
    configD: any;
    tools: any;

    constructor(private arrayUtil: ArrayutilService, private  toolsDienteServ: ToolsDienteService) {
        this.tools = this.toolsDienteServ.getTools();
        const configs = this.toolsDienteServ.getConfigs();
        this.configA = configs.configA;
        this.configB = configs.configB;
        this.configC = configs.configC;
        this.configD = configs.configD;
    }

    ngOnInit(): void {

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

    quitarToolLado(diente, idTool, lado) {
        this.arrayUtil.removeElement(diente[lado].tools, idTool);
        this.updateEstilosFromTools(diente, lado);
    }

    updateEstilosFromTools(diente, lado) {
        const tools = diente[lado].tools;
        const tieneObturado = this.arrayUtil.contains(tools, 13);
        diente[lado].estilos = [];
        const estilos = diente[lado].estilos;
        tools.forEach(idtool => {
            const escaries = idtool === 14 || idtool === 16 || idtool === 17;
            let prop = 'fondo';
            let estilo = this.getEstiloFromCodTool(idtool);
            if (tieneObturado && escaries) {
                prop = 'borde';
                estilo = 'caries-grande-borde';
            }
            estilos[prop] = estilo;
        });
    }

    getEstiloFromCodTool(codtool) {
        let estilo = '';
        switch (codtool) {
            case 14:
                estilo = 'caries-grande';
                break;
            case 16:
                estilo = 'caries-pequenio';
                break;
            case 17:
                estilo = 'caries-mediano';
                break;
            case 19:
                estilo = 'obturado-mediano';
                break;
            case 13:
                estilo = 'obturado-grande';
                break;
            default:
                estilo = '';
                break;
        }
        return estilo;
    }

    quitarTool(diente, idtool: any) {
        this.toolsDienteServ.checkUncheckTool(idtool, diente);
    }
}
