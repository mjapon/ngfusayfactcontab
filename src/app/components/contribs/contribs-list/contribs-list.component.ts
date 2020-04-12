import {Component, OnInit} from '@angular/core';
import {ContribuyenteService} from '../../../services/contribuyente.service';
import {ContribListResponse} from '../../../model/contribs';
import {MenuItem} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
    selector: 'app-contribs-list',
    templateUrl: './contribs-list.component.html',
    styles: []
})
export class ContribsListComponent implements OnInit {
    items: Array<any>;
    cols: Array<any>;
    pSelectableRow: any;
    menu: MenuItem[];

    constructor(
        private contribServ: ContribuyenteService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.listar();
        this.menu = [
            {
                label: 'Crear',
                icon: 'pi pi-fw pi-plus'
            },
            {
                label: 'Editar',
                icon: 'pi pi-fw pi-pencil'
            }
        ];
    }

    listar() {
        this.contribServ.listar().subscribe((response: ContribListResponse) => {
            this.items = response.items;
            this.cols = response.cols;
        });
    }

    goToNew() {
        this.router.navigate(['/contribs', '5']);
    }
}
