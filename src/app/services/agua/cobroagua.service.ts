import {BaseService} from '../base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';
import {Injectable} from '@angular/core';
import {CtesService} from '../ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CobroaguaService extends BaseService {
    constructor(protected http: HttpClient,
                private ctes: CtesService,
                protected localStrgService: LocalStorageService) {
        super('/tagpcobro', localStrgService, http);
    }

    validaPaso1(form: any) {
        const perid = form.referente?.per_id || 0;
        return perid > 0;
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    getFormPagoAdelantado(per) {
        return this._doGetAction('gformpagadel', {per});
    }

    creaPagoAdelantado(form) {
        return this._doPostAction('creapagoadelantado', form);
    }

    getAdelantos(per) {
        return this._doGetAction('getadelantos', {per});
    }

    getDatosPago(lectos) {
        return this._doPostAction(this.ctes.gcalpag, {lectos});
    }

    crearFactura(form) {
        return this._doPostAction(this.ctes.crea, form);
    }

    getIds(lecturas: Array<any>) {
        return lecturas.map(it => {
            return it[this.ctes.lmd_id];
        });
    }

    getFormPagoMavil() {
        return this._doGetAction(this.ctes.formpmavil);
    }

    getReportePagoMavil(form) {
        return this._doPostAction(this.ctes.repagmavil, form);
    }

    guardarReportePagoMavil(form) {
        return this._doPostAction(this.ctes.saverepagmavil, form);
    }

    getDetallesPago(trncod) {
        return this._doGetAction('gdatospago', {trncod});
    }

    anular(pgm_id: any) {
        return this._doPostAction(this.ctes.anular, {pgm_id});
    }

    anularAboPagoAdel(form) {
        return this._doPostAction('anularAboPagoAdel', form);
    }
}
