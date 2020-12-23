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
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tlugar', localStrgServ, http);
    }

    listarTodos(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({accion: 'listar'});
        return this.doGet(this.http, endopoint, httpOptions);
    }

}
