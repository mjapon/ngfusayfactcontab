import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';

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

    librodiario: Array<any>;
    totales: any;
    isLoading = false;
    desde: Date;
    hasta: Date;

    constructor(private router: Router,
                private asientoService: AsientoService,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.loadLibroDiario();
    }

    gotoFormAsiento() {
        this.router.navigate(['newasiento']);
    }

    loadLibroDiario() {
        this.isLoading = true;
        this.asientoService.getAsientos().subscribe(res => {
            this.isLoading = false
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
        this.swalService.fireToastInfo('Ver detalles');
    }
}
