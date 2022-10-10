import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "../base-service";
import { CtesService } from "../ctes.service";
import { FautService } from "../faut.service";
import { LocalStorageService } from "../local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class FinanPagosService extends BaseService {

    constructor(protected http: HttpClient,
        private ctes: CtesService,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService) {
        super('/fin/pago', localStrgServ, http);
    }

    getTablaPagos(cred) {
        return this._doGetAction('tblpagos', { cred });
    }

    getFormCalcPagos() {
        return this._doGetAction('gformcalpagos');
    }

    calcularValoresPagar(cuotas, fecpago) {
        return this._doPostAction('calcuotaspago', { cuotas, fecpago });
    }

    getFormMarcaPagado(cuotas) {
        return this._doPostAction('cuotasformarcapago', { cuotas });
    }

    guardarMarcarPagados(form){
        return this._doPostAction('savemarcapag', { form });
    }

    guardarPago(form) {
        return this._doPostAction('savepago', { form });
    }

    anularPago(form) {
        return this._doPostAction('anulapago', { form })
    }

    getDetallesPago(codpago) {
        return this._doGetAction('gdetpago', { codpago });
    }

}