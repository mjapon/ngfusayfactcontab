import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RolService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/trol', localStrgServ);
    }

    listar(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listar'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    listaForUsers(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listafu'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getFormCrear(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'form'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getFormEditar(rolid): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'editar'});
        const url = this.urlEndPoint + '/' + rolid;
        return this.doGet(this.http, url, httpOptions);
    }

    crear(form: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'crear'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {form});
    }

    editar(form: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'editar'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {form});
    }

    anular(rlId: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'anular'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {rl_id: rlId});
    }

}
