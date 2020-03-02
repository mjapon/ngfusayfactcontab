import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService extends BaseService {

  constructor(private httpClient: HttpClient,
              protected localStrgService: LocalStorageService) {
    super('/unidad', localStrgService);
  }

  listar() {
    const endpoint = this.urlEndPoint;
    const httpoptions = this.getHttpOptionsToken({accion: 'listar'});

    return this.httpClient.get(endpoint, httpoptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(this.fnProcesaError)
      );
  }
}
