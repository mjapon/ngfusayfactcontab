import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ArticulostockService extends BaseService {

    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/titemconfigsotck', localStrgServ);
    }


    getForm(icId: number): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'form', ic_id: icId});

        return this.doGet(this.http, endopoint, httpOptions);
    }

    guardar(form: any): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'guardar'});
        return this.doPost(this.http, endopoint, httpOptions, form);
    }


}
