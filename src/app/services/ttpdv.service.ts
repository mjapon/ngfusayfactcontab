import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TtpdvService extends BaseService {

    constructor(protected http: HttpClient,
                private localStorageService: LocalStorageService) {
        super('/ttpdv', localStorageService, http);
    }

    listarMin() {
        return this._doGet(this.getHOT({accion: 'listarm'}));
    }

    setTdvcodigo(tdvcodigo: number): Observable<any> {
        return this._doPost(this.getHOT({accion: 'setttpdv'}), {tdv_codigo: tdvcodigo});
    }
}
