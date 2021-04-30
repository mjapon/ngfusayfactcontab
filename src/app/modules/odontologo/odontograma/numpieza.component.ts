import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-numpiezadent',
    template: `
        <span class="hand badge badge-{{getBadgeStatus(diente)}} numdiente">
                                <span *ngIf="diente.texto" class="text-warning">!</span>
            {{diente.numero}}
                            </span>
    `
})
export class NumpiezaComponent {
    @Input() diente: any;

    constructor() {

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
}
