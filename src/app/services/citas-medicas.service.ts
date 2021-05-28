import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CitasMedicasService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService
    ) {
        super('/tconsultam', localStrgServ, http);
    }

    getForm(): Observable<any> {
        return this._doGetAction(this.ctes.form);
    }

    getCie10Data(): Observable<any> {
        return this._doGetAction('cie10data');
    }

    crearCita(form: any): Observable<any> {
        return this._doPostAction(this.ctes.registra, form);
    }

    editarCita(form: any): Observable<any> {
        return this._doPostAction(this.ctes.editar, form);
    }

    getListaAtenciones(ciruc: string): Observable<any> {
        return this._doGetAction('listaatenciones');
    }

    getDatosHistoriaByCod(codhistoria: any): Observable<any> {
        return this._doGetAction('findhistbycod');
    }

    imprimir(ccm: any) {
        const sqm = this.fautService.getEsquema();
        const baseurl = this.ctes.urlTomcat;
        const url = `${baseurl}/RecetaServlet?ccm=${ccm}&sqm=${sqm}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirRecBlank() {
        const sqm = this.fautService.getEsquema();
        const baseurl = this.ctes.urlTomcat;
        const url = `${baseurl}/RecetaEmptyServlet?sqm=${sqm}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirHistoria(ch: any) {
        const sqm = this.fautService.getEsquema();
        const baseurl = this.ctes.urlTomcat;
        const url = `${baseurl}/HistoriaClinicaServlet?ch=${ch}&sqm=${sqm}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    getDescValExamFisico(categ: number, valor: any) {
        return this._doGetAction('galertexfis', {valor, categ});
    }

    anular(cosmId: number, obs): Observable<any> {
        return this._doPostAction(this.ctes.anular, {cosm_id: cosmId, cosm_obsanula: obs});
    }

    listarPrevias(tipo: number, filtro: string, desde: string, hasta: string, pag: number) {
        return this._doGetAction('cpreviasfiltropag', {tipo, filtro, desde, hasta, pag});
    }

    listarProximas(tipofecha: number, tipocita: number) {
        return this._doGetAction('proxcitas', {tipofecha, tipocita});
    }
}
