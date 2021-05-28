import {Injectable} from '@angular/core';
import {BaseService} from '../base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';
import {CtesService} from '../ctes.service';

@Injectable({
    providedIn: 'root'
})
export class LectomedaguaService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgService: LocalStorageService,
                private ctes: CtesService) {
        super('/tagplectomed', localStrgService, http);
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    guardar(form) {
        return this._doPostAction(this.ctes.crea, form);
    }

    getLast(numed) {
        return this._doGetAction(this.ctes.last, {numed});
    }

    getPrevius(numed, anio, mes) {
        return this._doGetAction(this.ctes.previous, {numed, anio, mes});
    }

    getConsumosPend(codmed) {
        return this._doGetAction(this.ctes.conspend, {codmed});
    }

    generaConsumo(form) {
        const actual = form.lmd_valor;
        const anterior = form.lmd_valorant || 0;
        let consumo = 0;
        try {
            consumo = parseInt(actual, 10) - parseInt(anterior, 10);
            if (!consumo) {
                consumo = 0;
            } else if (consumo < 0) {
                consumo = 0;
            }
        } catch (e) {
            consumo = 0;
        }
        return consumo;
    }

    clearForm(form) {
        form.lmd_valorant = 0;
        form.lmd_valor = 0;
        form.lmd_consumo = 0;
        form.mdg_id = 0;
        form.lmd_obs = '';
    }


}
