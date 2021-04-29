import {Component, OnInit} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticuloService} from '../../../../services/articulo.service';
import {DomService} from '../../../../services/dom.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';
import {SwalService} from '../../../../services/swal.service';
import {NumberService} from '../../../../services/number.service';
import {FechasService} from '../../../../services/fechas.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';

@Component({
    selector: 'app-librodiarioform',
    templateUrl: './librodiarioform.component.html',
    styles: [
            `.haberl {
            margin-left: 70px;
        }
        `]
})
export class LibrodiarioformComponent implements OnInit {
    isLoading = true;
    formasiento: any;
    formref: any;
    formdet: any;
    currentdate = new Date();
    ctasFiltrados: Array<any>;
    detalles: Array<any>;
    ctacontablesel: any;
    formdetinst: any;
    totales: any;
    codasi: number;

    constructor(private asientoService: AsientoService,
                private artService: ArticuloService,
                private domService: DomService,
                private fechasService: FechasService,
                private numberServ: NumberService,
                private swalService: SwalService,
                private arrayService: ArrayutilService,
                private loadingServ: LoadingUiService,
                private route: ActivatedRoute,
                private router: Router) {
        this.route.paramMap.subscribe(params => {
            this.codasi = parseInt(params.get('cod'), 10);
        });
    }

    ngOnInit(): void {
        this.detalles = [];
        this.formdetinst = {};
        this.totales = {
            debe: 0.0,
            haber: 0.0
        };
        this.loadForm();
    }

    loadForm() {
        this.isLoading = true;
        this.asientoService.getAsientoForm().subscribe(res => {
            if (res.status === 200) {
                this.formasiento = res.form.formasiento;
                this.formasiento.trn_fecregobj = this.fechasService.parseString(this.formasiento.trn_fecreg);
                this.formref = res.form.formref;
                this.formdet = res.form.formdet;
                this.formdetinst = this.domService.clonarObjeto(this.formdet);
                this.setFocusInCtaConta();
                if (this.codasi > 0) {
                    this.asientoService.getDatosAsiContab(this.codasi).subscribe(resasi => {
                        this.isLoading = false;
                        if (resasi.status === 200) {
                            this.detalles = resasi.datoasi.detalles;
                            const auxformasiento = this.domService.clonarObjeto(this.formasiento);
                            this.formasiento = resasi.datoasi.cabecera;
                            this.formasiento.trn_fecregobj = this.fechasService.parseString(this.formasiento.trn_fecreg);
                            this.formasiento.estabptoemi = auxformasiento.estabptoemi;
                            this.formasiento.impuestos = auxformasiento.impuestos;
                            this.totalizar();
                        }
                    });
                } else {
                    this.isLoading = false;
                }
            }
        });
    }

    setFocusInCtaConta() {
        this.domService.setFocusTimeout('ctasAutoCom', 100);
    }

    cancelar() {
        this.gotoLibroDiario();
    }

    gotoLibroDiario() {
        this.router.navigate(['librodiario']);
    }

    agregar() {
        if (this.ctacontablesel) {
            let dtValor = Number(this.formdetinst.dt_valor_in);
            if (!dtValor) {
                dtValor = 0.0;
            }
            if (dtValor > 0) {
                this.formdetinst.dt_valor = dtValor;
                this.detalles.push(this.formdetinst);
                this.formdetinst = this.domService.clonarObjeto(this.formdet);
                this.ctacontablesel = null;
                this.totalizar();
                this.setFocusInCtaConta();
            } else {
                this.swalService.fireToastError('Monto incorrecto');
            }
        } else {
            this.swalService.fireToastError('Seleccione la cuenta contable');
        }
    }

    buscaCtasContables($event: any) {
        this.artService.busCtasContables($event.query).subscribe(res => {
            if (res.status === 200) {
                this.ctasFiltrados = res.items;
            }
        });
    }

    setCtaContableSel(art) {
        this.formdetinst.cta_codigo = art.ic_id;
        this.formdetinst.ic_nombre = art.ic_nombre;
        this.formdetinst.ic_code = art.ic_code;
        this.formdetinst.per_codigo = 0;
        this.formdetinst.dt_cant = 1;
        this.formdetinst.dt_valor = 0.0;
        this.formdetinst.dt_debito = 1;
    }

    onEnterFiltroCtas($event) {
        this.setFocusInMonto();
    }

    onCtaContableSelect($event: any) {
        this.setCtaContableSel($event);
    }

    quitarItem(fila: any) {
        this.swalService.fireDialog('¿Seguro que desea eliminar esta fila?').then(confirm => {
            if (confirm.value) {
                this.arrayService.removeElement(this.detalles, fila);
                this.totalizar();
            }
        });
    }

    totalizar() {
        let totaldebe = 0.0;
        let totalhaber = 0.0;
        this.detalles.forEach(item => {
            if (item.dt_debito === 1) {
                totaldebe += Number(item.dt_valor);
            } else {
                totalhaber += Number(item.dt_valor);
            }
        });
        this.totales.debe = this.numberServ.round2(totaldebe);
        this.totales.haber = this.numberServ.round2(totalhaber);
    }

    setFocusInMonto() {
        this.domService.setFocusTimeout('montoInput', 100);
    }

    setDtDebitoValue(value: number) {
        this.formdetinst.dt_debito = value;
        this.setFocusInMonto();
    }

    onEnterMonto() {
        this.agregar();
    }

    guardar() {
        if (this.detalles.length === 0) {
            this.swalService.fireToastError('Debe agregar items al asiento contable');
        }

        if (this.formasiento.trn_fecregobj) {
            this.formasiento.trn_fecreg = this.fechasService.formatDate(this.formasiento.trn_fecregobj);
        }

        const formtopost = {
            formcab: this.formasiento,
            formref: this.formref,
            detalles: this.detalles
        };

        let msg = '¿Confirma el registro de este asiento?';
        if (this.codasi > 0) {
            msg = '¿Confirma la actualización de este asiento?';
        }
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.loadingServ.publishBlockMessage();
                if (this.codasi > 0) {
                    this.asientoService.editarAsiento(formtopost).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.gotoLibroDiario();
                        }
                    });
                } else {
                    this.asientoService.crearAsiento(formtopost).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.gotoLibroDiario();
                        }
                    });
                }
            }
        });
    }

    onDtValorChange(fila) {
        let dtValor = Number(fila.dt_valor_in);
        if (!dtValor) {
            dtValor = 0.0;
        }
        fila.dt_valor = dtValor;
        this.totalizar();
    }

    switchDebeHaber(fila: any) {
        fila.dt_debito = fila.dt_debito * -1;
        this.totalizar();
    }

    movUp(fila: any) {
        const findex = this.detalles.indexOf(fila);
        if (findex > 0) {
            this.arrayService.moveElement(this.detalles, findex, findex - 1);
        } else {
            this.swalService.fireToastWarn('No se posible');
        }
    }

    movDown(fila: any) {
        const findex = this.detalles.indexOf(fila);
        if (findex < this.detalles.length - 1) {
            this.arrayService.moveElement(this.detalles, findex, findex + 1);
        } else {
            this.swalService.fireToastWarn('No se posible');
        }
    }

    marcarTexto($event: any) {
        $event.target.select();
    }
}
