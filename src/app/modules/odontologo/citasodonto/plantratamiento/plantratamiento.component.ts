import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ArticuloService} from '../../../../services/articulo.service';
import {DomService} from '../../../../services/dom.service';
import {PlantratamientoService} from '../../../../services/plantratamiento.service';
import {SwalService} from '../../../../services/swal.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {NumberService} from '../../../../services/number.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
    selector: 'app-plantratamiento',
    templateUrl: './plantratamiento.component.html'
})
export class PlantratamientoComponent implements OnInit, OnChanges {
    form: any;
    detalles: Array<any>;
    totales: any;
    medicos: Array<any>;
    formaspago: Array<any>;
    impuestos: any;
    ttransacc: any;
    formcab: any;
    formplan: any;
    formdet: any;
    formpago: any;
    listaPlanes: Array<any>;
    datosDocPlan: any;
    showForm: boolean;
    allServicios: Array<any>;
    filteredServ: Array<any>;
    plansel: any;
    ivas: Array<any>;
    filtroserv: any;
    tracodFact = 1;
    isLoadingPlanes = false;

    @Input()
    codpaciente: number;

    constructor(private artService: ArticuloService,
                private domService: DomService,
                private loadinUIServ: LoadingUiService,
                private arrayService: ArrayutilService,
                private swalService: SwalService,
                private numberService: NumberService,
                private planService: PlantratamientoService) {
    }

    ngOnInit(): void {
        this.clearAll();
        this.ivas = this.numberService.getIvasArray();
        this.artService.buscaAllServDentalles().subscribe(res => {
            if (res.status === 200) {
                this.allServicios = res.items;
                this.filteredServ = res.items;
            }
        });
        registerLocaleData(es);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.codpaciente;
        if (chng.currentValue) {
            this.loadPlanes();
        } else {
            this.clearAll();
        }
    }

    initFormCrea() {
        this.filtroserv = '';
        this.filteredServ = this.allServicios;
        this.showForm = true;
        this.detalles = [];
        this.loadForm();
    }

    loadPlanes() {
        this.isLoadingPlanes = true;
        this.planService.listar(this.codpaciente).subscribe(res => {
            this.isLoadingPlanes = false;
            if (res.status === 200) {
                this.listaPlanes = res.items;
            }
        });
    }

    loadForm() {
        this.loadinUIServ.publishBlockMessage();
        this.planService.getForm(this.codpaciente, this.tracodFact).subscribe(res => {
            if (res.status === 200) {
                this.formcab = res.formcab;
                this.formplan = res.formplan;
                this.medicos = res.medicos;
                this.ttransacc = res.ttransacc;
                this.formaspago = res.formaspago;
                this.formdet = res.formdet;
                this.formpago = res.formpago;
                this.domService.setFocusTimeout('pnt_nombre', 100);
                this.impuestos = res.formcab.impuestos;
                this.numberService.setIva(this.impuestos.iva);
            }
        });
    }

    clearAll() {
        this.form = {};
        this.detalles = [];
        this.medicos = [];
        this.ttransacc = {};
        this.formaspago = [];
        this.formcab = {};
        this.formdet = {};
        this.formplan = {};
        this.formpago = {};
        this.showForm = false;
        this.listaPlanes = [];
        this.datosDocPlan = {};
        this.plansel = {};

        this.initTotales();
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

    checkPagosPrevios() {
        const isedit = this.formcab.trn_codigo > 0;
        let totalcred = 0.0;
        let totalefec = 0.0;
        if (isedit) {
            const filtered = this.datosDocPlan.doc.pagos.filter(row => row.ic_clasecc === 'XC');
            if (filtered && filtered.length > 0) {
                totalcred = filtered[0].dt_valor;
                if (totalcred < this.totales.total) {
                    totalefec = this.numberService.round2(this.totales.total - totalcred);
                }
                this.formaspago[0].dt_valor = totalefec;
                this.formaspago[1].dt_valor = totalcred;
            }
        }
    }

    totalizar() {
        this.initTotales();
        this.totales = this.numberService.totalizar(this.detalles);
        if (this.formaspago && this.formaspago.length > 0) {
            this.formaspago[0].dt_valor = 0.0;
        }
        if (this.formaspago && this.formaspago.length > 1) {
            this.formaspago[1].dt_valor = this.totales.total;
        }
    }

    creaPlanTratamiento() {
        if (this.formplan.pnt_nombre.trim().length === 0) {
            this.swalService.fireToastError('Debe ingresar el nombre del plan');
        } else if (this.detalles.length === 0) {
            this.swalService.fireToastError('Debe agregar items al plan de tratamiento');
        } else {
            const isedit = this.formcab.trn_codigo > 0;
            const tipo = isedit ? 'actualización' : 'creación';
            const msg = `¿Confirma la ${tipo} de este plan de tratamiento?`;
            this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.formcab.trn_docpen = 'T';
                    const form = {
                        formplan: this.formplan,
                        form_cab: this.formcab,
                        form_persona: {per_id: this.codpaciente},
                        detalles: this.detalles,
                        pagos: this.formaspago,
                        totales: this.totales
                    };
                    this.loadinUIServ.publishBlockMessage();
                    this.planService.crear(form).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.showForm = false;
                            this.loadPlanes();
                            if (isedit) {
                                this.loadDatosPlan(this.plansel.pnt_id);
                            }
                        }
                    });
                }
            });
        }
    }

    quitarItem(fila: any) {
        const msg = '¿Seguro que desea quitar este item?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.arrayService.removeElement(this.detalles, fila);
                this.totalizar();
            }
        });
    }

    onMedicoChange($event: any) {

    }

    selectServicio(item: any) {
        const prevserv = this.arrayService.getFirstResult(this.detalles, (it) => it.art_codigo === item.ic_id);
        if (prevserv) {
            prevserv.dt_cant += 1;
            this.recalcTotalFila(prevserv);
        } else {
            this.detalles.push(this.getNewEmptyRow(item));
        }
        this.totalizar();
    }

    cancelarCreaPlan() {
        this.showForm = false;
    }

    loadDatosPlan(pntid) {
        this.loadinUIServ.publishBlockMessage();
        this.planService.getDetallesPlan(pntid).subscribe(res => {
            if (res.status === 200) {
                this.datosDocPlan.plan = res.plan;
                this.datosDocPlan.doc = res.doc;
            }
        });
    }

    showDetallesPlan(plan) {
        this.plansel = plan;
        this.loadDatosPlan(this.plansel.pnt_id);
    }

    cerrarVerDetallesFact() {
        this.plansel = {};
        this.datosDocPlan = {};
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

    imprimirPlan(planid: any) {
        this.planService.imprimirPlan(planid);
    }

    confirmarPlan() {
        const msg = '¿Seguro que desea marcar como confirmado este plan?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.planService.cambiarEstado(this.plansel.pnt_id, 2).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadPlanes();
                            this.cerrarVerDetallesFact();
                        }
                    });
                }
            }
        );
    }

    anularPlan() {
        const msg = '¿Seguro que desea eliminar este plan de tratamiento?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.planService.cambiarEstado(this.plansel.pnt_id, 5).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadPlanes();
                        this.cerrarVerDetallesFact();
                    }
                });
            }
        });
    }

    editarPlan() {
        this.loadinUIServ.publishBlockMessage();
        this.planService.getForm(this.codpaciente, this.tracodFact).subscribe(res => {
            this.showForm = true;
            this.detalles = this.datosDocPlan.doc.detalles;
            if (res.status === 200) {
                this.formcab = res.formcab;
                this.formplan = res.formplan;
                this.medicos = res.medicos;
                this.ttransacc = res.ttransacc;
                this.formaspago = res.formaspago;
                this.formdet = res.formdet;
                this.formpago = res.formpago;
                this.domService.setFocusTimeout('pnt_nombre', 100);
                this.impuestos = res.formcab.impuestos;
                this.numberService.setIva(this.impuestos.iva);
            }
            this.detalles.forEach(det => {
                this.recalcTotalFila(det);
            });
            this.formplan = this.datosDocPlan.plan;
            this.formcab = this.datosDocPlan.doc.tasiento;
            this.totalizar();
            this.checkPagosPrevios();
        });
    }

    finalizarPlan() {
        const msg = '¿Seguro que desea marcar como finalizado?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.planService.cambiarEstado(this.plansel.pnt_id, 4).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadPlanes();
                            this.cerrarVerDetallesFact();
                        }
                    });
                }
            }
        );
    }

    doFilter() {
        const filtroupd = this.filtroserv ? this.filtroserv.toString().trim().toUpperCase() : '';
        if (filtroupd.length === 0) {
            this.filteredServ = this.allServicios;
        } else {
            this.filteredServ = this.allServicios.filter(serv => serv.ic_nombre.startsWith(filtroupd));
        }
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

    onFilaDescChange(fila: any) {
        let dtDecto = 0.0;
        fila.dt_dectoerr = false;
        const numberdtdecto = Number(fila.dt_dectoin);
        if (numberdtdecto >= 0 && this.numberService.round2(numberdtdecto) <= this.numberService.round2(fila.dt_precio * fila.dt_cant)) {
            dtDecto = numberdtdecto;
        } else {
            fila.dt_dectoerr = true;
        }
        fila.dt_decto = dtDecto;
        this.recalcTotalFila(fila);
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
}
