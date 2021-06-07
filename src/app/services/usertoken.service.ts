import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class UsertokenService extends BaseService {

    constructor(protected http: HttpClient,
                private localStorageService: LocalStorageService,
                private ctes: CtesService) {
        super('/tfusertoken', localStorageService, http);
    }

    getFormEdita(usId: number): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        const httpOptions = this.getHOT({accion: 'formedita'});
        return this.doGet(this.http, endpoint, httpOptions);
    }

    getFormCrea(): Observable<any> {
        return this._doGetAction(this.ctes.formcrea);
    }

    listarUsuarios(): Observable<any> {
        return this._doGetAction(this.ctes.listar);
    }

    guardarRoles(usId: number, rolesList: any): Observable<any> {
        return this._doPostAction('setroles', {us_id: usId, roles: rolesList});
    }

    crearUsuario(form: any, formcli: any): Observable<any> {
        return this._doPostAction('creauser', {form, formcli});
    }

    getMenu(usId: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'gmenu'});
        const endpoint = this.urlEndPoint + '/' + usId.toString();
        return this.doGet(this.http, endpoint, httpOptions);
    }

    chkrol(rol: string): Observable<any> {
        return this._doPostAction(this.ctes.chkrol, {rol});
    }

}
