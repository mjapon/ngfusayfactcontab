import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ContribFormResponse,
  ContribListResponse,
  DefaultRestResponse
} from '../model/contribs';
import { BaseService } from './base-service';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContribuyenteService extends BaseService {
  constructor(
    private http: HttpClient,
    protected localStrgServ: LocalStorageService
  ) {
    super('/contribuyente', localStrgServ);
  }

  findByRuc(pruc: string): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({ accion: 'find', ruc: pruc });
    return this.http.get(endpoint, httpOptions).pipe(
      map((response: any) => {
        console.log('Response que llega es:');
        console.log(response);
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }

  findByCod(cntId: number): Observable<ContribFormResponse> {
    const endpoint = this.buildUrlEndPoint('/' + cntId);
    const httpOptions = this.getHttpOptions({ accion: 'form' });

    return this.http.get(endpoint, httpOptions).pipe(
      map((response: any) => {
        console.log('response in service:');
        console.log(response);
        return response as ContribFormResponse;
      }),
      catchError(this.fnProcesaError)
    );
  }

  listar(): Observable<ContribListResponse> {
    return this.http.get(this.urlEndPoint).pipe(
      map((response: any) => {
        return response as ContribListResponse;
      }),
      catchError(this.fnProcesaError)
    );
  }

  save(form: any): Observable<DefaultRestResponse> {
    const endpoint = this.buildUrlEndPoint('/' + form.cnt_id);
    return this.http.post(endpoint, form).pipe(
      map((response: any) => {
        console.log('response in service:');
        console.log(response);
        return response as DefaultRestResponse;
      }),
      catchError(this.fnProcesaError)
    );
  }
}
