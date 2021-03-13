import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';
import {startOfMonth} from 'date-fns';
import {FechasService} from '../../../../services/fechas.service';

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
    form: any;
    tracod: number;
    previustimer: any = 0;
    totales: any;

    constructor(private router: Router,
                private asientoService: AsientoService,
                private fechasservice: FechasService,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.tracod = 1;
        this.title = 'Ventas';
        this.filtro = '';
        this.isLoading = true;
        this.grid = {};
        this.isShowDetallesFactura = false;
        const hasta = new Date();
        const desde = startOfMonth(hasta);
        this.form = {desde, hasta};
        this.listar();
    }

    ondesdechange() {

    }

    onhastachange() {

    }

    onfiltrofechasel() {
        this.listar();
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
        this.isLoading = true;

        let desde = '';
        let hasta = '';
        if (this.form.desde) {
            desde = this.fechasservice.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            hasta = this.fechasservice.formatDate(this.form.hasta);
        }

        this.asientoService.listarGridVentas(desde, hasta, this.filtro, this.tracod).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                this.totales = res.totales;
            }
            this.isLoading = false;
        });
    }

    goToForm() {
        this.router.navigate(['trndocform']);
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    anularRow(rowData) {
        this.swalService.fireDialog('¿Seguro que desea eliminar esta factura?').then(confirm => {
            if (confirm.value) {
                this.asientoService.anular(rowData.trn_codigo, '').subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.listar();
                    }
                });
            }
        });
    }

    verRow(rowData) {
        this.codFacturaSel = rowData.trn_codigo;
        this.isShowDetallesFactura = true;
    }

    closeDetFact() {
        this.isShowDetallesFactura = false;
    }
}
