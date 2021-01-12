import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ArticuloService} from '../../../../services/articulo.service';
import {DomService} from '../../../../services/dom.service';
import {PlantratamientoService} from '../../../../services/plantratamiento.service';
import {SwalService} from '../../../../services/swal.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';

@Component({
    selector: 'app-plantratamiento',
    templateUrl: './plantratamiento.component.html'
})
export class PlantratamientoComponent implements OnInit, OnChanges {
    form: any;
    servsFiltered: Array<any>;
    detalles: Array<any>;
    totales: any;
    medicos: Array<any>;
    formaspago: Array<any>;
    ttransacc: any;
    formcab: any;
    formplan: any;
    formdet: any;
    formpago: any;
    listaPlanes: Array<any>;
    datosDocPlan: any;
    showForm: boolean;
    allServicios: Array<any>;
    plansel: any;

    @Input()
    codpaciente: number;

    constructor(private artService: ArticuloService,
                private domService: DomService,
                private loadinUIServ: LoadingUiService,
                private arrayService: ArrayutilService,
                private swalService: SwalService,
                private planService: PlantratamientoService) {
    }

    ngOnInit(): void {
        this.clearAll();
        this.artService.buscaAllServDentalles().subscribe(res => {
            if (res.status === 200) {
                this.allServicios = res.items;
            }
        });
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
        this.showForm = true;
        this.detalles = [];
        this.loadForm();
    }

    loadPlanes() {
        this.planService.listar(this.codpaciente).subscribe(res => {
            if (res.status === 200) {
                this.listaPlanes = res.items;
            }
        });
    }

    loadForm() {
        const traCodigo = 1;
        const tdvCodigo = 1;

        this.loadinUIServ.publishBlockMessage();
        this.planService.getForm(this.codpaciente, traCodigo, tdvCodigo).subscribe(res => {
            if (res.status === 200) {
                this.formcab = res.formcab;
                this.formplan = res.formplan;
                this.medicos = res.medicos;
                this.ttransacc = res.ttransacc;
                this.formaspago = res.formaspago;
                this.formdet = res.formdet;
                this.formpago = res.formpago;
                this.domService.setFocusTimeout('pnt_nombre', 100);
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
            iva: 0.0,
            total: 0.0
        };
    }

    buscaServs(event) {
        this.artService.buscaServDentales(event.query).subscribe(res => {
            if (res.status === 200) {
                this.servsFiltered = res.items;
            }
        });
    }

    getNewEmptyRow(art) {
        const formDetalles = this.domService.clonarObjeto(this.formdet);
        formDetalles.ic_nombre = art.ic_nombre;
        formDetalles.art_codigo = art.ic_id;
        formDetalles.dt_precio = art.icdp_precioventa;
        formDetalles.dt_valor = art.icdp_precioventa;
        formDetalles.per_codigo = this.codpaciente;
        formDetalles.dt_cant = 1;
        formDetalles.dai_impg = art.icdp_grabaiva ? 12.0 : 0.0;
        return formDetalles;
    }

    recalcTotalFila(fila) {
        let preciot = 0.0;
        try {
            preciot = fila.dt_cant * fila.dt_precio;
        } catch (e) {
            console.error('Error  al calcular totales de fila', e);
        }
        fila.dt_valor = preciot;

        this.totalizar();
    }

    onServSelect($event: any) {
        this.detalles.push(this.getNewEmptyRow(this.form.servicio));
        this.form.servicio = null;
        this.domService.setFocusTimeout('artsAutoCom', 100);
        this.totalizar();
    }

    totalizar() {
        this.initTotales();
        this.detalles.forEach(fila => {
            try {
                this.totales.subtotal += fila.dt_cant * fila.dt_precio;
            } catch (e) {
                console.error('Error al totalizar', e);
            }
        });
        this.totales.total = this.totales.subtotal;
        if (this.formaspago && this.formaspago.length > 0) {
            this.formaspago[0].dt_valor = this.totales.total;
        }

        if (this.formaspago && this.formaspago.length > 1) {
            this.formaspago[1].dt_valor = 0.0;
        }
    }

    creaPlanTratamiento() {
        // Verificar que haya ingresado el nombre y haya seleccionado el profesional a cargo
        if (this.formplan.pnt_nombre.trim().length === 0) {
            this.swalService.fireToastError('Debe ingresar el nombre del plan');
        } else if (this.detalles.length === 0) {
            this.swalService.fireToastError('Debe agregar items al plan de tratamiento');
        } else {
            this.formcab.trn_docpen = 'T';
            const form = {
                formplan: this.formplan,
                form_cab: this.formcab,
                form_persona: {per_codigo: this.codpaciente},
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
                }
            });
        }
    }

    quitarItem(fila: any) {
        this.arrayService.removeElement(this.detalles, fila);
        this.totalizar();
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

    showDetallesPlan(plan) {
        this.plansel = plan;
        this.loadinUIServ.publishBlockMessage();
        this.planService.getDetallesPlan(this.plansel.pnt_id).subscribe(res => {
            if (res.status === 200) {
                this.datosDocPlan.plan = res.plan;
                this.datosDocPlan.doc = res.doc;
            }
        });
    }

    cerrarVerDetallesFact() {
        this.plansel = {};
        this.datosDocPlan = {};
    }

    calculaPagos(filapago) {
        const total = this.totales.total;
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
}
