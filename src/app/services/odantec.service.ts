import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OdAntecService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/todantecedentes', localStrgServ, http);
    }

    getLastValid(pacId, tipo) {
        const httpOptions = this.getCommonHead(tipo, pacId, 'lastvalid');
        return this._doGet(httpOptions);
    }

    getDetallesById(antid) {
        const httpoptions = this.getHOT({accion: 'detbyid', cod: antid});
        return this._doGet(httpoptions);
    }

    getHistoricos(pacId, tipo) {
        const httpOptions = this.getCommonHead(tipo, pacId, 'historicos');
        return this._doGet(httpOptions);
    }

    getForm(pacId, tipo) {
        const httpOptions = this.getCommonHead(tipo, pacId, 'form');
        return this._doGet(httpOptions);
    }

    crear(form) {
        const httpOptions = this.getHOT({accion: 'crear'});
        return this._doPost(httpOptions, form);
    }

    anular(antid) {
        const httpOptions = this.getHOT({accion: 'anular'});
        return this._doPost(httpOptions, {cod: antid});
    }

    actualizar(form, antid) {
        const httpOptions = this.getHOT({accion: 'actualizar', cod: antid});
        return this._doPost(httpOptions, form);
    }

    private getCommonHead(tipo, pacId, accion) {
        return this.getHOT({
            accion,
            tipo, pac_id: pacId
        });
    }
}
