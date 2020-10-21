import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LugarService extends BaseService {

    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tlugar', localStrgServ);
    }

    listarTodos(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'listar'});
        return this.doGet(this.http, endopoint, httpOptions);
    }

}
