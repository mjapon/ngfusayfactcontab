import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

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

    guardar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form['per_id'];
        const httpOptions = this.getHttpOptions({});
        return this.http.post(endpoint, form, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    listarProveedores(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'buscatipo', per_tipo: 3});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    public publishMsgToObs(message: string) {
        this.messageSource.next(message);
    }

}
