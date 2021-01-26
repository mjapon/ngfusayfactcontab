import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class PlanService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tplan', localStrgServ, http);
    }

    getForm() {
        return this._doGet(this.getHOT({accion: 'form'}));
    }

    listarGrid(filtro) {
        return this._doGet(this.getHOT({accion: 'listarg', filtro}));
    }

    crear(form: any) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    listaPlanes() {
        return this._doGet(this.getHOT({accion: 'listaplanes'}));
    }

}
