import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {PersonaService} from '../../../../services/persona.service';
import {DomService} from '../../../../services/dom.service';
import {SwalService} from '../../../../services/swal.service';
import {CreditoService} from '../../../../services/credito.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';
import {FacturasmsgService} from '../../../../services/facturasmsg.service';

@Component({
    selector: 'app-factpagos',
    templateUrl: './factpagos.component.html'
})
export class FactpagosComponent implements OnInit, OnChanges {
    facturasList: Array<any>;
    creditosList: Array<any>;
    isShowFormCreaFact: boolean;
    formfact: any;
    formpersona: any;
    currentdate: any;
    isShowDetallesFactura: boolean;
    isShowDetallesCredito: boolean;
    codFacturaSel: number;
    credsel: any;

    loadingFacturas: boolean;
    loadingCreditos: boolean;
    totalescred: any;

    tracodigofact = 1;

    @Input() codpaciente: number;
    @Input() clase: number;

    @Output() evDeudasChange = new EventEmitter<any>();

    constructor(private asientoServ: AsientoService,
                private personaService: PersonaService,
                private domService: DomService,
                private swalService: SwalService,
                private creditoService: CreditoService,
                private facturaMsgService: FacturasmsgService) {
    }

    ngOnInit(): void {
        this.facturasList = [];
        this.creditosList = [];
        this.isShowFormCreaFact = false;
        this.formpersona = {};
        this.currentdate = new Date();
        this.isShowDetallesFactura = false;
        this.codFacturaSel = null;
        this.loadingFacturas = true;
        this.loadingCreditos = true;
        this.totalescred = {};
        registerLocaleData(es);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.codpaciente;
        if (chng.currentValue) {
            this.loadFacturasCreditos();
            this.loadDatosPersona();
        }
    }

    loadDatosPersona() {
        this.personaService.buscarPorCodfull(this.codpaciente).subscribe(resper => {
            if (resper.status === 200) {
                this.formpersona = resper.persona;
            }
        });
    }

    loadFacturas() {
        this.loadingFacturas = true;
        this.asientoServ.auxListarFacturas(this.codpaciente, this.clase).subscribe(res => {
            this.loadingFacturas = false;
            if (res.status === 200) {
                this.facturasList = res.docs;
            }
        });
    }

    loadCreditos() {
        const tracod = 1;
        this.loadingCreditos = true;
        this.creditoService.listarCreditos(tracod, this.codpaciente, this.clase).subscribe(resc => {
            this.loadingCreditos = false;
            if (resc.status === 200) {
                this.creditosList = resc.creds;
                this.totalescred = resc.totales;
            }
        });
    }

    loadFacturasCreditos() {
        this.loadFacturas();
        this.loadCreditos();
    }

    showFormCreaFact(tracod, $event: MouseEvent) {
        $event.preventDefault();
        this.tracodigofact = tracod;
        this.formfact = {};
        this.isShowFormCreaFact = true;
    }

    showDetallesFactura(fila: any) {
        this.isShowDetallesFactura = true;
        this.codFacturaSel = fila.trn_codigo;
    }

    showDetallesCredito(fila: any) {
        this.credsel = fila;
        this.isShowDetallesCredito = true;
    }

    hideDetCredito() {
        this.isShowDetallesCredito = false;
        this.loadCreditos();
    }

    onDeudasChange($event: any) {
        this.evDeudasChange.emit($event);
    }

    onTotalUpdated($event: any) {
        console.log('on totales upd');
    }

    oncancelarCreaFact($event: any) {
        this.isShowFormCreaFact = false;
    }

    onguardarFact($event: any) {
        this.isShowFormCreaFact = false;
        this.loadFacturas();
        this.loadCreditos();
    }

    onformloaded($event: any) {
        this.facturaMsgService.publishMessage({tipo: 1, form_persona: this.formpersona});
    }

    closeModalFact() {
        this.isShowDetallesFactura = false;
    }
}
