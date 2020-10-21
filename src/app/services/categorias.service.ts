import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriasService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgService: LocalStorageService) {
        super('/categorias', localStrgService);
    }

    listar(): Observable<any> {
        const endpoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'listar'});
        return this.doGet(this.http, endpoint, httpOptions);
    }

    crear(nombre: string): Observable<any> {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptionsToken({accion: 'crear'});
        return this.doPost(this.http, endpoint, httpOptions, {'catic_nombre': nombre});
    }

    actualizar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form['catic_id'];
        const httpOptions = this.getHttpOptionsToken({accion: 'actualizar'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    anular(caticId: number) {
        const endpoint = this.urlEndPoint + '/' + caticId;
        const httpOptions = this.getHttpOptionsToken({accion: 'anular'});
        return this.doPost(this.http, endpoint, httpOptions, {});
    }

}
