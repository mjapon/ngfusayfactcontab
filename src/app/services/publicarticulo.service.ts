import {Injectable} from '@angular/core';
import {BaseService} from "./base-service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "./local-storage.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class PublicarticuloService extends BaseService {
    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/public/titemconfig', localStrgServ);
    }

    listarTeleServicios(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptions({
            accion: 'teleservicios'
        });

        return this.http.get(endopoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );

    }

}



