import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AsientoService } from '../../../../services/asiento.service';
import { NumberService } from '../../../../services/number.service';
import { DomService } from '../../../../services/dom.service';
import { SwalService } from '../../../../services/swal.service';
import { ArticuloService } from '../../../../services/articulo.service';
import { LoadingUiService } from '../../../../services/loading-ui.service';
import { ArrayutilService } from '../../../../services/arrayutil.service';
import { FechasService } from '../../../../services/fechas.service';
import { Router } from '@angular/router';
import { SeccionService } from '../../../../services/seccion.service';
import { PersonaService } from '../../../../services/persona.service';
import { forkJoin, Subscription } from 'rxjs';
import { FacturasmsgService } from '../../../../services/facturasmsg.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { CtesService } from '../../../../services/ctes.service';
import { BaseComponent } from '../../../shared/base.component';
import { CompeleService } from 'src/app/services/compele.service';

@Component({
    selector: 'app-facturasform',
    templateUrl: './facturasform.component.html'
})
export class FacturasformComponent extends BaseComponent implements OnInit, OnDestroy {
    isLoading: boolean;

    ttransacc: any;
    formdet: any;
    artsFiltrados: Array<any>;
    artFiltrado: any;
    impuestos: any;
    ivas: Array<any>;
    currentdate: any;
    seccionSel: number;
    secciones: Array<any>;
    isConsumidorFinal: boolean;
    isDisabledFormRef: boolean;
    codConsFinal = -1;
    trncodedit = 0;
    datosdocedit: any = {};
    formvuelto = { input: 0, vuelto: 0 };

    @Input() form: any;
    @Input() tracodigo: number;
    @Input() isedit = false;

    @Input() showtitulo = true;
    @Input() showreferente = true;
    @Input() showdetalles = true;
    @Input() showtotales = true;
    @Input() showbuttons = true;

    @Output() evTotalesUpd = new EventEmitter<any>();
    @Output() evGuardarOk = new EventEmitter<any>();
    @Output() evCancela = new EventEmitter<any>();
    @Output() evFormLoaded = new EventEmitter<any>();

    pagosef: Array<any> = [];
    buscaArtPromise: Promise<any>;
    artsearched: boolean;
    artsearchedcount: number;
    factMsgSubs: Subscription;
    isfacturacompra: boolean;
    formisloaded = false;
    codartsel = 0;
    isShowDetProd = false;
    totvuelto: any;

    constructor(private asientoService: AsientoService,
        private numberService: NumberService,
        private domService: DomService,
        private seccionService: SeccionService,
        private artService: ArticuloService,
        private loadingUiService: LoadingUiService,
        private arrayService: ArrayutilService,
        private fechasService: FechasService,
        private swalService: SwalService,
        private facturaMsgService: FacturasmsgService,
        private localStrgService: LocalStorageService,
        private router: Router,
        private ctes: CtesService,
        private personaServ: PersonaService,
        private compele: CompeleService) {
        super();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.artFiltrado = {};
        this.formisloaded = false;
        this.isLoading = true;
        this.initformfact();
        this.initTotales();
        this.form.totales.descglobalin = 0;
        this.currentdate = new Date();
        this.seccionSel = 1;
        this.ivas = this.numberService.getIvasArray();
        this.showFormCreaFact();
        this.isConsumidorFinal = false;
        this.isDisabledFormRef = false;
        this.artsearchedcount = 0;
        this.artsearched = false;

        this.factMsgSubs = this.facturaMsgService.message.subscribe(msg => {
            if (msg) {
                if (msg.tipo === 1) {// Carga de referente
                    this.form.form_persona = msg.form_persona;
                    this.isConsumidorFinal = false;
                }
            }
        });
    }

    initTotales() {
        this.form.totales = {
            subtotal: 0.0,
            descuentos: 0.0,
            descglobal: 0.0,
            descglobalin: '',
            subtforiva: 0.0,
            iva: 0.0,
            total: 0.0
        };
    }

    initformfact() {
        this.isfacturacompra = false;
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
        const descglobalin = this.form.totales.descglobalin;
        this.initTotales();
        this.form.totales = this.numberService.totalizar(this.form.detalles);
        this.form.totales.descglobalin = descglobalin;
        if (this.isedit && this.trncodedit > 0) {
            this.numberService.checkPagosPrevios(this.datosdocedit.pagos, this.form.totales, this.form.pagos);
        } else {
            if (this.form.pagos && this.form.pagos.length > 0) {
                this.form.pagos[0].dt_valor = this.form.totales.total;
            }
            if (this.form.pagos && this.form.pagos.length > 1) {
                this.form.pagos[1].dt_valor = 0.0;
            }
        }
        this.evTotalesUpd.emit(this.form);
        this.onVueltoChange();
    }

    getNewEmptyRow(art) {
        const formDetalles = this.domService.clonarObjeto(this.formdet);
        this.artService.initFormDetalles(formDetalles, art, this.isfacturacompra);
        return formDetalles;
    }

    checkInventarios(fila): boolean {
        let continuar = true;
        if (this.ttransacc.tra_tipdoc === 1) {
            if (fila.tipic_id === 1) {
                if (fila.dt_cant > fila.ice_stock) {
                    continuar = false;
                    this.swalService.fireToastError(`No hay unidades disponibles para ${fila.ic_nombre}, el total disponible actual es de: ${fila.ice_stock}`);
                }
            }
        }
        return continuar;
    }

    recalcTotalFila(fila) {
        this.checkInventarios(fila);
        this.numberService.recalcTotalFila(fila);
        this.totalizar();
    }

    testFacte() {
        console.log('Test facte-->');
        this.compele.enviar(656).subscribe(res => {
            console.log('Valor de res es:', res);
        });
    }

    testAutorizaFacte() {
        console.log('Test facte autoriza-->');
        this.compele.consultaEstadoAut(656).subscribe(res => {
            console.log('Valor de res es:', res);
        });
    }

    buscaServs(event) {
        this.artsearched = false;
        this.artsearchedcount = 0;
        this.buscaArtPromise = new Promise((resolve) => {
            this.artService.busArtsForTransacc(this.seccionSel, event.query, this.tracodigo).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.artsFiltrados = res.items;
                }
                resolve(true);
                this.artsearched = true;
            });
        });
    }

    onEnterFiltroArts($event) {
        setTimeout(() => {
            if (this.artsearched) {
                this.logicaSelectArticulo();
            } else {
                this.logicaEnterFiltro();
            }
        }, 200);
    }

    logicaSelectArticulo() {
        if (this.artsFiltrados.length > 0) {
            this.onServSelect(this.artsFiltrados[0]);
            this.artsFiltrados = [];
            this.artsearched = false;
        }
    }

    logicaEnterFiltro() {
        if (this.artsearchedcount < 5) {
            if (this.artsearched) {
                this.artsearchedcount = 5;
                this.logicaSelectArticulo();
            } else {
                setTimeout(() => {
                    this.artsearchedcount += 1;
                    this.logicaEnterFiltro();
                }, 500);
            }
        } else {
            if (this.artsearched) {
                this.artsearchedcount = 5;
                this.logicaSelectArticulo();
            }
        }
    }

    onServSelect($event: any) {
        const prevserv = this.arrayService.getFirstResult(this.form.detalles, (it) => it.art_codigo === $event.ic_id);
        if (prevserv) {
            prevserv.dt_cant += 1;
            this.recalcTotalFila(prevserv);
        } else {
            const newrow = this.getNewEmptyRow($event);
            this.checkInventarios(newrow);
            this.form.detalles.push(newrow);
        }
        this.totalizar();
        this.artFiltrado = {};
        this.domService.setFocusTm(this.ctes.artsAutoCom);
    }

    quitarItem(fila: any) {
        this.swalService.fireDialog(this.ctes.msgSureWishRemveItemFact).then(confirm => {
            if (confirm.value) {
                this.arrayService.removeElement(this.form.detalles, fila);
                this.totalizar();
            }
        }
        );
    }

    crearFactura() {
        if (this.form.form_cab.secuencia.length === 0) {
            this.swalService.fireToastError(this.ctes.msgMustEnterNumFact);
        } else if (this.form.detalles.length === 0) {
            this.swalService.fireToastError(this.ctes.msgMustAddProdInFact);
        } else if (!this.form.form_cab.trn_fecregobj) {
            this.swalService.fireToastError(this.ctes.msgMustEnterDateFact);
        } else if (this.isfacturacompra && (this.form.form_persona.per_ciruc.trim().length === 0)) {
            this.swalService.fireToastError(this.ctes.msgMustEnterDataRef);
        } else {
            let pagocredito = 0.0;
            this.form.pagos.forEach(pago => {
                if (pago.ic_clasecc === 'XC' || pago.ic_clasecc === 'XP') {
                    pagocredito = Number(pago.dt_valor);
                }
            });

            if (pagocredito !== 0.0) {
                if (this.form.form_persona.per_id === -1) {
                    this.swalService.fireToastError(this.ctes.msgFactIsCredMustEnterRef);
                    return;
                }
            }

            this.form.form_cab.trn_fecreg = this.fechasService.formatDate(this.form.form_cab.trn_fecregobj);
            this.swalService.fireDialog(this.ctes.msgSureSaveFact).then(confirm => {
                if (confirm.value) {
                    this.loadingUiService.publishBlockMessage();
                    this.asientoService.crearDocumento(this.form).subscribe(res => {
                        if (this.isResultOk(res)) {
                            this.swalService.fireToastSuccess(res.msg);
                            if (!this.isfacturacompra) {
                                this.swalService.fireDialog(this.ctes.msgWishPrint).then(confprint => {
                                    if (confprint.value) {
                                        this.asientoService.imprimirFactura(res.trn_codigo);
                                    }
                                });
                            }
                            let compelenviado = res.compelenviado || false;
                            if (compelenviado) {
                                console.log("Se envio comprobante electronico", res);
                                if (!res.is_cons_final) {
                                    this.compele.saveComprobContrib(res.trn_codigo, res.estado_envio).subscribe(rescomprob => {
                                        console.log("Respuesta de recomprob es", rescomprob);
                                    });
                                }
                                else {
                                    console.log('No se guarda el comprobante por que es consumidor final');
                                }
                            }
                        }
                        this.evGuardarOk.emit(res);
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
            if (!this.isfacturacompra) {
                dtPrecio = this.numberService.quitarIva(dtPrecio);
            }
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
            if (!this.isfacturacompra) {
                dtPrecio = this.numberService.quitarIva(dtPrecio);
            }
        }
        fila.dt_precio = dtPrecio;

        if (fila.dt_decto > fila.dt_precio) {
            fila.dt_decto = 0.0;
            fila.dt_dectoin = 0.0;
        }

        this.recalcTotalFila(fila);
    }

    cancelarCreaFactura() {
        this.evCancela.emit('');
    }

    loadFormReferente() {
        this.form.form_persona = {};
        this.isDisabledFormRef = false;
        this.isConsumidorFinal = false;
        this.personaServ.getForm().subscribe(res => {
            if (this.isResultOk(res)) {
                this.form.form_persona = res.form;
                if (!this.isfacturacompra) {
                    this.domService.setFocusTm(this.ctes.per_ciruc);
                } else {
                    if (this.form.form_cab.secuencia) {
                        this.domService.setFocusTm(this.ctes.per_ciruc);
                    } else {
                        this.domService.setFocusTm(this.ctes.fc_secuencia);
                    }
                }
            }
        });
    }

    showFormCreaFact() {
        this.isLoading = true;
        this.initformfact();
        const formCabObs = this.asientoService.getFormCab(this.tracodigo);
        const secObs = this.seccionService.listarUserSecs();

        let perFormObs = null;
        if (this.tracodigo === 7) {
            perFormObs = this.personaServ.getForm();
        } else {
            perFormObs = this.personaServ.buscarPorCod(this.codConsFinal);
        }

        this.trncodedit = 0;
        if (this.isedit) {
            const keystrg = this.ctes.trncoded;
            const auxtrncoded = this.localStrgService.getItem(keystrg);
            this.localStrgService.removeItem(keystrg);
            if (auxtrncoded) {
                this.trncodedit = parseInt(auxtrncoded, 10);
            }
        }

        forkJoin([formCabObs, secObs, perFormObs]).subscribe(res => {
            const res0: any = res[0];
            const res1: any = res[1];
            const res2: any = res[2];

            if (this.isResultOk(res0)) {
                this.form.form_cab = res0.formcab;
                this.form.form_cab.trn_fecregobj = this.fechasService.parseString(this.form.form_cab.trn_fecreg);
                this.ttransacc = res0.ttransacc;
                this.isfacturacompra = this.ttransacc.tra_tipdoc === 2;
                this.form.pagos = res0.formaspago;
                this.pagosef = res0.pagosef;
                this.formdet = res0.formdet;
                this.impuestos = res0.impuestos;
                this.numberService.setIva(this.impuestos.iva);
                this.seccionSel = res0.secid;
            }

            if (this.isResultOk(res1)) {
                this.secciones = res1.items;
            }

            if (this.isResultOk(res2)) {
                if (this.isfacturacompra) {
                    this.form.form_persona = res2.form;
                    this.isConsumidorFinal = false;
                    this.isDisabledFormRef = false;
                } else {
                    this.form.form_persona = res2.persona;
                    this.isConsumidorFinal = true;
                    this.isDisabledFormRef = true;
                }
                this.formisloaded = true;
            }

            this.isLoading = false;

            if (this.isfacturacompra) {
                this.domService.setFocusTm(this.ctes.fc_secuencia);
            } else {
                this.domService.setFocusTm(this.ctes.artsAutoCom);
            }

            this.evFormLoaded.emit(this.form);

            if (this.isedit && this.trncodedit > 0) {
                this.swalService.fireToastSuccess(this.ctes.msgEditingFact);
                this.asientoService.getDoc(this.trncodedit, 1).subscribe(resedit => {
                    this.datosdocedit = resedit.doc;
                    this.form.detalles = resedit.doc.detalles;
                    this.form.form_cab = resedit.doc.tasiento;
                    this.form.form_cab.trn_fecregobj = this.fechasService.parseString(this.form.form_cab.trn_fecreg);
                    this.form.form_persona = resedit.doc.datosref;
                    this.form.detalles.forEach(det => {
                        this.numberService.recalcTotalFila(det);
                    });
                    this.form.totales = resedit.doc.totales;
                    this.totalizar();
                    this.isConsumidorFinal = this.form.form_cab.per_codigo === -1;
                });
            }
        });
    }

    verificaRefRegistrado() {
        if (this.form.form_persona.per_id === 0) {
            this.buscarReferente();
        }
    }

    loadConsumidorFinal() {
        this.personaServ.buscarPorCod(this.codConsFinal).subscribe(res => {
            if (this.isResultOk(res)) {
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
            if (this.isResultOk(res)) {
                this.form.form_persona = res.persona;
                this.domService.setFocusTm(this.ctes.artsAutoCom);
                this.swalService.fireToastSuccess(this.ctes.msgRefRegistered);
            } else {
                this.domService.setFocusTm(this.ctes.perNombresInput);
            }
        }
        );
    }

    onConsFinalChange() {
        if (!this.isConsumidorFinal) {
            this.loadFormReferente();
        } else {
            this.loadConsumidorFinal();
            this.domService.setFocusTm(this.ctes.artsAutoCom);
        }
    }

    clearFormPersona() {
        this.loadFormReferente();
    }

    onDescgenChange() {
        this.form.totales.dt_dectogenerr = false;
        const numberdectogen = Number(this.form.totales.descglobalin);
        let dtdectogen = 0.0;
        if (numberdectogen >= 0) {
            dtdectogen = numberdectogen;
        } else {
            this.form.totales.dt_dectogenerr = true;
        }

        this.numberService.setDectoGenInDetails(dtdectogen, this.form.totales, this.form.detalles);
        this.totalizar();
    }

    onDtCantChange(fila) {
        this.recalcTotalFila(fila);
    }

    onFilaDescChange(fila: any) {
        let dtDecto = 0.0;
        fila.dt_dectoerr = false;
        const subt = fila.dt_cant * fila.dt_precioiva;
        const numberdtdecto = Number(fila.dt_dectoin);
        if (numberdtdecto >= 0 && this.numberService.round2(numberdtdecto) <= this.numberService.round2(subt)) {
            dtDecto = numberdtdecto;
        } else {
            fila.dt_dectoerr = true;
        }

        let dtDectoAjuste = dtDecto;
        if (fila.icdp_grabaiva) {
            if (!this.isfacturacompra) {
                dtDectoAjuste = this.numberService.quitarIva(dtDecto);
            }
        }
        // fila.dt_decto = (dtDectoAjuste * fila.dt_cant);
        fila.dt_decto = dtDectoAjuste;
        this.recalcTotalFila(fila);
    }

    onServFilaSelected($event: any) {
        this.artsFiltrados = [];
        this.onServSelect($event);
    }

    ngOnDestroy(): void {
        if (this.factMsgSubs) {
            this.factMsgSubs.unsubscribe();
        }
    }

    toggleConsFinal() {
        this.isConsumidorFinal = !this.isConsumidorFinal;
        this.onConsFinalChange();
    }

    showDetallesProd(art: any) {
        this.codartsel = art.art_codigo;
        this.isShowDetProd = true;
    }

    onVueltoChange() {
        const total = this.form.totales.total;
        const inputv = Number(this.formvuelto.input);
        let inputvv = total;
        if (inputv && inputv >= 0) {
            inputvv = inputv;
        }

        const cambio = this.numberService.round2(inputvv - total);
        if (cambio && cambio > 0) {
            this.formvuelto.vuelto = cambio;
        } else {
            this.formvuelto.vuelto = 0.0;
        }
    }
}
