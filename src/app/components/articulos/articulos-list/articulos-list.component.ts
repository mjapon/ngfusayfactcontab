import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {Router} from '@angular/router';
import {DomService} from '../../../services/dom.service';
import {MenuItem} from "primeng/api";
import {SwalService} from "../../../services/swal.service";

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
    selectedCtxItem: any;
    enableBtns: boolean;

    itemsCtxMenu: MenuItem[];

    constructor(private artsService: ArticuloService,
                private domService: DomService,
                private swalService: SwalService,
                private router: Router) {
    }

    ngOnInit() {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.filtro = '';
        this.listar();
        this.domService.setFocus('buscaInput');

        this.itemsCtxMenu = [
            {label: 'Editar', icon: 'pi pi-pencil', command: (event) => this.editItem(this.selectedItem)},
            {label: 'Ver detalles', icon: 'pi pi-view', command: (event) => this.viewItem(this.selectedItem)},
            {label: 'Eliminar', icon: 'pi pi-times', command: (event) => this.deleteItem(this.selectedItem)}
        ];

    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    doFilter(ev: any) {
        this.listar();
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
        let msg = '¿Seguro que desea eliminar este registro?';

        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
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
        this.artsService.listar(this.filtro)
            .subscribe(response => {
                if (response.status === 200) {
                    const grid = response.data;
                    this.items = grid.data;
                    this.cols = grid.cols;
                }
            });
    }

    editar() {
        this.router.navigate(['mercaderiaForm', this.selectedItem.ic_id]);
    }

    goToForm() {
        this.router.navigate(['mercaderiaForm', 0]);
    }


}
