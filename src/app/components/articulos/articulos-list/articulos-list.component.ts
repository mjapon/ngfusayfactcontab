import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {Router} from '@angular/router';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-articulos-list',
    templateUrl: './articulos-list.component.html',
    styleUrls: ['./articulos-list.component.css']
})
export class ArticulosListComponent implements OnInit {

    filtro: string;
    items: Array<any>;
    cols: Array<any>;
    selectedArt: any;

    faEdit = faEdit;

    constructor(private artsService: ArticuloService,
                private domService: DomService,
                private router: Router) {
    }

    ngOnInit() {
        this.items = new Array<any>();
        this.filtro = '';
        this.listar();
        this.domService.setFocus('buscaInput');
    }

    doFilter(ev: any) {
        console.log('filterring-->');
        console.log(ev);
        this.listar();
    }

    listar() {
        this.artsService.listar(this.filtro)
            .subscribe(response => {
                if (response.status === 200) {
                    const grid = response.data;
                    this.items = grid.data;
                    this.cols = grid.cols;
                    console.log('Valor de grid es:');
                    console.log(grid);
                }
            });
    }

    selectArt(item: any) {
        this.selectedArt = item;
        this.router.navigate(['mercaderiaForm', item.art_id]);
    }

    goToForm() {
        this.router.navigate(['mercaderiaForm', 0]);
    }


}
