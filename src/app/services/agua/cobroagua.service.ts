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

}
