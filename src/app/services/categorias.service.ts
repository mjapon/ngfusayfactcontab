import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriasService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgService: LocalStorageService) {
        super('/categorias', localStrgService, http);
    }

    listar(): Observable<any> {
        const endpoint = this.urlEndPoint;
        const httpOptions = this.getHOT({accion: 'listar'});
        return this.doGet(this.http, endpoint, httpOptions);
    }

    getFormCrea(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'formcrea'});
        return this._doGet(httpOptions);
    }

    crear(form): Observable<any> {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHOT({accion: 'crear'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    actualizar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form.catic_id;
        const httpOptions = this.getHOT({accion: 'actualizar'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    anular(caticId: number) {
        const endpoint = this.urlEndPoint + '/' + caticId;
        const httpOptions = this.getHOT({accion: 'anular'});
        return this.doPost(this.http, endpoint, httpOptions, {});
    }

}
