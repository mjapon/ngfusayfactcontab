import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class AsirubroService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService,
                private ctes: CtesService) {
        super('/tasirubro', localStrgServ, http);
    }

    getForm() {
        return this._doGetAction(this.ctes.form, {});
    }

    listar(desde, hasta) {
        return this._doGetAction(this.ctes.listar, {desde, hasta});
    }

    guardar(items) {
        return this._doPostAction(this.ctes.guardar, {items});
    }

}
