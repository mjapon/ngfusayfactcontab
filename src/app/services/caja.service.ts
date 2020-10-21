import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CajaService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/cajas', localStrgServ);
    }

    getform(tdvCod: string): Observable<any> {
        const endpoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'form', tdv_codigo: tdvCod});
        return this.http
            .get(endpoint, httpOptions)
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError(this.fnProcesaError)
            );
    }

    guardarAperturaCaja(form: any, tdvCod: string): Observable<any> {
        const endpoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'apertura', tdv_codigo: tdvCod});
        return this.http.post(endpoint, form, httpOptions)
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError(this.fnProcesaError)
            );
    }

}
