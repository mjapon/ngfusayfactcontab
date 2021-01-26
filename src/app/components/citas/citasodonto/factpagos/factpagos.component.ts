import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {PersonaService} from '../../../../services/persona.service';
import {ArticuloService} from '../../../../services/articulo.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';
import {DomService} from '../../../../services/dom.service';
import {NumberService} from '../../../../services/number.service';
import {SwalService} from '../../../../services/swal.service';
import {FechasService} from '../../../../services/fechas.service';
import {CreditoService} from '../../../../services/credito.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
    selector: 'app-factpagos',
    templateUrl: './factpagos.component.html'
})
export class FactpagosComponent implements OnInit, OnChanges {
    facturasList: Array<any>;
    creditosList: Array<any>;
    isShowFormCreaFact: boolean;
    ttransacc: any;
    formaspago: Array<any>;
    formdet: any;
    artsFiltrados: Array<any>;
    detalles: Array<any>;
    impuestos: any;
    ivas: Array<any>;

    formfact: any;
    formpersona: any;
    totales: any;

    @Input()
    codpaciente: number;
    currentdate: any;
    isShowDetallesFactura: boolean;
    isShowDetallesCredito: boolean;
    codFacturaSel: number;
    credsel: any;

    loadingFacturas: boolean;
    loadingCreditos: boolean;
    totalescred: any;

    @Output() evDeudasChange = new EventEmitter<any>();

    constructor(private asientoServ: AsientoService,
                private personaService: PersonaService,
                private domService: DomService,
                private artService: ArticuloService,
                private numberService: NumberService,
                private fechasService: FechasService,
                private swalService: SwalService,
                private creditoService: CreditoService,
                private arrayService: ArrayutilService,
                private loadingUiServ: LoadingUiService) {
    }

    ngOnInit(): void {
        this.facturasList = [];
        this.creditosList = [];
        this.detalles = [];
        this.isShowFormCreaFact = false;
        this.formpersona = {};
        this.initformfact();
        this.ivas = this.numberService.getIvasArray();
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
        this.asientoServ.listarFacturas(this.codpaciente).subscribe(res => {
            this.loadingFacturas = false;
            if (res.status === 200) {
                this.facturasList = res.docs;
            }
        });
    }

    loadCreaditos() {
        const tracod = 1;
        this.loadingCreditos = true;
        this.creditoService.listarCreditos(tracod, this.codpaciente).subscribe(resc => {
            this.loadingCreditos = false;
            if (resc.status === 200) {
                this.creditosList = resc.creds;
                this.totalescred = resc.totales;
            }
        });
    }

    loadFacturasCreditos() {
        this.loadFacturas();
        this.loadCreaditos();
    }

    initformfact() {
        this.formfact = {};
        this.ttransacc = {};
        this.formaspago = [];
        this.formdet = {};
        this.totales = {};
        this.detalles = [];
    }

    showFormCreaFact() {
        const traCodigo = 1;
        const tdvCodigo = 1;
        this.initformfact();
        this.loadingUiServ.publishBlockMessage();
        this.asientoServ.getFormCab(traCodigo, tdvCodigo).subscribe(res => {
            if (res.status === 200) {
                this.formfact = res.formcab;
                this.formfact.trn_fecregobj = this.fechasService.parseString(this.formfact.trn_fecreg);
                this.ttransacc = res.ttransacc;
                this.formaspago = res.formaspago;
                this.formdet = res.formdet;
                this.impuestos = res.impuestos;
                this.numberService.setIva(this.impuestos.iva);
            }
            this.isShowFormCreaFact = true;
            this.domService.setFocusTimeout('artsAutoCom', 100);
        });
    }

    initTotales() {
        this.totales = {
            subtotal: 0.0,
            descuentos: 0.0,
            subtforiva: 0.0,
            iva: 0.0,
            total: 0.0
        };
    }

    totalizar() {
        this.initTotales();
        this.totales = this.numberService.totalizar(this.detalles);
        if (this.formaspago && this.formaspago.length > 0) {
            this.formaspago[0].dt_valor = this.totales.total;
        }
        if (this.formaspago && this.formaspago.length > 1) {
            this.formaspago[1].dt_valor = 0.0;
        }
    }

    showDetallesFactura(fila: any) {
        this.isShowDetallesFactura = true;
        this.codFacturaSel = fila.trn_codigo;
    }

    showDetallesCredito(fila: any) {
        this.credsel = fila;
        this.isShowDetallesCredito = true;
    }

    getNewEmptyRow(art) {
        const formDetalles = this.domService.clonarObjeto(this.formdet);
        let precio = art.icdp_precioventa;
        let ivaval = 0.0;
        if (art.icdp_grabaiva) {
            precio = this.numberService.ponerIva(art.icdp_precioventa);
            ivaval = this.numberService.getValorIva(art.icdp_precioventa);
        }
        formDetalles.icdp_grabaiva = art.icdp_grabaiva;
        formDetalles.art_codigo = art.ic_id;
        formDetalles.ic_nombre = art.ic_nombre;
        formDetalles.dt_precio = art.icdp_precioventa;
        formDetalles.dt_precioiva = precio;
        formDetalles.per_codigo = this.codpaciente;
        formDetalles.dt_cant = 1;
        formDetalles.dt_decto = 0.0;
        formDetalles.dai_impg = art.icdp_grabaiva ? this.numberService.getIva() : 0.0;
        formDetalles.subtotal = formDetalles.dt_cant * formDetalles.dt_precio;
        formDetalles.subtforiva = formDetalles.subtotal - formDetalles.dt_decto;
        formDetalles.ivaval = ivaval;
        formDetalles.total = formDetalles.subtotal + ivaval;
        formDetalles.dt_valor = formDetalles.subtforiva;
        return formDetalles;
    }

    recalcTotalFila(fila) {
        this.numberService.recalcTotalFila(fila);
        this.totalizar();
    }

    buscaServs(event) {
        this.artService.buscaServDentales(event.query).subscribe(res => {
            if (res.status === 200) {
                this.artsFiltrados = res.items;
            }
        });
    }

    onServSelect($event: any) {
        const prevserv = this.arrayService.getFirstResult(this.detalles, (it) => it.art_codigo === $event.ic_id);
        if (prevserv) {
            prevserv.dt_cant += 1;
            this.recalcTotalFila(prevserv);
        } else {
            this.detalles.push(this.getNewEmptyRow($event));
        }
        this.totalizar();

        this.formdet.servicio = {};
        this.domService.setFocusTimeout('artsAutoCom', 100);
    }

    quitarItem(fila: any) {
        const msg = '¿Seguro que desea quitar este item de la factura?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.arrayService.removeElement(this.detalles, fila);
                    this.totalizar();
                }
            }
        );
    }

    crearFactura() {
        if (this.detalles.length === 0) {
            this.swalService.fireToastError('Debe agregar productos o servicios a la factura');
        } else if (!this.formfact.trn_fecregobj) {
            this.swalService.fireToastError('Debe especificar la fecha de la factura');
        } else {
            this.formfact.trn_fecreg = this.fechasService.formatDate(this.formfact.trn_fecregobj);
            const form = {
                form_cab: this.formfact,
                form_persona: this.formpersona,
                detalles: this.detalles,
                pagos: this.formaspago,
                totales: this.totales
            };

            const msg = '¿Seguro que desea crear la factura?';
            this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.loadingUiServ.publishBlockMessage();
                    this.asientoServ.crearDocumento(form).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.isShowFormCreaFact = false;
                            this.loadFacturas();
                            this.loadCreaditos();
                        }
                    });
                }
            });
        }
    }

    cancelarCreaFactura() {
        this.isShowFormCreaFact = false;
    }

    calculaPagos(filapago) {
        try {
            const dtvalor = filapago.dt_valor;
            const index = this.formaspago.indexOf(filapago);

            const sobrante = (this.totales.total - dtvalor).toFixed(2);
            let itpago = this.formaspago[0];
            if (index === 0) {
                itpago = this.formaspago[1];
            }
            if (itpago) {
                itpago.dt_valor = sobrante;
            }
        } catch (e) {
            console.error('Error en el calculo del total:', e);
        }
    }

    onFilaIvaChange(fila: any) {
        let dtPrecio = Number(fila.dt_precioiva);
        if (!dtPrecio) {
            dtPrecio = 0.0;
        }
        if (fila.icdp_grabaiva) {
            dtPrecio = this.numberService.quitarIva(dtPrecio);
        }
        fila.dt_precio = dtPrecio;
        this.recalcTotalFila(fila);
    }

    onFilaPrecioChange(fila: any) {
        let dtPrecio = Number(fila.dt_precioiva);
        if (!dtPrecio) {
            dtPrecio = 0.0;
        }
        if (fila.icdp_grabaiva) {
            dtPrecio = this.numberService.quitarIva(dtPrecio);
        }
        fila.dt_precio = dtPrecio;
        this.recalcTotalFila(fila);
    }

    hideDetCredito() {
        this.isShowDetallesCredito = false;
        this.loadCreaditos();
    }

    onFilaDescChange(fila: any) {
        let dtDecto = 0.0;
        fila.dt_dectoerr = false;
        const numberdtdecto = Number(fila.dt_dectoin);
        if (numberdtdecto >= 0 && this.numberService.round2(numberdtdecto) <= this.numberService.round2(fila.dt_precio)) {
            dtDecto = numberdtdecto;
        } else {
            fila.dt_dectoerr = true;
        }
        fila.dt_decto = dtDecto;
        this.recalcTotalFila(fila);
    }

    onDeudasChange($event: any) {
        this.evDeudasChange.emit($event);
    }
}
