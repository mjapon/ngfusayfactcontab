import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsertokenService extends BaseService {

    constructor(protected http: HttpClient,
                private localStorageService: LocalStorageService) {
        super('/tfusertoken', localStorageService, http);
    }

    getFormEdita(usId: number): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        const httpOptions = this.getHOT({accion: 'formedita'});
        return this.doGet(this.http, endpoint, httpOptions);
    }

    getFormCrea(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'formcrea'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    listarUsuarios(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'listar'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    guardarRoles(usId: number, rolesList: any): Observable<any> {
        const form = {us_id: usId, roles: rolesList};
        const httpOptions = this.getHOT({accion: 'setroles'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, form);
    }

    crearUsuario(form: any, formcli: any): Observable<any> {
        const theform = {form, formcli};
        const httpOptions = this.getHOT({accion: 'creauser'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, theform);
    }

    listarPermisos(usId: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'lpermisos'});
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        return this.doGet(this.http, endpoint, httpOptions);
    }

    getMenu(usId: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'gmenu'});
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        return this.doGet(this.http, endpoint, httpOptions);
    }

    chkexiste(perId: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'chkexiste', per_id: perId});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

}
