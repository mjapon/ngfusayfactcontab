import {Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FormsModule} from '@angular/forms';
import {CtesService} from '../../../../services/ctes.service';
import {BaseComponent} from '../../../shared/base.component';
import {AppModule} from '../../../../app.module';

@Component({
    selector: 'app-supplier-purchase-entry',
    templateUrl: './supplier-purchase-entry.component.html',
    styleUrl: './supplier-purchase-entry.component.scss'
})
export class SupplierPurchaseEntryComponent extends BaseComponent implements OnInit {

    tracodigo = this.ctes.TRACODCOMRA;
    form: any;

    constructor(private ctes: CtesService) {
        super();
    }

    ngOnInit(): void {
        this.form = {
            form_cab: {},
            form_persona: {},
            detalles: [],
            pagos: [],
            totales: {}
        };
    }

    onguardar() {
        console.log('on guardar');
    }

    oncancelar() {
        console.log('on cancelar');
    }


}
