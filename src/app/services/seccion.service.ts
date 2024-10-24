import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class SeccionService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService,
                private ctes: CtesService) {
        super('/tseccion', localStrgServ, http);
    }

    listar(): Observable<any> {
        return this._doGetAction(this.ctes.listar);
    }

    addTodos(secciones: Array<any>) {
        const returnlist = [{sec_id: 0, sec_nombre: 'Todos'}];
        returnlist.push(...secciones);
        return returnlist;
    }

    listarUserSecs() {
        return this._doGetAction('listarusec');
    }

    setSeccion(secid: number): Observable<any> {
        return this._doPostAction(this.ctes.setseccion, {sec_id: secid});
    }

}

