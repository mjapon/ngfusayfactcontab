import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class ModelocontabService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private ctes: CtesService
    ) {
        super('/tmodelocontab', localStrgServ, http);
    }

    listar() {
        return this._doGetAction(this.ctes.listar);
    }
}
