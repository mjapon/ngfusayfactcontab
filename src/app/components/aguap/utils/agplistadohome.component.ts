import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CtesService} from '../../../services/ctes.service';
import {BaseComponent} from '../../shared/base.component';

@Component({
    selector: 'app-agplistadohome',
    template: `
        <div>
            <app-agplistado [gridNombre]="gridName" [isShowFechas]="isShowFechas"></app-agplistado>
        </div> `
})
export class AgplistadohomeComponent extends BaseComponent {
    gridName = '';
    isShowFechas = false;

    constructor(private route: ActivatedRoute,
                private ctes: CtesService) {
        super();
        this.route.paramMap.subscribe(params => {
            this.isShowFechas = true;
            this.gridName = params.get(this.ctes.grid);
            this.isShowFechas = !(this.gridName === this.ctes.agp_contratos);
        });
    }
}
