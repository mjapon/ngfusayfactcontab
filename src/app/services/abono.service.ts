import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AbonoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tasiabono', localStrgServ, http);
    }

    getform(tracod: number) {
        return this._doGet(this.getHOT({accion: 'form', tracod}));
    }

    crear(form: any) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    listaAbonosFact(trncod: number) {
        return this._doGet(this.getHOT({accion: 'abosfact', trncod}));
    }

    anularAbono(codabo, obs) {
        const form = {codabo, obs};
        return this._doPost(this.getHOT({accion: 'anular'}), form);
    }
}
