import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "../base-service";
import { CtesService } from "../ctes.service";
import { LocalStorageService } from "../local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class FinanCuentasService extends BaseService {

    constructor(
        protected http: HttpClient,
        private ctes: CtesService,
        protected localStrgServ: LocalStorageService
    ) {
        super('/fin/cuentas', localStrgServ, http);
    }

    getForm(perid) {
        return this._doGetAction(this.ctes.form, { perid });
    }

    existeCtaAhorro(perid) {
        return this._doGetAction('chkexist', { perid });
    }

    crear(form: any) {
        return this._doPostAction('apertura', form);
    }

    getDatosCuenta(perid, tipo) {
        return this._doGetAction('gdatoscuenta', { perid, tipo });
    }

    getDatosCuentaByNum(numcta) {
        return this._doGetAction('gdatctabynum', { numcta });
    }

    getCuentasSocio(socio) {
        return this._doGetAction('listctasbysocio', { socio });
    }

}