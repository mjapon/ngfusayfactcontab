import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class ArticuloService extends BaseService {
    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/titemconfig', localStrgServ);
    }

    getForm(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'formcrea'});
        return this.http.get(endopoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    getByCod(artId: number): Observable<any> {
        const endopoint = this.urlEndPoint + '/' + artId;
        const httpOptions = this.getHttpOptionsToken({});
        return this.http.get(endopoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    getNextCodbar(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'seccodbarra'});
        return this.doGet(this.http, endopoint, httpOptions);
    }

    existeCodbar(codbar: string): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'verifcodbar', codbar: codbar});
        return this.doGet(this.http, endopoint, httpOptions);
    }


    guardarArticulo(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form.ic_id;
        const httpOptions = this.getHttpOptionsToken({});
        return this.http.post(endpoint, form, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    anularArticulo(artId: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + artId;
        const httpOptions = this.getHttpOptionsToken({'accion': 'del'});
        return this.http.post(endpoint, {}, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    listar(pfiltro: string): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({
            accion: 'listar',
            filtro: pfiltro
        });
        return this.http.get(endopoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }
}
