import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventosService extends BaseService {
  constructor(
    private http: HttpClient,
    protected localStrgServ: LocalStorageService
  ) {
    super('/fusay/events', localStrgServ);
  }

  getForm(): Observable<any> {
    const httpOptions = this.getHttpOptions({accion: 'form'});
    return this.doGet(this.http, this.urlEndPoint, httpOptions);
  }

  getListas(): Observable<any> {
    const httpOptions = this.getHttpOptions({accion: 'listas'});
    return this.doGet(this.http, this.urlEndPoint, httpOptions);
  }

  listarEventos(): Observable<any> {
    const httpOptions = this.getHttpOptions({accion: 'data'});
    return this.doGet(this.http, this.urlEndPoint, httpOptions);
  }

  crearEvento(form: any) {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({accion: 'guardar'});
    return this.http.post(endpoint, form, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }

  anularEvento(form: any) {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({accion: 'anular'});
    return this.http.post(endpoint, form, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }

  getDatosEvento(eventId: number) {
    const endpoint = this.urlEndPoint + '/' + eventId.toString();
    const httpOptions = this.getHttpOptions({});
    return this.doGet(this.http, endpoint, httpOptions);
  }
}
