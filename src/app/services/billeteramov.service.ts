import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class BilleteramovService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService,
                private ctes: CtesService) {
        super('/tbilleteramov', localStrgServ, http);
    }

    getForm(clase) {
        return this._doGetAction(this.ctes.form, {clase});
    }

    crear(form) {
        return this._doPostAction(this.ctes.crear, form);
    }

    listargrid(desde, hasta, tipo, cuenta, cuentabill, user) {
        return this._doGetAction(this.ctes.listargrid, {desde, hasta, tipo, cuenta, cuentabill, user});
    }

    getFormFiltros() {
        return this._doGetAction(this.ctes.formfiltros);
    }

    getCuentasBytTipo(tipo) {
        return this._doGetAction(this.ctes.getcuentasbytipo, {tipo});
    }

    getDatosMov(movid) {
        return this._doGetAction(this.ctes.getdatosmov, {movid});
    }

    anular(codmov: number) {
        return this._doPostAction(this.ctes.anular, {codmov});
    }

    confirmar(codmov: number) {
        return this._doPostAction(this.ctes.confirmar, {codmov});
    }
}
