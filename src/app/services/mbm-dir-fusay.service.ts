import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class MbmDirFusayService extends BaseService {
    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/fusay/miembrodir', localStrgServ);
    }

    findByTipo(ptipo: string): Observable<any> {
        const endpoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptions({
            accion: 'btipo',
            tipo: ptipo
        });
        return this.http.get(endpoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }
}
