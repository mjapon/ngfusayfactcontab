import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OdontogramaService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/todontograma', localStrgServ, http);
    }

    getForm(pacId: number, tipo: number): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({accion: 'form', pac: pacId, tipo});
        return this.doGet(this.http, endopoint, httpOptions);
    }

    guardar(form: any): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({});
        return this.doPost(this.http, endopoint, httpOptions, form);
    }

    getCss() {
        return this._doGetAction('getccss');
    }

    getHisto(pac) {
        return this._doGetAction('histo', {pac});
    }

    getOdontoHisto(odhid) {
        return this._doGetAction('getodonhisto', {odhid});
    }
}
