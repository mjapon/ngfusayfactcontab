import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';


@Injectable({
    providedIn: 'root'
})
export class OdatencionesService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/todatenciones', localStrgServ, http);
    }

    getForm(pacId: number) {
        const httpOptions = this.getHOT({accion: 'form', pac: pacId});
        return this._doGet(httpOptions);
    }

    getDetallesAtencion(ateId: number) {
        return this._doGet(this.getHOT({accion: 'gdet', ate_id: ateId}));
    }

    getHistoria(pacId: number) {
        const httpOptions = this.getHOT({accion: 'historia', pac: pacId});
        return this._doGet(httpOptions);
    }

    crear(form: any) {
        const httpOptions = this.getHOT({accion: 'crear'});
        return this._doPost(httpOptions, form);
    }

    anular(ateId: number) {
        const httpOptions = this.getHOT({accion: 'anular'});
        return this._doPost(httpOptions, {ate_id: ateId});
    }

}
