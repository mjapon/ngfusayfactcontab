import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VentaticketService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tventaticket', localStrgServ);
    }

    getForm(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'form'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getFormListar(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'forml'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getCuentas(tipoId: number): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'gcuentas', tipo: tipoId});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    listar(tipo: any, cuenta: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listar', tipo, cuenta});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    guardar(formVT: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'guardar'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, formVT);
    }

    anular(vtid: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'anular'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {vt_id: vtid});
    }

    confirmar(vtid: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'confirmar'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {vt_id: vtid});
    }

}
