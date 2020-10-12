import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsertokenService extends BaseService {

    constructor(private http: HttpClient,
                private localStorageService: LocalStorageService) {
        super('/tfusertoken', localStorageService);
    }

    getFormEdita(usId: number): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        const httpOptions = this.getHttpOptionsToken({accion: 'formedita'});
        return this.doGet(this.http, endpoint, httpOptions);
    }

    listarUsuarios(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listar'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    guardarRoles(usId: number, rolesList: any): Observable<any> {
        const form = {us_id: usId, roles: rolesList};
        const httpOptions = this.getHttpOptionsToken({accion: 'setroles'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, form);
    }

    listarPermisos(usId: number): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'lpermisos'});
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        return this.doGet(this.http, endpoint, httpOptions);
    }

    getMenu(usId: number): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'gmenu'});
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        return this.doGet(this.http, endpoint, httpOptions);
    }

}