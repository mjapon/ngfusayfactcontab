import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AsientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tasiento', localStrgServ, http);
    }

    getDoc(trncod: number) {
        return this._doGet(this.getHOT({accion: 'gdetdoc', trncod}));
    }


}
