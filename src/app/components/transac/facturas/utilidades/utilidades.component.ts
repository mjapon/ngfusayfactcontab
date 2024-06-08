import {Component, OnInit} from '@angular/core';
import {UtilventasService} from '../../../../services/utilventas.service';
import {FechasService} from '../../../../services/fechas.service';

@Component({
    selector: 'app-utilidades',
    templateUrl: './utilidades.component.html'
})
export class UtilidadesComponent implements OnInit {

    isLoading = false;
    form: any = {};
    transaccs: Array<any> = [];
    formpaspago: Array<any> = [];
    tiposprod: Array<any> = [];
    grid: any = {};
    totales: any = {};
    isLoadingGrid = false;

    constructor(private utilventasService: UtilventasService,
                private fechasService: FechasService) {
    }

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.isLoading = true;
        this.utilventasService.getForm().subscribe(res => {
            this.isLoading = false;
            if (res.status === 200) {
                this.form = res.form;
                this.form.desde = this.fechasService.parseString(res.form.desde);
                this.form.hasta = this.fechasService.parseString(res.form.hasta);
                this.transaccs = res.transaccs;
                this.formpaspago = res.formaspago;
                this.tiposprod = res.tiposprodserv;

                this.loadGrid();
            }
        });
    }

    loadGrid() {
        this.isLoadingGrid = true;

        if (this.form.desde) {
            this.form.desdestr = this.fechasService.formatDate(this.form.desde);
        }
        if (this.form.hasta) {
            this.form.hastastr = this.fechasService.formatDate(this.form.hasta);
        }

        this.utilventasService.getGrid(this.form).subscribe(res => {
            this.isLoadingGrid = false;
            if (res.status === 200) {
                this.grid = res.grid;
                this.totales = res.totales;
            }
        });
    }

    onDesdeChange($event: any) {

    }

    onHastaChange($event: any) {

    }

    onTipoFechaSel() {
        this.loadGrid();
    }

    onFiltroTipoTransaccSel($event: any) {

    }

    onFormaPagoChange($event: any) {

    }

    onTipoProdChange($event: any) {

    }
}
