import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../../services/articulo.service';
import {DomService} from '../../../../services/dom.service';

@Component({
    selector: 'app-plantratamiento',
    templateUrl: './plantratamiento.component.html'
})
export class PlantratamientoComponent implements OnInit {
    form: any;
    servsFiltered: Array<any>;

    constructor(private artService: ArticuloService,
                private domService: DomService) {
    }

    buscaServs(event) {
        this.artService.buscaServDentales(event.query).subscribe(res => {
            if (res.status === 200) {
                this.servsFiltered = res.items;
            }
        });
    }

    onServSelect($event: any) {
        this.domService.setFocusTimeout('detalleCitaTa', 100);
    }


    ngOnInit(): void {
        this.form = {};
    }

}
