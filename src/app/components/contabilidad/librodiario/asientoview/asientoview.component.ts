import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';

@Component({
    selector: 'app-asientoview',
    templateUrl: './asientoview.component.html',
    styles: [
        `
            .haberl {
                margin-left: 70px;
            }
        `]
})
export class AsientoviewComponent implements OnInit, OnChanges {

    @Input() trncod: number;
    @Output() evCerrar = new EventEmitter<any>();

    isLoading = false;
    datosasi: any = {};
    totales: any = {};
    detalles = [];
    datosfactrel: any = {};

    @Input() showBtns = true;
    isShowDocRel = false;
    isFactura = false;
    trncodrel = 0;

    constructor(private asientoService: AsientoService,
                private swalService: SwalService) {

    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.trncod;
        if (chng.currentValue) {
            this.loadDatosAsiento();
        }
    }

    loadDatosAsiento() {
        this.isLoading = true;
        this.asientoService.getDatosAsiContab(this.trncod).subscribe(res => {
            this.isLoading = false;
            this.datosasi = res.datoasi;
            this.totales = this.datosasi.totales;
            this.detalles = this.datosasi.detalles;
            this.datosfactrel = this.datosasi.factrel;
            if (this.datosfactrel) {
                this.trncodrel = this.datosfactrel.trn_codigo;
                this.isFactura = this.datosfactrel.isfact;
            }
        });
    }

    onCerraBtn() {
        this.evCerrar.emit('');
    }

    onAnularBtn() {
        this.swalService.fireToastSuccess('No implementado');
    }

    anular(fila: any) {
    }

    gotoEditAsiento(fila: any) {

    }

    toggleShowDocRel() {
        this.isShowDocRel = !this.isShowDocRel;
    }

    hideDocRel() {
        this.isShowDocRel = false;
    }
}
