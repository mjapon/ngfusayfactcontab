import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class KardexProdService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/titemconfigaudit', localStrgServ, http);
    }

    getKardex(codprod) {
        return this._doGet(this.getHOT({accion: 'listar', codprod}));
    }

}
