import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersonaService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tpersona', localStrgServ, http);
    }

    getForm(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'form'});
        return this._doGet(httpOptions);
    }

    buscarPorCi(pciruc: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscaci', ciruc: pciruc});
        return this._doGet(httpOptions);
    }

    buscarPorCifull(pciruc: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscacifull', ciruc: pciruc});
        return this._doGet(httpOptions);
    }

    buscarPorCodfull(perid: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscaporidfull', perid});
        return this._doGet(httpOptions);
    }

    buscarPorEmail(pemail: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscaci', email: pemail});
        return this._doGet(httpOptions);
    }

    buscarPorNomapel(nomapel: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'filtronomapel', filtro: nomapel});
        return this._doGet(httpOptions);
    }

    buscarPorNomapelCiPag(filtro: string, pag: number) {
        const httpOptions = this.getHOT({accion: 'filtropag', filtro, pag});
        return this._doGet(httpOptions);
    }

    guardar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form.per_id;
        const httpOptions = this.getHOT({});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    actualizar(perId: number, form: any) {
        const endpoint = this.urlEndPoint + '/' + perId;
        const httpOptions = this.getHOT({});
        return this.doPut(this.http, endpoint, httpOptions, form);
    }

    listarProveedores(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscatipo', per_tipo: 3});
        return this._doGet(httpOptions);
    }

    listarMedicos(tipo: number): Observable<any> {
        return this._doGet(this.getHOT({accion: 'lmedicos', tipo}));
    }
}
