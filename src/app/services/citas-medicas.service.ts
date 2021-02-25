import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {FautService} from './faut.service';

@Injectable({
    providedIn: 'root'
})
export class CitasMedicasService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService
    ) {
        super('/tconsultam', localStrgServ, http);
    }

    getForm(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'form'});
        return this._doGet(httpOptions);
    }

    getCie10Data(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'cie10data'});
        return this._doGet(httpOptions);
    }

    crearCita(form: any): Observable<any> {
        const httpOptions = this.getHOT({accion: 'registra'});
        return this._doPost(httpOptions, form);
    }

    editarCita(form: any): Observable<any> {
        const httpOptions = this.getHOT({accion: 'editar'});
        return this._doPost(httpOptions, form);
    }

    getListaAtenciones(ciruc: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'listaatenciones', ciruc});
        return this._doGet(httpOptions);
    }

    getDatosHistoriaByCod(codhistoria: any): Observable<any> {
        const httpOptions = this.getHOT({accion: 'findhistbycod', codhistoria});
        return this._doGet(httpOptions);
    }

    imprimir(ccm: any) {
        const sqm = this.fautService.getEsquema();
        const rutaserver = 'https://mavil.site/tomcat/imprentas/RecetaServlet?ccm=' + ccm + '&sqm=' + sqm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

    imprimirRecBlank() {
        const sqm = this.fautService.getEsquema();
        const rutaserver = 'https://mavil.site/tomcat/imprentas/RecetaEmptyServlet?sqm=' + sqm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

    imprimirHistoria(ch: any) {
        const sqm = this.fautService.getEsquema();
        const rutaserver = 'https://mavil.site/tomcat/imprentas/HistoriaClinicaServlet?ch=' + ch + '&sqm=' + sqm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

    getDescValExamFisico(categ: number, valor: any) {
        const httpOptions = this.getHOT({accion: 'galertexfis', valor, categ});
        return this._doGet(httpOptions);
    }

    anular(cosmId: number, obs): Observable<any> {
        const httpOptions = this.getHOT({accion: 'anular'});
        return this._doPost(httpOptions, {cosm_id: cosmId, cosm_obsanula: obs});
    }

    listarPrevias(tipo: number, filtro: string, desde: string, hasta: string, pag: number) {
        const httpOptions = this.getHOT({accion: 'cpreviasfiltropag', tipo, filtro, desde, hasta, pag});
        return this._doGet(httpOptions);
    }

    listarProximas(tipofecha: number, tipocita: number) {
        const httpOptions = this.getHOT({accion: 'proxcitas', tipofecha, tipocita});
        return this._doGet(httpOptions);
    }
}
