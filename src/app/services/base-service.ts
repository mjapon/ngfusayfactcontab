import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

export class BaseService {
  //private baseUrlEndPoint = 'http://157.230.129.131:6543/api';
  private baseUrlEndPoint = 'http://localhost:6543/api';
  protected urlEndPoint: string;

  constructor(urlPath: string, protected localStrgServ: LocalStorageService) {
    this.urlEndPoint = this.baseUrlEndPoint + urlPath;
  }

  protected buildUrlEndPoint(path: string): string {
    return this.urlEndPoint + path;
  }

  protected getHttpOptions(pparams): any {
    return {
      headers: { 'Content-Type': 'application/json' },
      params: pparams
    };
  }

  protected getHttpOptionsToken(pparams): any {
    const token = this.localStrgServ.getAuthToken();

    const res = {
      headers: {
        'x-authtoken': token
      },
      params: pparams
    };

    return res;
  }

  protected fnProcesaError(e) {
    console.log('Entra en fnProcesaError error que llega es');
    console.log(e);
    console.log('Fin impresion mensaje de error');
    if (e) {
      if (e.status === 400) {
        // return throwError(e);
      }
      if (e.error && e.error.msg) {
        swal.fire('Error al procesar petición', e.error.msg, 'error');
      } else {
        swal.fire('Error al procesar petición', e.message, 'error');
      }
    } else {
      swal.fire('Error al procesar petición', 'Error desconocido', 'error');
    }
    return throwError(e);
  }

  protected doGet(
    http: HttpClient,
    endpoint: string,
    httpOptions: any
  ): Observable<any> {
    return http.get(endpoint, httpOptions).pipe(
      map(res => {
        return res;
      }),
      catchError(this.fnProcesaError)
    );
  }

  protected doPost(
    http: HttpClient,
    endpoint: string,
    httpOptions: any,
    form: any
  ): Observable<any> {
    return http.post(endpoint, form, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }
}
