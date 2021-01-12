import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {Router} from '@angular/router';
import {DomService} from '../../../services/dom.service';
import {MenuItem} from 'primeng/api';
import {SwalService} from '../../../services/swal.service';
import {SeccionService} from '../../../services/seccion.service';
import {LoadingUiService} from '../../../services/loading-ui.service';

@Component({
    selector: 'app-articulos-list',
    templateUrl: './articulos-list.component.html',
    styleUrls: ['./articulos-list.component.css']
})
export class ArticulosListComponent implements OnInit {

    filtro: string;
    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    enableBtns: boolean;

    itemsCtxMenu: MenuItem[];
    sections: Array<any>;
    selectedSection: any;
    previustimer: any = 0;

    constructor(private artsService: ArticuloService,
                private domService: DomService,
                private swalService: SwalService,
                private loadinUiServ: LoadingUiService,
                private seccionService: SeccionService,
                private router: Router) {
    }

    ngOnInit() {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.filtro = '';
        this.domService.setFocus('buscaInput');
        this.itemsCtxMenu = [
            {label: 'Ver detalles', icon: 'fa fa-eye', command: (event) => this.viewItem(this.selectedItem)},
            {label: 'Editar', icon: 'fa fa-pencil', command: (event) => this.editItem(this.selectedItem)},
            {label: 'Eliminar', icon: 'fa fa-trash', command: (event) => this.deleteItem(this.selectedItem)}
        ];
        this.seccionService.listar().subscribe(res => {
            if (res.status === 200) {
                this.sections = res.items;
                this.selectedSection = this.sections[0];
                this.listar();
            }
        });
    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    delayKeyup(callback, ms, prevtimer, context) {
        clearTimeout(prevtimer);
        return setTimeout(() => {
            callback(context);
        }, ms);
    }


    filtroDelayFn(context) {
        context.listar();
    }

    doFilter(ev: any) {
        this.previustimer = this.delayKeyup(this.filtroDelayFn, 500, this.previustimer, this);
    }

    editItem(rowItem: any) {
        this.selectedItem = rowItem;
        this.editar();
    }

    viewItem(rowItem: any) {
        this.selectedItem = rowItem;
        this.router.navigate(['mercaderiaView', this.selectedItem.ic_id]);
    }

    deleteItem(rowItem: any) {
        let nombreProd = rowItem.ic_nombre;
        let msg = '¿Seguro que desea eliminar ' + nombreProd + ' ?';

        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.loadinUiServ.publishBlockMessage();
                this.artsService.anularArticulo(rowItem.ic_id).subscribe(res => {
                    if (res.status === 200) {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.listar();
                        }
                    }
                });
            }
        });
    }

    listar() {
        let sec_id = this.selectedSection.sec_id;
        this.artsService.listar(this.filtro, sec_id)
            .subscribe(response => {
                if (response.status === 200) {
                    const grid = response.data;
                    this.items = grid.data;
                    this.cols = grid.cols;
                }
            });
    }

    eliminar() {
        this.deleteItem(this.selectedItem);
    }

    editar() {
        this.router.navigate(['mercaderiaForm', this.selectedItem.ic_id]);
    }

    goToIngresoRapido() {
        this.router.navigate(['mercaderiaIngrRapid']);
    }

    goToForm() {
        this.router.navigate(['mercaderiaForm', 0]);
    }

    onDobleClick(rowData) {
        this.viewItem(rowData);
    }
}
