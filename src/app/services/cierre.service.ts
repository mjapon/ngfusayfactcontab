import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CierreService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService,
                private ctes: CtesService) {
        super('/tcierre', localStrgServ, http);
    }

    getReporte(dia) {
        return this._doGetAction(this.ctes.reporte, {dia});
    }

    getFormAper() {
        return this._doGetAction('form_aper');
    }

}
