import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class ArticuloService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/titemconfig', localStrgServ, http);
    }

    getForm(): Observable<any> {
        return this._doGet(this.getHOT({accion: 'formcrea'}));
    }

    getByCod(artId: number): Observable<any> {
        const endopoint = this.urlEndPoint + '/' + artId;
        return this.http.get(endopoint, this.getHOT({}));
    }

    getFormEditRubro(icId: number): Observable<any> {
        const endopoint = this.urlEndPoint + '/' + icId;
        const httpOptions = this.getHOT({accion: 'formrubroedit'});
        return this.doGet(this.http, endopoint, httpOptions);
    }

    getNextCodbar(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({accion: 'seccodbarra'});
        return this.doGet(this.http, endopoint, httpOptions);
    }

    existeCodbar(codbar: string): Observable<any> {
        return this._doGet(this.getHOT({accion: 'verifcodbar', codbar}));
    }

    guardarArticulo(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form.ic_id;
        const httpOptions = this.getHOT({});
        return this.http.post(endpoint, form, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    actualizaBarcode(icId: number, newbarcode: string) {
        const endpoint = this.urlEndPoint + '/' + icId;
        const httpOptions = this.getHOT({accion: 'updatecode'});
        return this.doPost(this.http, endpoint, httpOptions, {new_ic_code: newbarcode});
    }

    anularArticulo(artId: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + artId;
        const httpOptions = this.getHOT({accion: 'del'});
        return this.doPost(this.http, endpoint, httpOptions, {dato: 'datoval'});
    }

    listar(pfiltro: string, sec_id: number, codcat: number): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({
            accion: 'listar',
            filtro: pfiltro,
            sec_id,
            codcat
        });
        return this.http.get(endopoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    buscaServDentales(filtro: string) {
        return this._doGet(this.getHOT({accion: 'gservdent', filtro}));
    }

    busArtsForTransacc(secid: number, filtro: string) {
        return this._doGet(this.getHOT({accion: 'gartsserv', filtro, sec: secid}));
    }

    busCtasContables(filtro: string) {
        return this._doGet((this.getHOT({accion: 'gctascontables', filtro})));
    }

    buscaAllServDentalles() {
        return this._doGet(this.getHOT({accion: 'gservdentall'}));
    }

    listarRubros(): Observable<any> {
        const endpoint = this.urlEndPoint;
        const httpOptions = this.getHOT({accion: 'rubrosgrid'});
        return this.doGet(this.http, endpoint, httpOptions);
    }

    getFormRubro(): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({accion: 'formrubros'});
        return this.doGet(this.http, endopoint, httpOptions);
    }

    guardarRubro(form: any) {
        const endopoint = this.urlEndPoint + '/' + form.ic_id;
        const httpOptions = this.getHOT({accion: 'guardarubro'});
        return this.doPost(this.http, endopoint, httpOptions, form);
    }

    getImpuestos() {
        return this._doGet(this.getHOT({accion: 'gimpuestos'}));
    }

    getRaizPlanCuentas(padrexpand) {
        return this._doGet(this.getHOT({accion: 'gplanc', padrexpand}));
    }

    getHijosPlanCuentas(padre) {
        return this._doGet(this.getHOT({accion: 'gplancchild', padre}));
    }

    getFormPlanCuenta(padre) {
        return this._doGet(this.getHOT({accion: 'gformplancta', padre}));
    }

    crearCtaContable(form) {
        return this._doPost(this.getHOT({accion: 'guardaplancta'}), form);
    }

    getDetCtaContable(codcta) {
        return this._doGet(this.getHOT({accion: 'gdetctacontable', codcta}));
    }

    actualizarPlanCta(form) {
        return this._doPost(this.getHOT({accion: 'updatectacontable'}), form);
    }

}
