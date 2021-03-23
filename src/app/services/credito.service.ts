import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CreditoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tasicredito', localStrgServ, http);
    }

    listarCreditos(tracod: number, codper: number, clase: number) {
        return this._doGet(this.getHOT({accion: 'listarcreds', tracod, per: codper, clase}));
    }

    getDatosCredito(codcred: number) {
        return this._doGet(this.getHOT({accion: 'gdet', codcred}));
    }

    listarGrid(tipo, desde, hasta, filtro) {
        return this._doGet(this.getHOT({accion: 'listargrid', tipo, desde, hasta, filtro}));
    }
}
