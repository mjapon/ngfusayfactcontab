import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class ArticulostockService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private ctes: CtesService
    ) {
        super('/titemconfigsotck', localStrgServ, http);
    }


    getForm(icId: number): Observable<any> {
        return this._doGetAction(this.ctes.form, {ic_id: icId});
    }

    guardar(form: any): Observable<any> {
        return this._doPostAction(this.ctes.guardar, form);
    }


}
