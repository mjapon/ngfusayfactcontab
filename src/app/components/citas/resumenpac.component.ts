import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
    selector: 'app-resumenpac',
    template: `
        <div class="card"
             *ngIf="paciente.per_id>0">
            <div class="card-body">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div style="padding:1px 15px !important; width: 10%">
                        <img src="assets/imgs/{{paciente.per_genero===2?'female.png':'male.png'}}"
                             alt="Avatar">
                    </div>
                    <div style="width: 90%">
                        <div class="d-flex flex-row">
                            <div class="w-50">
                                <h5 class="quitaPaddingMargin">
                                    {{paciente.per_nombres + ' ' + paciente.per_apellidos}}
                                </h5>
                                <h6 class="quitaPaddingMargin">
                                    {{paciente.per_ciruc}}
                                </h6>
                                <h6 class="quitaPaddingMargin">{{paciente.per_fechanac}} - {{paciente.per_edad.years}}
                                    año(s),{{paciente.per_edad.months}} mes(es),{{paciente.per_edad.days}} dia(s)</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link" href="#" [ngClass]="{'active':1===selectedMasterTab}"
                               (click)="selectMasterTab(1, $event)">
                                Ficha Clínica</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" [ngClass]="{'active':2===selectedMasterTab}"
                               (click)="selectMasterTab(2, $event)">
                                Plan de Tratamiento</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" [ngClass]="{'active':3===selectedMasterTab}"
                               (click)="selectMasterTab(3, $event)">
                                Facturación y Pagos</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link" href="#" [ngClass]="{'active':4===selectedMasterTab}"
                               (click)="selectMasterTab(4, $event)">
                                <i class="fa fa-calendar"></i>
                                Dar Cita</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" (click)="cerrar($event)">
                                <i class="fa fa-times"></i>
                                Cerrar</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
})
export class ResumenPacienteComponent implements OnInit {
    @Input() paciente: any;
    @Output() evSelectMasterTab = new EventEmitter<any>();
    @Output() evCerrarResumen = new EventEmitter<any>();
    @Input() selectedMasterTab: number;

    constructor(private lclStrgServ: LocalStorageService) {

    }

    ngOnInit(): void {
        this.selectedMasterTab = 1;
    }

    selectMasterTab(tab: number, event: Event) {
        if (tab === 4) {
            this.lclStrgServ.setItem('PAC_FOR_CAL', JSON.stringify(this.paciente));
        }
        this.selectedMasterTab = tab;
        event.preventDefault();
        this.evSelectMasterTab.emit(tab);
    }

    cerrar(event: MouseEvent) {
        event.preventDefault();
        this.evCerrarResumen.emit();
    }
}

