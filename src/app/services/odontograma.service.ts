import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OdontogramaService extends BaseService {
    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/todontograma', localStrgServ);
    }

    getForm(pacId: number, tipo: number): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({accion: 'form', pac: pacId, tipo});
        return this.doGet(this.http, endopoint, httpOptions);
    }

    guardar(form: any): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHttpOptionsToken({});
        return this.doPost(this.http, endopoint, httpOptions, form);
    }
}
