import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CitasMedicasService extends BaseService {

    constructor(
        private http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tconsultam', localStrgServ);
    }

    getForm(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'form'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getFormOdonto(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'form_odonto'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getCie10Data(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'cie10data'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    crearCita(form: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'registra'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, form);
    }

    getListaAtenciones(ciruc: string): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listaatenciones', ciruc});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getOdontograma(ciruc: string): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'odontograma', ciruc});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getDatosHistoriaByCod(codhistoria: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'findhistbycod', codhistoria});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    imprimir(ccm: any) {
        const rutaserver = 'http://mavil.site/tomcat/imprentas/RecetaServlet?ccm=' + ccm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=500,height=700');
    }

    imprimirHistoria(ch: any) {
        const rutaserver = 'http://mavil.site/tomcat/imprentas/HistoriaClinicaServlet?ch=' + ch;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=700');
    }

    getDescValExamFisico(categ: number, valor: any) {
        const httpOptions = this.getHttpOptionsToken({accion: 'galertexfis', valor, categ});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    anular(cosmId: number): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'anular'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {cosm_id: cosmId});
    }

    listarPrevias(tipo: number, filtro: string, desde: string, hasta: string, pag: number) {
        const httpOptions = this.getHttpOptionsToken({accion: 'cpreviasfiltropag', tipo, filtro, desde, hasta, pag});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    listarProximas(tipofecha: number, tipocita: number) {
        const httpOptions = this.getHttpOptionsToken({accion: 'proxcitas', tipofecha, tipocita});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }
}
