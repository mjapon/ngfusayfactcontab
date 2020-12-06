import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MenuItem} from 'primeng';
import {ToolsDienteService} from '../../../services/toolsdiente.service';

declare var $: any;

@Component({
    selector: 'app-grppiezadent',
    template: `
        <div style="display: inline-block" class="dntc_{{diente.numero}}"
             (contextmenu)="onContextMenuDiente(diente, $event)"
             (mouseenter)="onmousenter()"
             (mouseleave)="onmouseleave()"
             [title]="titulo">
            <div class="d-flex flex-column align-items-center">
                <app-numpiezadent [diente]="diente"></app-numpiezadent>
                <app-piezadental [diente]="diente"
                                 (ondienteclic)="raiseClicEvent(diente)"></app-piezadental>
                <app-caraspd [diente]="diente" (ondienteclic)="raiseClicEvent(diente)"></app-caraspd>
            </div>
        </div>
    `
})
export class GrppiezadentComponent {
    @Input() diente: any;
    @Input() menuItemsDiente: MenuItem[];
    @Input() contextMenuDiente: any;
    @Output() ongrpdntclic = new EventEmitter<any>();
    titulo: string;
    loaded: boolean;

    constructor(private dienteServ: ToolsDienteService) {
        this.loaded = false;
    }

    onmousenter() {
        if (!this.loaded) {
            this.titulo = this.getTitulo();
            this.loaded = true;
        }
    }

    onmouseleave() {
        this.loaded = false;
    }

    dienteIsProt() {
        return this.dienteServ.dienteIsProt(this.diente);
    }

    getTitulo() {
        if (this.diente) {
            let titulo = this.diente.texto ? this.diente.texto : '';
            if (this.dienteIsProt()) {
                const tipoProtesis = this.dienteServ.getTipoProtesis(this.diente);
                if (tipoProtesis) {
                    titulo += ' Protesis ' + tipoProtesis.label;
                }
            }
            return titulo;
        }
        return '';
    }

    raiseClicEvent($event: MouseEvent) {
        if (!this.dienteIsProt()) {
            this.ongrpdntclic.emit(this.diente);
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
        }
    }

    cambiarEstadoExterno(event) {
        const diente = event.item.state;
        const msg = '¿Confirma marca tratamiento externo?';
        const estadoDiente = diente.estado ? diente.estado : 0;
        if (estadoDiente === 0) {
            if (confirm(msg)) {
                diente.estado = 3;
            }
        }
    }

    /*
    showSetTextoDiente(event: any) {
        const diente = event.item.state;
        const obsdiente = diente.texto ? diente.texto : '';
        const textodiente = prompt('Observación', obsdiente);
        if (textodiente) {
            diente.texto = textodiente.trim();
        }
    }
     */

    loadContexMenu(diente) {
        this.menuItemsDiente.splice(0, this.menuItemsDiente.length);
        const estadoDiente = diente.estado ? diente.estado : 0;
        let txtestado = '';
        let addCambiaEstado = false;
        if (estadoDiente === 0 || estadoDiente === 2 || estadoDiente === 3) {
            txtestado = 'Tratamiento pendiente';
            addCambiaEstado = true;
        } else if (estadoDiente === 1) {
            txtestado = 'Tratamiento realizado';
            addCambiaEstado = true;
        }
        // tslint:disable-next-line:prefer-const
        let self = this;
        const auxmenuitems = [];

        if (addCambiaEstado) {
            auxmenuitems.push({
                label: txtestado,
                command: (event => {
                    event.context = self;
                    self.cambiarEstadoDiente(event);
                }),
                state: diente
            });
        }

        if (estadoDiente === 0) {
            txtestado = 'Tratamiento Externo';
            auxmenuitems.push({
                label: txtestado,
                command: (event => {
                    event.context = self;
                    self.cambiarEstadoExterno(event);
                }),
                state: diente
            });
        }

        this.menuItemsDiente.push(
            {
                label: 'Pieza Dental Nro:' + this.diente.numero,
                items: auxmenuitems
            }
        );
        /*
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
        }*/
    }

    onContextMenuDiente(diente: any, event: MouseEvent) {
        this.loadContexMenu(diente);
        const offset = $(event.target).offset();
        offset.top += 10;
        offset.left += 10;
        const idctxmenu = '#contextmenumj';
        $(idctxmenu).offset(offset);
        this.contextMenuDiente.show();
        return false;
    }
}
