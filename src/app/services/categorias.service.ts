import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService extends BaseService {

  constructor(private http: HttpClient,
              protected localStrgService: LocalStorageService) {
    super('/categorias', localStrgService);
  }

  listar(): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptionsToken({accion: 'listar'});

    return this.http
      .get(endpoint, httpOptions)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(this.fnProcesaError)
      );
  }
}
