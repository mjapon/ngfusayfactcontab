import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class ContratoaguaService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgService: LocalStorageService) {
        super('/tagpcontrato', localStrgService, http);
    }

    getForm(tipo) {
        return this._doGet(this.getHOT({accion: 'form', tipo}));
    }

    crear(form) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    findByRef(codref) {
        return this._doGet(this.getHOT({accion: 'gbyref', codref}));
    }

    getValidFieldList() {
        return [
            {name: 'cna_tarifa', msg: 'Debe seleccionar la tarifa', select: true},
            {name: 'mdg_num', msg: 'Debe ingresar el número del medidor'},
            {name: 'cna_barrio', msg: 'Debe seleccionar la comunidad', select: true},
            {name: 'cna_direccion', msg: 'Debe ingresar la dirección del servicio'}
        ];
    }

}
