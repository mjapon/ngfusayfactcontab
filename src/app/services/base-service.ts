import {Observable, throwError} from 'rxjs';
import swal from 'sweetalert2';
import {LocalStorageService} from './local-storage.service';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

export class BaseService {
    protected urlEndPoint: string;
    private baseUrlEndPoint = environment.baseUrlEndPoint;

    constructor(urlPath: string,
                protected localStrgServ: LocalStorageService,
                protected http: HttpClient) {
        this.urlEndPoint = this.baseUrlEndPoint + urlPath;
    }

    protected getHO(pparams): any {
        return {
            headers: {'Content-Type': 'application/json'},
            params: pparams
        };
    }

    protected getHOT(pparams): any {
        const token = this.localStrgServ.getAuthToken();
        return {
            headers: {
                'x-authtoken': token
            },
            params: pparams
        };
    }

    protected fnProcesaError(e) {
        const msgept = 'Error al procesar petición';
        const error = 'error';
        if (e) {
            if (e.status === 400) {
                // return throwError(e);
            }
            if (e.msg) {
                swal.fire('', e.msg, error);
            } else {
                swal.fire(msgept, 'Verifique su conexión a internet', error);
            }
        } else {
            swal.fire(msgept, 'Error desconocido', error);
        }
        return throwError(e);
    }

    protected doGet(
        http: HttpClient,
        endpoint: string,
        httpOptions: any
    ): Observable<any> {
        return http.get(endpoint, httpOptions).pipe(
            map(res => {
                return res;
            }),
            catchError(this.fnProcesaError)
        );
    }

    protected doPost(
        http: HttpClient,
        endpoint: string,
        httpOptions: any,
        form: any
    ): Observable<any> {
        return http.post(endpoint, form, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    protected doPut(
        http: HttpClient,
        endpoint: string,
        httpOptions: any,
        form: any
    ): Observable<any> {
        return http.put(endpoint, form, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    protected doDelete(
        http: HttpClient,
        endpoint: string,
        httpOptions: any,
    ): Observable<any> {
        return http.delete(endpoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    protected _doGet(httpOptions) {
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    protected _doGetAction(accion, params = {}) {
        return this._doGet(this.getHOT({accion, ...params}));
    }

    protected _doPostAction(accion, form) {
        return this._doPost(this.getHOT({accion}), form);
    }

    protected _doPost(httpOptions, form) {
        return this.doPost(this.http, this.urlEndPoint, httpOptions, form);
    }

    protected _doPut(httpOptions, form) {
        return this.doPut(this.http, this.urlEndPoint, httpOptions, form);
    }

    protected _doPutEntity(entitycod, httpOptions, form) {
        return this.doPut(this.http, `${this.urlEndPoint}/${entitycod}`, httpOptions, form);
    }

    protected _doPostEntity(entitycod, httpOptions, form) {
        return this.doPost(this.http, `${this.urlEndPoint}/${entitycod}`, httpOptions, form);
    }

}
