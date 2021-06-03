import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CtesService} from '../../../services/ctes.service';
import {BaseComponent} from '../../shared/base.component';

@Component({
    selector: 'app-agplistadohome',
    template: `
        <div>
            <app-agplistado [gridNombre]="grid"></app-agplistado>
        </div> `
})
export class AgplistadohomeComponent extends BaseComponent {
    grid = '';

    constructor(private route: ActivatedRoute,
                private ctes: CtesService) {
        super();
        this.route.paramMap.subscribe(params => {
            this.grid = params.get(this.ctes.grid);
        });
    }
}
