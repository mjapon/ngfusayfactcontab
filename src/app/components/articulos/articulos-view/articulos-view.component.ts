import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {ArticulostockService} from '../../../services/articulostock.service';

@Component({
    selector: 'app-articulos-view',
    templateUrl: './articulos-view.component.html',
    styleUrls: ['./articulos-view.component.css']
})
export class ArticulosViewComponent implements OnInit {

    artId: number;
    artFromDb: any;
    stock: Array<any> = [];

    constructor(private artService: ArticuloService,
                private router: Router,
                private swalService: SwalService,
                private artStockService: ArticulostockService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.artFromDb = {};
        this.route.paramMap.subscribe(params => {
            this.artId = parseInt(params.get('art_id'), 10);
            this.artService.getByCod(this.artId).subscribe(res => {
                if (res.status === 200) {
                    this.artFromDb = res.datosprod;
                }
            });
            this.artStockService.getForm(this.artId).subscribe(resStock => {
                if (resStock.status === 200) {
                    this.stock = resStock.form_secs;
                }
            });
        });
    }

    retornar() {
        this.router.navigate(['mercaderia']);
    }

    editar() {
        this.router.navigate(['mercaderiaForm', this.artId]);
    }

    elminar() {
        const nombreProd = this.artFromDb.ic_nombre;
        const msg = '¿Seguro que desea eliminar ' + nombreProd + ' ?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.artService.anularArticulo(this.artFromDb.ic_id).subscribe(res => {
                    if (res.status === 200) {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.retornar();
                        }
                    }
                });
            }
        });
    }
}
