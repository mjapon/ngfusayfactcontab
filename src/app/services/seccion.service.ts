import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SeccionService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tseccion', localStrgServ);
    }

    listar(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listar'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    setSeccion(secid: number): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'setseccion'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {sec_id: secid});
    }

}

