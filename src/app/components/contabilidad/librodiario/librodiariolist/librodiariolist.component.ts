import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';
import {FechasService} from '../../../../services/fechas.service';
import {ArticuloService} from "../../../../services/articulo.service";

@Component({
    selector: 'app-librodiariolist',
    templateUrl: './librodiariolist.component.html',
    styles: [
        `
            .haberl {
                margin-left: 70px;
            }
        `]
})
export class LibrodiariolistComponent implements OnInit {

    librodiario: Array<any> = [];
    totales: any;
    isLoading = false;
    desde: Date;
    hasta: Date;
    isShowDetAsi = false;
    asisel: any = {};
    formfiltros: any = {};
    ctasContables: Array<any>;

    constructor(private router: Router,
                private asientoService: AsientoService,
                private artService: ArticuloService,
                private fechasService: FechasService,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        const ctasObs = this.artService.getAllCtasContables().subscribe(resCtas => {
            this.ctasContables = resCtas.items || [];
        });

        this.asientoService.getFormFiltroLibroDiario().subscribe(res => {
            this.formfiltros = res.form;
            this.formfiltros.desde = this.fechasService.parseString(this.formfiltros.desde);
            this.formfiltros.hasta = this.fechasService.parseString(this.formfiltros.hasta);
            this.loadLibroDiario();
        });


    }

    gotoFormAsiento() {
        this.router.navigate(['newasiento', 0]);
    }

    gotoEditAsiento(fila) {
        const msg = '¿Seguro que desea editar este asiento?';
        this.swalService.fireDialog(msg, '').then(confirm => {
            if (confirm.value) {
                this.router.navigate(['newasiento', fila.trn_codigo]);
            }
        });
    }

    gotoCloneAsiento(fila) {
        const msg = '¿Confirma que desea crear una copia de este asiento?';
        this.swalService.fireDialog(msg, '').then(confirm => {
            if (confirm.value) {
                this.router.navigate(['newasiento', fila.trn_codigo], {queryParams: {accion: 'clone'}});
            }
        });
    }

    gotoRevertAsiento(fila) {
        const msg = '¿Confirma que desea crear un reverso de este asiento?';
        this.swalService.fireDialog(msg, '').then(confirm => {
            if (confirm.value) {
                this.router.navigate(['newasiento', fila.trn_codigo], {queryParams: {accion: 'revert'}});
            }
        });
    }

    loadLibroDiario() {
        let desdestr = '';
        if (this.formfiltros.desde) {
            desdestr = this.fechasService.formatDate(this.formfiltros.desde);
        }
        let hastastr = '';
        if (this.formfiltros.hasta) {
            hastastr = this.fechasService.formatDate(this.formfiltros.hasta);
        }
        this.isLoading = true;
        const ctaCodigo = this.formfiltros.cta_codigo || '';
        this.asientoService.getAsientos(desdestr, hastastr, ctaCodigo).subscribe(res => {
            this.isLoading = false;
            if (res.status === 200) {
                this.librodiario = res.items;
                this.totales = res.totales;
            }
        });
    }

    anular(fila: any) {
        this.swalService.fireDialog('¿Seguro que desea anular este asiento?').then(confirm => {
            if (confirm.value) {
                this.asientoService.anular(fila.trn_codigo, '').subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadLibroDiario();
                    }
                });
            }
        });
    }

    verDetalles(fila: any) {
        this.asisel = fila;
        this.isShowDetAsi = true;
    }

    hideDetAsi() {
        this.isShowDetAsi = false;
    }

    onDesdeChange($event: any) {

    }

    onHastaChange($event: any) {

    }

    onTipoFechaSel() {
        this.loadLibroDiario();
    }

    onCuentaContableChange($event: any) {
        this.loadLibroDiario();

    }
}
