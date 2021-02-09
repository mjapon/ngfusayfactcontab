import {Component, OnInit} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {Router} from '@angular/router';
import {ArticuloService} from '../../../../services/articulo.service';
import {DomService} from '../../../../services/dom.service';

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
                this.domService.setFocusTimeout('ctasAutoCom', 100);
            }
        });
    }

    cancelar() {
        this.router.navigate(['librodiario']);
    }

    agregar() {
        this.detalles.push(this.formdetinst);
        this.formdetinst = this.domService.clonarObjeto(this.formdet);
        this.ctacontablesel = null;
        this.totalizar();
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
        console.log('onEnterFiltroCtas---> ', $event);
    }

    onCtaContableSelect($event: any) {
        console.log('cuenta contable select:', $event);
        this.setCtaContableSel($event);
    }

    quitarItem(fila: any) {
        console.log('Logica para quitar item');
    }

    totalizar() {
        let total = 0.0;
        this.detalles.forEach(item => {
            total += item.dt_valor;
        });

        this.totales.debe = total;
    }
}
