import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {NumberService} from '../../../../services/number.service';
import {DomService} from '../../../../services/dom.service';
import {SwalService} from '../../../../services/swal.service';
import {ArticuloService} from '../../../../services/articulo.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';
import {FechasService} from '../../../../services/fechas.service';
import {Router} from '@angular/router';
import {SeccionService} from '../../../../services/seccion.service';
import {PersonaService} from '../../../../services/persona.service';
import {forkJoin} from 'rxjs';
import es from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';

@Component({
    selector: 'app-facturasform',
    templateUrl: './facturasform.component.html'
})
export class FacturasformComponent implements OnInit {
    isLoading: boolean;

    ttransacc: any;
    formdet: any;
    artsFiltrados: Array<any>;
    impuestos: any;
    ivas: Array<any>;
    currentdate: any;
    seccionSel: number;
    secciones: Array<any>;
    isConsumidorFinal: boolean;
    isDisabledFormRef: boolean;
    codConsFinal = -1;

    @Input() form: any;
    @Input() tracodigo: number;
    @Input() tdvcodigo: number;

    @Input() showtitulo = true;
    @Input() showreferente = true;
    @Input() showdetalles = true;
    @Input() showtotales = true;
    @Input() showbuttons = true;

    @Output() evTotalesUpd = new EventEmitter<any>();

    constructor(private asientoService: AsientoService,
                private numberService: NumberService,
                private domService: DomService,
                private seccionService: SeccionService,
                private artService: ArticuloService,
                private loadingUiService: LoadingUiService,
                private arrayService: ArrayutilService,
                private fechasService: FechasService,
                private swalService: SwalService,
                private router: Router,
                private personaServ: PersonaService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.initformfact();
        this.initTotales();
        this.currentdate = new Date();
        this.seccionSel = 1;
        this.ivas = this.numberService.getIvasArray();
        this.showFormCreaFact();
        this.isConsumidorFinal = false;
        this.isDisabledFormRef = false;
        registerLocaleData(es);
    }


    initTotales() {
        this.form.totales = {
            subtotal: 0.0,
            descuentos: 0.0,
            subtforiva: 0.0,
            iva: 0.0,
            total: 0.0
        };
    }

    initformfact() {
        this.form = {
            form_cab: {},
            form_persona: {},
            detalles: [],
            pagos: [],
            totales: {}
        };
        this.ttransacc = {};
        this.formdet = {};
    }

    totalizar() {
        this.initTotales();
        this.form.totales = this.numberService.totalizar(this.form.detalles);
        if (this.form.pagos && this.form.pagos.length > 0) {
            this.form.pagos[0].dt_valor = this.form.totales.total;
        }
        if (this.form.pagos && this.form.pagos.length > 1) {
            this.form.pagos[1].dt_valor = 0.0;
        }
        this.evTotalesUpd.emit(this.form);
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
        formDetalles.ic_code = art.ic_code;
        formDetalles.dt_precioiva = precio;
        formDetalles.per_codigo = 0;
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
        this.artService.busArtsForTransacc(this.seccionSel, event.query).subscribe(res => {
            if (res.status === 200) {
                this.artsFiltrados = res.items;
            }
        });
    }

    onServSelect($event: any) {
        const prevserv = this.arrayService.getFirstResult(this.form.detalles, (it) => it.art_codigo === $event.ic_id);
        if (prevserv) {
            prevserv.dt_cant += 1;
            this.recalcTotalFila(prevserv);
        } else {
            this.form.detalles.push(this.getNewEmptyRow($event));
        }
        this.totalizar();
        this.formdet.servicio = {};
        this.domService.setFocusTimeout('artsAutoCom', 100);
    }

    quitarItem(fila: any) {
        const msg = '¿Seguro que desea quitar este item de la factura?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.arrayService.removeElement(this.form.detalles, fila);
                    this.totalizar();
                }
            }
        );
    }

    crearFactura() {
        if (this.form.detalles.length === 0) {
            this.swalService.fireToastError('Debe agregar productos o servicios a la factura');
        } else if (!this.form.form_cab.trn_fecregobj) {
            this.swalService.fireToastError('Debe especificar la fecha de la factura');
        } else {
            this.form.form_cab.trn_fecreg = this.fechasService.formatDate(this.form.form_cab.trn_fecregobj);
            const msg = '¿Seguro que desea crear la factura?';
            this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.loadingUiService.publishBlockMessage();
                    this.asientoService.crearDocumento(this.form).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.gotolist();
                        }
                    });
                }
            });
        }
    }

    calculaPagos(filapago) {
        try {
            const dtvalor = filapago.dt_valor;
            const index = this.form.pagos.indexOf(filapago);

            const sobrante = (this.form.totales.total - dtvalor).toFixed(2);
            let itpago = this.form.pagos[0];
            if (index === 0) {
                itpago = this.form.pagos[1];
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

        if (fila.dt_decto > fila.dt_precio) {
            fila.dt_decto = 0.0;
            fila.dt_dectoin = 0.0;
        }

        this.recalcTotalFila(fila);
    }

    gotolist() {
        this.router.navigate(['trndocs']);
    }

    cancelarCreaFactura() {
        this.gotolist();
    }

    loadFormReferente() {
        this.form.form_persona = {};
        this.isDisabledFormRef = false;
        this.isConsumidorFinal = false;
        this.personaServ.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form.form_persona = res.form;
                this.domService.setFocusTimeout('per_ciruc', 100);
            }
        });
    }

    showFormCreaFact() {
        this.isLoading = true;
        this.initformfact();
        this.loadingUiService.publishBlockMessage();
        const formCabObs = this.asientoService.getFormCab(this.tracodigo, this.tdvcodigo);
        const secObs = this.seccionService.listar();
        const perFormObs = this.personaServ.buscarPorCod(this.codConsFinal);

        forkJoin([formCabObs, secObs, perFormObs]).subscribe(res => {
            const res0: any = res[0];
            const res1: any = res[1];
            const res2: any = res[2];

            if (res0.status === 200) {
                this.form.form_cab = res0.formcab;
                this.form.form_cab.trn_fecregobj = this.fechasService.parseString(this.form.form_cab.trn_fecreg);
                this.ttransacc = res0.ttransacc;
                this.form.pagos = res0.formaspago;
                this.formdet = res0.formdet;
                this.impuestos = res0.impuestos;
                this.numberService.setIva(this.impuestos.iva);
                this.seccionSel = res0.secid;
            }

            if (res1.status === 200) {
                this.secciones = res1.items;
            }

            if (res2.status === 200) {
                this.form.form_persona = res2.persona;
                this.isConsumidorFinal = true;
                this.isDisabledFormRef = true;
            }

            this.isLoading = false;
            this.domService.setFocusTimeout('artsAutoCom', 100);
        });
    }

    verificaRefRegistrado() {
        if (this.form.form_persona.per_id === 0) {
            this.buscarReferente();
        }
    }

    loadConsumidorFinal() {
        this.personaServ.buscarPorCod(this.codConsFinal).subscribe(res => {
            if (res.status === 200) {
                this.form.form_persona = res.persona;
                this.isDisabledFormRef = true;
                this.isConsumidorFinal = true;
            }
        });
    }

    buscarReferente() {
        const per_ciruc = this.form.form_persona.per_ciruc;
        this.loadingUiService.publishBlockMessage();
        this.personaServ.buscarPorCi(per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    this.form.form_persona = res.persona;
                    this.domService.setFocusTimeout('artsAutoCom', 100);
                    this.swalService.fireToastSuccess('El referente ya está registrado');
                } else {
                    this.domService.setFocusTimeout('perNombresInput', 200);
                }
            }
        );
    }

    onConsFinalChange() {
        if (!this.isConsumidorFinal) {
            this.loadFormReferente();
        } else {
            this.loadConsumidorFinal();
            this.domService.setFocusTimeout('artsAutoCom', 100);
        }
    }

    clearFormPersona() {
        this.loadFormReferente();
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

    onEnterFiltroArts($event) {

    }

}