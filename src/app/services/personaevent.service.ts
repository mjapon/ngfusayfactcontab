import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaEventService extends BaseService {

  constructor(private http: HttpClient,
              protected localStorage: LocalStorageService) {
    super('/tpersonaevent', localStorage);
  }

  personIsRegistered(evId: number, ciRuc: string): Observable<any> {
    const httpOptions = this.getHttpOptions({'accion': 'buscaperevent', 'ev_id': evId, 'ciruc': ciRuc});
    return this.doGet(this.http, this.urlEndPoint, httpOptions);
  }

  registrarPersona(evId: number, personForm: any): Observable<any> {
    personForm['ev_id'] = evId;
    const httpOptions = this.getHttpOptions({});
    return this.doPost(this.http, this.urlEndPoint, httpOptions, personForm);
  }
}
