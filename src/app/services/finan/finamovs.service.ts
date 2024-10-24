import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { CtesService } from '../ctes.service';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class FinanMovService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private ctes: CtesService
    ) {
        super('/fin/movs', localStrgServ, http);
    }

    getForm(cta) {
        return this._doGetAction(this.ctes.form, { cta });
    }

    crear(form) {
        return this._doPostAction(this.ctes.crea, form);
    }

    listar(cta, desde, hasta, limit, page) {
        return this._doGetAction(this.ctes.listar, { cta, desde, hasta, limit, page });
    }
}
