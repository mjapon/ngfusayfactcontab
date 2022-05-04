import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import { FautService } from './faut.service';
import { CtesService } from './ctes.service';

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

    listarCreditos(codper: number, clase: number) {
        return this._doGet(this.getHOT({accion: 'listarcreds', per: codper, clase}));
    }

    getDatosCredito(codcred: number) {
        return this._doGet(this.getHOT({accion: 'gdet', codcred}));
    }

    listarGrid(tipo, desde, hasta, filtro) {
        return this._doGet(this.getHOT({accion: 'listargrid', tipo, desde, hasta, filtro}));
    }

    getFormCrea(clase, ref) {
        return this._doGet(this.getHOT({accion: 'gformcrea', clase, ref}));
    }

    guardaCredRef(form: any) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }    

}
