import {Injectable} from '@angular/core';
import {BaseService} from "./base-service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "./local-storage.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BlogService extends BaseService {

    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tblog', localStrgServ);
    }

    listar(): Observable<any> {
        const httpOptions = this.getHttpOptions({accion: 'listar'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }


}
