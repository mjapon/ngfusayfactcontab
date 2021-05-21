import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {PersonaService} from '../../../../services/persona.service';
import {DomService} from '../../../../services/dom.service';
import {SwalService} from '../../../../services/swal.service';
import {FacturasmsgService} from '../../../../services/facturasmsg.service';

@Component({
    selector: 'app-factpagos',
    templateUrl: './factpagos.component.html'
})
export class FactpagosComponent implements OnInit, OnChanges {
    facturasList: Array<any>;
    isShowFormCreaFact: boolean;
    formfact: any;
    formpersona: any;
    currentdate: any;
    isShowDetallesFactura: boolean;
    codFacturaSel: number;
    loadingFacturas: boolean;
    tracodigofact = 1;
    totales: any = {};

    @Input() codpaciente: number;
    @Input() clase: number;

    @Output() evDeudasChange = new EventEmitter<any>();

    constructor(private asientoServ: AsientoService,
                private personaService: PersonaService,
                private domService: DomService,
                private swalService: SwalService,
                private facturaMsgService: FacturasmsgService) {
    }

    ngOnInit(): void {
        this.facturasList = [];
        this.isShowFormCreaFact = false;
        this.formpersona = {};
        this.currentdate = new Date();
        this.isShowDetallesFactura = false;
        this.codFacturaSel = null;
        this.loadingFacturas = true;
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
                this.totales = res.totales;
            }
        });
    }

    loadFacturasCreditos() {
        this.loadFacturas();
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

    oncancelarCreaFact($event: any) {
        this.isShowFormCreaFact = false;
    }

    onguardarFact($event: any) {
        this.isShowFormCreaFact = false;
        this.loadFacturas();
        this.evDeudasChange.emit($event);
    }

    onformloaded($event: any) {
        this.facturaMsgService.publishMessage({tipo: 1, form_persona: this.formpersona});
    }

    closeModalFact() {
        this.isShowDetallesFactura = false;
    }

    onTotalUpdated($event: any) {

    }
}
