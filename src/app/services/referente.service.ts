import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReferenteService extends BaseService {

  constructor(private http: HttpClient,
              protected localStrgServ: LocalStorageService) {
    super('/referentes', localStrgServ);
  }

  listarProveedores(): Observable<any> {
    return this.listar(2);
  }

  listarClientes(): Observable<any> {
    return this.listar(1);
  }

  listarPersonal(): Observable<any> {
    return this.listar(3);
  }

  getForm(tipo: number): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptionsToken({
      accion: 'form', ref_tipo: tipo
    });

    return this.doGet(this.http, endpoint, httpOptions);
    /*
    return this.http.get(endpoint, httpOptions)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(this.fnProcesaError)
      );
      */
  }

  guardarForm(form: any): Observable<any> {
    const endpoint = this.urlEndPoint + '/' + form.ref_id;
    const httpOptions = this.getHttpOptionsToken({});
    return this.doPost(this.http, endpoint, httpOptions, form);
    /*
    return this.http.post(endpoint, form, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(this.fnProcesaError)
      );
     */

  }

  listar(tipo: number): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptionsToken({
      accion: 'listar', ref_tipo: tipo
    });

    return this.doGet(this.http, endpoint, httpOptions);

    /*
    return this.http.get(endpoint, httpOptions)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(this.fnProcesaError)
      );
     */
  }

}
