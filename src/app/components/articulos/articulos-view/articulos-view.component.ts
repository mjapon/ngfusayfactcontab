import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {ArticulostockService} from '../../../services/articulostock.service';
import {KardexProdService} from '../../../services/kardex-prod.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {CtesService} from '../../../services/ctes.service';
import {BaseComponent} from '../../shared/base.component';

@Component({
    selector: 'app-articulos-view',
    templateUrl: './articulos-view.component.html'
})
export class ArticulosViewComponent extends BaseComponent implements OnInit {
    artId: number;
    isShowKardex = false;
    kardex: [];
    datosart: any = {};

    constructor(private artService: ArticuloService,
                private router: Router,
                private swalService: SwalService,
                private ctes: CtesService,
                private loadingServ: LoadingUiService,
                private kardexProdService: KardexProdService,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.artId = parseInt(params.get(this.ctes.art_id), 10);
        });
    }

    retornar() {
        this.router.navigate([this.ctes.mercaderia]);
    }

    editar() {
        this.router.navigate([this.ctes.mercaderiaForm, this.artId]);
    }

    elminar() {
        this.swalService.fireDialog(this.ctes.msgSureWishRemoveRecord).then(confirm => {
            if (confirm.value) {
                this.artService.anularArticulo(this.artId).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.retornar();
                    }
                });
            }
        });
    }

    verKardex() {
        this.kardex = [];
        this.loadingServ.publishBlockMessage();
        this.kardexProdService.getKardex(this.artId).subscribe(res => {
            this.isShowKardex = true;
            if (this.isResultOk(res)) {
                this.kardex = res.items;
            }
        });
    }

    onDatosArtLoaded($event: any) {
        this.datosart = $event;
    }
}
