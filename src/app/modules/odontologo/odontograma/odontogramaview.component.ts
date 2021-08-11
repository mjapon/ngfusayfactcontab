import {BaseComponent} from '../../../components/shared/base.component';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OdontogramaService} from '../../../services/odontograma.service';

@Component({
    selector: 'app-odontogramaview',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div class="row" *ngIf="!isLoading">
                <div class="col">
                    <div class="row">
                        <div id="tr" class="col-6 text-end">
                            <ng-container *ngFor="let diente of dentadura.A">
                                <app-grppiezadent [diente]="diente"
                                                  [estilo]="allcssobj[diente.numero]"></app-grppiezadent>
                            </ng-container>
                        </div>
                        <div id="tl" class="col-6">
                            <ng-container *ngFor="let diente of dentadura.B">
                                <app-grppiezadent [diente]="diente"
                                                  [estilo]="allcssobj[diente.numero]"></app-grppiezadent>
                            </ng-container>
                        </div>

                        <div id="br" class="col-6 text-end" style="padding-top: 30px">
                            <ng-container *ngFor="let diente of dentadura.C">
                                <app-grppiezadent [diente]="diente"
                                                  [estilo]="allcssobj[diente.numero]"></app-grppiezadent>
                            </ng-container>
                        </div>
                        <div id="bl" class="col-6" style="padding-top: 30px">
                            <ng-container *ngFor="let diente of dentadura.D">
                                <app-grppiezadent [diente]="diente"
                                                  [estilo]="allcssobj[diente.numero]"></app-grppiezadent>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class OdontogramaviewComponent extends BaseComponent implements OnChanges, OnInit {

    @Input() codHistoOd: number;

    allcssobj = {};
    dentadura: any;

    constructor(private odontoService: OdontogramaService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const changeCod = changes.codHistoOd;
        if (changeCod.currentValue) {
            this.loadDatosOd();
        } else {
            this.clear();
        }
    }

    loadCss() {
        this.odontoService.getCss().subscribe(rescss => {
            if (rescss.status === 200) {
                this.allcssobj = rescss.css;
            }
        });
    }

    private loadDatosOd() {
        this.turnOnLoading();
        this.odontoService.getOdontoHisto(this.codHistoOd).subscribe(res => {
            if (this.isResultOk(res)) {
                const datosodon = res.datosodon;
                this.setupOdontograma(datosodon.odh_odontograma);
            }
            this.turnOffLoading();
        });
    }

    setupOdontograma(odontograma) {
        this.dentadura = [];
        if (odontograma) {
            this.dentadura = JSON.parse(odontograma);
        }
    }

    private clear() {
        this.dentadura = [];
    }

    ngOnInit(): void {
        this.loadCss();
    }
}
