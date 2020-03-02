import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoCajaService extends BaseService {

  constructor(private http: HttpClient,
              protected localStrgServ: LocalStorageService) {
    super('/tipocaja', localStrgServ);
  }

  listarActivos() {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptionsToken({accion: 'listaractivos'});
    return this.http.get(endpoint, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.fnProcesaError)
      );

  }
}
