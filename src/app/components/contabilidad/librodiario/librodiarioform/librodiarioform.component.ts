import {Component, OnInit} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {Router} from '@angular/router';
import {ArticuloService} from '../../../../services/articulo.service';
import {DomService} from '../../../../services/dom.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';
import {SwalService} from "../../../../services/swal.service";

@Component({
    selector: 'app-librodiarioform',
    templateUrl: './librodiarioform.component.html'
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

    constructor(private asientoService: AsientoService,
                private artService: ArticuloService,
                private domService: DomService,
                private swalService: SwalService,
                private arrayService: ArrayutilService,
                private router: Router) {

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
            this.isLoading = false;
            if (res.status === 200) {
                this.formasiento = res.form.formasiento;
                this.formref = res.form.formref;
                this.formdet = res.form.formdet;
                this.formdetinst = this.domService.clonarObjeto(this.formdet);
                this.setFocusInCtaConta();
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
        let dtValor = Number(this.formdetinst.dt_valor_in);
        if (!dtValor) {
            dtValor = 0.0;
        }
        this.formdetinst.dt_valor = dtValor;
        this.detalles.push(this.formdetinst);
        this.formdetinst = this.domService.clonarObjeto(this.formdet);
        this.ctacontablesel = null;
        this.totalizar();
        this.setFocusInCtaConta();
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
        this.totales.debe = totaldebe;
        this.totales.haber = totalhaber;
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
        const formtopost = {
            formcab: this.formasiento,
            formref: this.formref,
            detalles: this.detalles
        };

        this.swalService.fireDialog('¿Confirma la creación de este asiento?').then(confirm => {
            if (confirm.value) {
                this.asientoService.crearAsiento(formtopost).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.gotoLibroDiario();
                    }
                });
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
}
