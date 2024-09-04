import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../../services/articulo.service';
import {AsientoService} from '../../../../services/asiento.service';
import {forkJoin} from 'rxjs';
import {FechasService} from '../../../../services/fechas.service';
import {SwalService} from '../../../../services/swal.service';

@Component({
    selector: 'app-libromayorlist',
    templateUrl: './libromayorlist.component.html'
})
export class LibromayorlistComponent implements OnInit {
    isLoading = true;
    ctasContables: Array<any>;
    totales: any;
    detalles: Array<any>;
    form: any;
    grid: any;
    selectedItem: any;
    isLoadingData: any;
    isShowDetAsi = false;
    asisel: any = {};
    rows = 25;
    page = 0;

    constructor(private artService: ArticuloService,
                private fechasService: FechasService,
                private swalService: SwalService,
                private asientoService: AsientoService) {
    }

    ngOnInit(): void {
        this.isLoadingData = false;
        this.grid = {data: [], cols: []};
        this.totales = {totdebe: 0.0, tothaber: 0.0, resta: 0.0};
        this.initFormListas();
    }

    initFormListas() {
        const ctasObs = this.artService.getAllCtasContables();
        const formObs = this.asientoService.getFormLibroMayor();
        this.isLoading = true;
        forkJoin([ctasObs, formObs]).subscribe(res => {
            const res0 = res[0];
            const res1 = res[1];
            if (res0.status === 200) {
                this.ctasContables = res0.items;
            }
            if (res1.status === 200) {
                this.form = res1.form;
                this.form.desde = this.fechasService.parseString(res1.form.desde);
                this.form.hasta = this.fechasService.parseString(res1.form.hasta);
            }
            this.isLoading = false;
        });
    }

    loadMovs() {
        if (this.form.cta_codigo && this.form.desde && this.form.hasta) {
            const desdestr = this.fechasService.formatDate(this.form.desde);
            const hastastr = this.fechasService.formatDate(this.form.hasta);
            this.isLoadingData = true;
            this.asientoService.listarMovsCtaContable(this.form.cta_codigo, desdestr, hastastr).subscribe(res => {
                if (res.status === 200) {
                    this.grid = res.res.grid;
                    this.totales = res.res.totales;
                }
                this.isLoadingData = false;
            });
        }
    }

    onRowSelect($event: any) {

    }

    verDetalles(rowData: any) {
        this.asisel = rowData;
        this.isShowDetAsi = true;
    }

    onCuentaContableChange($event: any) {
        this.loadMovs();
    }

    hideDetAsi() {
        this.isShowDetAsi = false;
    }

    protected readonly Math = Math;
}
