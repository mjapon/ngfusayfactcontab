import {BaseService} from '../base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';
import {CtesService} from '../ctes.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ParamsService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private ctes: CtesService
    ) {
        super('/params', localStrgServ, http);
    }

    buscar(filtro: string, estado: number, seccion: number) {
        return this._doGetAction('listar', {filtro, estado, seccion});
    }

    getForm() {
        return this._doGetAction('form');
    }

    actualizar(body: any) {
        return this._doPutEntity(body.tprm_id, this.getHOT({}), body);
    }

    crear(body: any) {
        return this._doPostEntity(0, this.getHOT({}), body);
    }

}
