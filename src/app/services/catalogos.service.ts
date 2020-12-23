import {Injectable} from '@angular/core';
import {BaseService} from "./base-service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "./local-storage.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CatalogosService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tlistavalores', localStrgServ, http);
    }

    getCatalogos(codcat: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'ctgs', cat: codcat});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

}
