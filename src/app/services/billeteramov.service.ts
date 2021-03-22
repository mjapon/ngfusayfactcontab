import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BilleteramovService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tbilleteramov', localStrgServ, http);
    }

    getForm(clase) {
        return this._doGet(this.getHOT({accion: 'form', clase}));
    }

    crear(form) {
        console.log('Form que se envia en la peticion es:', form);
        return this._doPost(this.getHOT({accion: 'crear'}), form);
    }

    listargrid(desde, hasta, tipo, cuenta){
        return this._doGet(this.getHOT({accion: 'listargrid', desde, hasta, tipo, cuenta}));
    }
}
