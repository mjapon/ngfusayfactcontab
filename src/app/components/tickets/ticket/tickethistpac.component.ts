import {BaseComponent} from '../../shared/base.component';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TicketService} from '../../../services/ticket.service';

@Component({
    selector: 'app-tkhistpac',
    template: `
        <div>
            <h5>Historial atenciones <span class="badge rounded-pill text-bg-primary">{{ historia.length }}</span></h5>
            <div class="table-responsive">
                <table class="table table-sm table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Dia</th>
                        <th scope="col">Sección</th>
                        <th scope="col">Servicio</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let row of historia">
                        <td>
                            {{ historia.indexOf(row) + 1 }}
                        </td>
                        <td>
                            {{ row['tk_dia'] }}
                        </td>
                        <td>
                            {{ row['sec_nombre'] }}
                        </td>
                        <td>
                            {{ row['servicios'] }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
})
export class TickethistpacComponent extends BaseComponent implements OnChanges {

    @Input() codpac;
    historia: Array<any> = [];

    constructor(private ticketService: TicketService) {
        super();
    }


    ngOnChanges(changes: SimpleChanges) {
        const changeCod = changes.codpac;
        if (changeCod.currentValue) {
            this.loadHistorico();
        }
    }

    loadHistorico() {
        this.historia = [];
        this.ticketService.listarHistPac(this.codpac).subscribe(res => {
            if (this.isResultOk(res)) {
                this.historia = res.histserv;
            }
        });
    }

}
