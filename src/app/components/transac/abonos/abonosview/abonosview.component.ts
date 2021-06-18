import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbonoService} from '../../../../services/abono.service';
import {CreditoService} from '../../../../services/credito.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {DomService} from '../../../../services/dom.service';
import {SwalService} from '../../../../services/swal.service';
import {AsientoService} from '../../../../services/asiento.service';

@Component({
    selector: 'app-abonosview',
    templateUrl: './abonosview.component.html'
})
export class AbonosviewComponent implements OnInit, OnChanges {

    @Input() codFactura: number;
    @Input() codCredito: number;
    @Output() evDeudaChange = new EventEmitter<any>();
    @Output() evCerrar = new EventEmitter<any>();

    isShowFactura: boolean;
    isShowFormAbonar: boolean;
    datosFactura: any;
    datosCredito: any;

    formAbono: any;
    valorabono: number;
    ctaCodigoCaja = 0;
    detallesabono: Array<any>;
    isShowAnim: boolean;
    isFacturaLoaded: boolean;
    doLoadFactura: boolean;
    abonosList: Array<any>;
    saldopendiente: number;
    totalabonos: number;
    isTransaccFact = false;

    tracodabono = 0;
    isShowAsiento = false;
    pagosef: Array<any> = [];

    constructor(private abonoService: AbonoService,
                private domService: DomService,
                private swalService: SwalService,
                private loadingService: LoadingUiService,
                private asientoService: AsientoService,
                private creditoService: CreditoService) {
    }

    ngOnInit(): void {
        this.isShowAnim = true;
        this.isFacturaLoaded = false;
        this.doLoadFactura = false;
        this.abonosList = [];
        this.totalabonos = 0.0;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const codFacturaChange = changes.codFactura;
        if (codFacturaChange.currentValue && codFacturaChange.currentValue > 0) {
            this.doLoadFactura = true;
        }

        const codCreditoChange = changes.codCredito;
        if (codCreditoChange.currentValue && codCreditoChange.currentValue > 0) {
            this.loadDatosCredito();
        }
    }

    onFacturaLoaded($event) {
        this.isFacturaLoaded = true;
        this.datosFactura = $event;
        const tracod = this.datosFactura.tasiento.tra_codigo;
        this.isTransaccFact = tracod === 1 || tracod === 2 || tracod === 7;
    }

    loadDatosCredito() {
        this.isShowAnim = true;
        this.creditoService.getDatosCredito(this.codCredito).subscribe(res => {
            if (res.status === 200) {
                this.datosCredito = res.datoscred;
                if (this.datosCredito.ic_clasecc === 'XC') {
                    this.tracodabono = 8;
                } else if (this.datosCredito.ic_clasecc === 'XP') {
                    this.tracodabono = 9;
                }
                this.isShowAnim = false;
            }
        });
        this.loadAbonos();
    }

    buildDetalles() {
        this.detallesabono = [];
        const formCred = this.domService.clonarObjeto(this.formAbono.formdet);
        const formAbono = this.domService.clonarObjeto(this.formAbono.formdet);

        formCred.cta_codigo = this.datosCredito.cta_codigo;
        formCred.dt_debito = formAbono.dt_debito * -1;
        formCred.dt_valor = this.valorabono;
        formCred.per_codigo = this.datosCredito.per_id;
        formCred.ic_clasecc = this.datosCredito.ic_clasecc;
        formCred.dt_codcred = this.datosCredito.dt_codigo;

        formAbono.dt_valor = this.valorabono;
        formAbono.per_codigo = this.datosCredito.per_id;
        formAbono.cta_codigo = this.ctaCodigoCaja;

        this.detallesabono.push(formCred);
        this.detallesabono.push(formAbono);
    }

    showFormAbonar() {
        this.loadingService.publishBlockMessage();
        this.valorabono = 0.0;
        this.saldopendiente = this.datosCredito.cre_saldopen;
        this.detallesabono = [];
        this.ctaCodigoCaja = 0;
        this.abonoService.getform(this.tracodabono).subscribe(res => {
            this.isShowFormAbonar = true;
            if (res.status === 200) {
                this.formAbono = res.form;
                this.pagosef = this.formAbono.pagosef;
                this.ctaCodigoCaja = this.formAbono.formdet.cta_codigo;
                this.domService.setFocusTm('montoaboinput', 100);
            }
        });
    }

    onValorAbonoChange($event) {
        let auxsaldopendiente = this.datosCredito.cre_saldopen;
        try {
            if (this.valorabono.toString().trim().length > 0) {
                const valorAbono = Number(this.valorabono);
                if (valorAbono && valorAbono >= 0) {
                    auxsaldopendiente = (this.datosCredito.cre_saldopen - valorAbono).toFixed(2);
                } else {
                    this.swalService.fireToastError('Valor del abono incorrecto');
                }
            }
        } catch (e) {
            console.log('Error al calcular saldo pendiente');
        }
        this.saldopendiente = auxsaldopendiente;
    }

    guardarAbono() {
        this.buildDetalles();
        const formpost = {
            formcab: this.formAbono.formcab,
            per_codigo: this.datosCredito.per_id,
            detalles: this.detallesabono
        };
        const msg = '¿Confirma que desea registrar este abono?';
        if (confirm(msg)) {
            this.loadingService.publishBlockMessage();
            this.abonoService.crear(formpost).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.isShowFormAbonar = false;
                    this.loadDatosCredito();
                    this.evDeudaChange.emit('');
                }
            });
        }
    }

    cancelarGuardaAbono() {
        this.isShowFormAbonar = false;
    }

    showFactura() {
        const tracod = this.datosFactura.tasiento.tra_codigo;
        const isfactura = tracod === 1 || tracod === 2 || tracod === 7;

        if (isfactura) {
            this.isShowFactura = true;
        } else {
            this.isShowAsiento = true;
        }
    }

    anularAbono(abono) {
        const msg = '¿Confirma que desea anular este abono?';
        if (confirm(msg)) {
            this.abonoService.anularAbono(abono.abo_codigo, '').subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadAbonos();
                    this.loadDatosCredito();
                    this.evDeudaChange.emit('');
                }
            });
        }
    }

    loadAbonos() {
        this.totalabonos = 0.0;
        this.abonosList = [];
        this.abonoService.listaAbonosFact(this.codFactura).subscribe(res => {
            if (res.status === 200) {
                this.abonosList = res.abonos;
                this.totalabonos = res.total;
            }
        });
    }

    closeDetallesFact() {
        this.isShowFactura = false;
    }

    hideDetAsi() {
        this.isShowAsiento = false;
    }

    cerrarView() {
        this.evCerrar.emit('');
    }
}
