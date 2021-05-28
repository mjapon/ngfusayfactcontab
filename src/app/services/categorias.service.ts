import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CategoriasService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgService: LocalStorageService,
                private ctes: CtesService) {
        super('/categorias', localStrgService, http);
    }

    listar(): Observable<any> {
        return this._doGetAction(this.ctes.listar);
    }

    getFormCrea(): Observable<any> {
        return this._doGetAction(this.ctes.formcrea);
    }

    crear(form): Observable<any> {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHOT({accion: this.ctes.crear});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    actualizar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form.catic_id;
        const httpOptions = this.getHOT({accion: this.ctes.actualizar});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    anular(caticId: number) {
        const endpoint = this.urlEndPoint + '/' + caticId;
        const httpOptions = this.getHOT({accion: this.ctes.anular});
        return this.doPost(this.http, endpoint, httpOptions, {});
    }

}
