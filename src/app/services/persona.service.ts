import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersonaService extends BaseService {

    private messageSource = new BehaviorSubject('empty');
    observableSource = this.messageSource.asObservable();

    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tpersona', localStrgServ);
    }

    getForm(): Observable<any> {
        const httpOptions = this.getHttpOptions({accion: 'form'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    buscarPorCi(pciruc: string): Observable<any> {
        const httpOptions = this.getHttpOptions({accion: 'buscaci', ciruc: pciruc});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    buscarPorEmail(pemail: string): Observable<any> {
        const httpOptions = this.getHttpOptions({accion: 'buscaci', email: pemail});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    buscarPorNomapel(nomapel: string): Observable<any> {
        const httpOptions = this.getHttpOptions({accion: 'filtronomapel', filtro: nomapel});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    guardar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form['per_id'];
        const httpOptions = this.getHttpOptions({});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    actualizar(perId: number, form: any) {
        const endpoint = this.urlEndPoint + '/' + perId;
        const httpOptions = this.getHttpOptions({});
        return this.doPut(this.http, endpoint, httpOptions, form);
    }

    listarProveedores(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'buscatipo', per_tipo: 3});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    public publishMsgToObs(message: string) {
        this.messageSource.next(message);
    }

}
