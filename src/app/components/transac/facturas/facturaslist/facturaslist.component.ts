import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {startOfMonth} from 'date-fns';
import {FechasService} from '../../../../services/fechas.service';
import {LocalStorageService} from '../../../../services/local-storage.service';

@Component({
    selector: 'app-facturaslist',
    templateUrl: './facturaslist.component.html'
})
export class FacturaslistComponent implements OnInit {
    title: any;
    filtro: string;
    isLoading: boolean;
    grid: any;
    selectedItem: any;
    isShowDetallesFactura: boolean;
    codFacturaSel: number;
    form: any = {};
    previustimer: any = 0;
    totales: any;
    transaccs: Array<any> = [];
    @Input() tracodigo: number;
    @Input() tipo: number;

    constructor(private router: Router,
                private asientoService: AsientoService,
                private localStgServ: LocalStorageService,
                private fechasservice: FechasService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.title = 'Compras';
        if (this.tipo === 1) {
            this.title = 'Ventas';
        }
        this.filtro = '';
        this.isLoading = true;
        this.grid = {};
        this.isShowDetallesFactura = false;
        const hasta = new Date();
        const desde = startOfMonth(hasta);
        this.form = {desde, hasta, tipo: this.tipo};
        this.asientoService.listarTransaccsBytTipo(this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.transaccs = res.items;
            }
            this.form.tracod = 0;
            this.listar();
        });
    }


    ondesdechange() {

    }

    onhastachange() {

    }

    filtroDelayFn(context) {
        context.listar();
    }

    delayKeyup(callback, ms, prevtimer, context) {
        clearTimeout(prevtimer);
        return setTimeout(() => {
            callback(context);
        }, ms);
    }

    doFilter($event: KeyboardEvent) {
        this.previustimer = this.delayKeyup(this.filtroDelayFn, 500, this.previustimer, this);
    }

    listar() {
        let desde = '';
        let hasta = '';
        if (this.form.desde) {
            desde = this.fechasservice.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            hasta = this.fechasservice.formatDate(this.form.hasta);
        }
        this.isLoading = true;
        this.asientoService.listarGridVentas(desde, hasta, this.filtro, this.form.tracod, this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                this.totales = res.totales;
            }
            this.isLoading = false;
        });
    }

    goToForm() {
        this.router.navigate(['trndocform', this.tracodigo, 'c']);
    }

    goToFormFact(tipo, $event: MouseEvent) {
        $event.preventDefault();
        this.router.navigate(['trndocform', tipo, 'c']);
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    verRow(rowData) {
        this.codFacturaSel = rowData.trn_codigo;
        this.isShowDetallesFactura = true;
    }

    closeDetFact() {
        this.isShowDetallesFactura = false;
    }

    onEditar($event: any) {
        this.closeDetFact();
        this.localStgServ.setItem('trncoded', $event);
        this.router.navigate(['trndocform', this.tracodigo, 'e']);
    }
}
