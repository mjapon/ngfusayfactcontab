import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BilleteraService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tbilletera', localStrgServ, http);
    }

    getForm() {
        return this._doGet(this.getHOT({accion: 'form'}));
    }

    getFormSecs(ic) {
        return this._doGet(this.getHOT({accion: 'formsecs', ic}));
    }

    listar() {
        return this._doGet(this.getHOT({accion: 'listar'}));
    }

    crear(form) {
        return this._doPost(this.getHOT({accion: 'create'}), form);
    }

    actualizar(form) {
        return this._doPost(this.getHOT({accion: 'update'}), form);
    }

    totalizar(cta) {
        return this._doPost(this.getHOT({accion: 'recalc'}), {cta});
    }

    anular(bilid) {
        return this._doPost(this.getHOT({accion: 'anular'}), {bil_id: bilid});
    }

    hasMoves(bilid) {
        return this._doGet(this.getHOT({accion: 'bilhasmov', bilid}));
    }

}

