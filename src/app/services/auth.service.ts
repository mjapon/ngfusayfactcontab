import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DefaultRestResponse, UserDataSession } from '../model/contribs';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private messageSource = new BehaviorSubject('empty');
  currentMessage = this.messageSource.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    super('/auth/movil', localStorageService);
  }

  autenticar(empresa: string, usuario: string, clave: string): Observable<any> {
    const endpoint = this.urlEndPoint;
    const form: any = {
      empresa,
      usuario,
      clave
    };

    return this.http.post(endpoint, form).pipe(
      map((response: any) => {
        return response as any;
      }),
      catchError(this.fnProcesaError)
    );
  }

  isAuthenticated(): boolean {
    return this.localStorageService.getItem('islogged') != null;
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  getTdvCodigo() {
    return this.localStorageService.getItem('tdvCodigo');
  }

  getAuthToken() {
    return this.localStorageService.getItem('authtoken');
  }
}
