import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {endOfMonth, startOfMonth, startOfWeek, startOfYear, subMonths} from 'date-fns';

@Component({
    selector: 'app-rangofechas',
    template: `
        <div class="d-flex">
            <div>
                <div class="d-flex" *ngIf="showlabels">
                    <p class="quitaPaddingMargin fw-light">Desde:</p>
                </div>
                <div class="p-fluid">
                    <p-calendar [showIcon]="showicons"
                                styleClass="p-inputtext-sm"
                                [(ngModel)]="form.desde"
                                [monthNavigator]="true" [yearNavigator]="true"
                                (ngModelChange)="onDesdeChange()"
                                yearRange="2019:2050"
                                dateFormat="dd/mm/yy"></p-calendar>
                </div>
            </div>
            <div>
                <div class="d-flex justify-content-between" *ngIf="showlabels">
                    <p class="quitaPaddingMargin fw-light">Hasta:</p>
                </div>
                <div class="p-fluid d-flex">
                    <p-calendar [showIcon]="showicons"
                                [(ngModel)]="form.hasta"
                                styleClass="p-inputtext-sm"
                                [monthNavigator]="true" [yearNavigator]="true" [minDate]="form.desde"
                                (ngModelChange)="onHastaChange()"
                                yearRange="2019:2050"
                                dateFormat="dd/mm/yy"></p-calendar>


                    <div class="ms-1 btn-group btn-group-sm dropend">
                        <button class="btn btn-light dropdown-toggle" style="padding: 5px 1px !important;"
                                type="button"
                                id="dropdownMB"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-filter"></i>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMB">
                            <a href="#" (click)="doFilterFec(5, $event)" class="dropdown-item"> Hoy </a>
                            <a href="#" (click)="doFilterFec(1, $event)" class="dropdown-item"> Esta Semana </a>
                            <a href="#" (click)="doFilterFec(2, $event)" class="dropdown-item"> Este Mes </a>
                            <a href="#" (click)="doFilterFec(3, $event)" class="dropdown-item"> Mes anterior </a>
                            <a href="#" (click)="doFilterFec(4, $event)" class="dropdown-item"> Este Año </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ApprangofechasComponent implements OnInit {

    @Input() form: any;
    @Input() showicons = false;
    @Input() showlabels = true;

    @Output() evDesdeChange = new EventEmitter<any>();
    @Output() evHastaChange = new EventEmitter<any>();
    @Output() evFilterSel = new EventEmitter<any>();

    ngOnInit(): void {
    }

    doFilterFec(tipo: number, event) {
        event.preventDefault();
        const hoy = new Date();
        let start = hoy;
        let end = hoy;
        if (tipo === 1) {// Esta semana
            start = startOfWeek(hoy);
        } else if (tipo === 2) {// Este mes
            start = startOfMonth(hoy);
        } else if (tipo === 3) {// Mes anterior
            start = startOfMonth(subMonths(hoy, 1));
            end = endOfMonth(start);
        } else if (tipo === 4) {// Este año
            start = startOfYear(hoy);
        } else if (tipo === 5) {// Hoy
            start = hoy;
        }
        this.form.desde = start;
        this.form.hasta = end;
        this.evFilterSel.emit(tipo);
    }

    onDesdeChange() {
        this.evDesdeChange.emit(this.form.desde);
    }

    onHastaChange() {
        this.evHastaChange.emit(this.form.hasta);
    }

}
