import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../local-storage.service';
import { CtesService } from '../ctes.service';

@Injectable({
    providedIn: 'root'
})
export class ContratoaguaService extends BaseService {
    constructor(protected http: HttpClient,
        protected localStrgService: LocalStorageService,
        private ctes: CtesService) {
        super('/tagpcontrato', localStrgService, http);
    }

    getForm(tipo) {
        return this._doGetAction(this.ctes.form, { tipo });
    }

    getFormEdit(cna) {
        return this._doGetAction(this.ctes.gformed, { cna });
    }

    crear(form) {
        return this._doPostAction(this.ctes.crea, form);
    }

    editar(form) {
        return this._doPostAction(this.ctes.editar, form);
    }

    anular(form) {
        return this._doPostAction(this.ctes.anular, form);
    }

    findByRef(codref) {
        return this._doGetAction(this.ctes.bgyref, { codref });
    }

    findByCodMed(codmed) {
        return this._doGetAction(this.ctes.gbycodmed, { codmed });
    }

    findByNumMed(num) {
        return this._doGetAction(this.ctes.findbynum, { num });
    }

    filterByNumMed(filtro) {
        return this._doGetAction(this.ctes.filterbynum, { filtro });
    }

    getGrid(gridnombre, params) {
        return this._doGetAction(gridnombre, params);
    }

    getFormLista() {
        return this._doGetAction(this.ctes.formlista);
    }

    listar(filtro) {
        return this._doGetAction(this.ctes.listar, { filtro });
    }

}
