import {Component, OnInit} from '@angular/core';
import {ArticuloService} from "../../../services/articulo.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-articulos-view',
    templateUrl: './articulos-view.component.html',
    styleUrls: ['./articulos-view.component.css']
})
export class ArticulosViewComponent implements OnInit {

    artId: number;
    artFromDb: any;

    constructor(private artService: ArticuloService,
                private router: Router,
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
        });
    }

    retornar() {
        this.router.navigate(['mercaderia']);
    }
}
