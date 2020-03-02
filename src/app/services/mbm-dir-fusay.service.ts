import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MbroDir } from '../model/mbrodir';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MbmDirFusayService extends BaseService {
  constructor(
    private http: HttpClient,
    protected localStrgServ: LocalStorageService
  ) {
    super('/fusay/miembrodir', localStrgServ);
  }

  findByTipo(ptipo: string): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({
      accion: 'btipo',
      tipo: ptipo
    });

    console.log("endpoint que se ejecuta->");
    console.log(endpoint);
    console.log("parametros");
    console.log(httpOptions);

    return this.http.get(endpoint, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }

  /*
  private collectionName = 'directiva';

  getAll(): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection<MbroDir>(this.collectionName).get();
  }

  getByTipo(tipo: string): Observable<firebase.firestore.QuerySnapshot> {
    return this.db
      .collection<MbroDir>(this.collectionName, ref =>
        ref.where('tipo', '==', tipo)
      )
      .get();
  }

  save(mbmdir: MbroDir): Promise<DocumentReference> {
    return this.db.collection(this.collectionName).add(mbmdir);
  }
  */
}
