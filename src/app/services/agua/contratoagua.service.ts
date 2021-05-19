import {Injectable} from '@angular/core';
import {BaseService} from '../base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';

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

    findByNumMed(num) {
        return this._doGet(this.getHOT({accion: 'findbynum', num}));
    }
}
