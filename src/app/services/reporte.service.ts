import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';
import {Injectable} from '@angular/core';
import {DomService} from './dom.service';
import {FechasService} from './fechas.service';
import {ArrayutilService} from './arrayutil.service';

@Injectable({
    providedIn: 'root'
})
export class ReporteService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService,
        private domService: DomService,
        private arrayService: ArrayutilService,
        private fechasService: FechasService
    ) {
        super('/treporte', localStrgServ, http);
    }

    listar() {
        return this._doGetAction(this.ctes.listar);
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    clearParams(repsel: any, form: any) {
        if (!repsel.params.secid) {
            form.secid = 0;
        }
        if (!repsel.params.usid) {
            form.usid = 0;
        }
        if (!repsel.params.refid) {
            form.refid = 0;
        }
    }

    getParsedParams(form: any, codrep: number, secciones: Array<any>, usuarios: Array<any>) {
        const pdesde = this.fechasService.formatDateDb(form.desde);
        const phasta = this.fechasService.formatDateDb(form.hasta);
        const secid = form.secid;
        const refid = form.refid;
        const usid = form.usid;
        const fmt = form.formato;
        const sqm = this.fautService.getEsquema();

        const labelparamsArray = [];
        labelparamsArray.push(`Fechas:${pdesde} - ${phasta}`);
        if (secid > 0) {
            const sec = this.arrayService.findSeccion(secciones, secid);
            if (sec) {
                labelparamsArray.push(`Sección:${sec.sec_nombre}`);
            }
        }
        if (usid > 0) {
            const user = this.arrayService.findUsuario(usuarios, usid);
            if (user) {
                labelparamsArray.push(`Usuario:${user.nomapel}`);
            }
        }
        if (refid > 0) {
            labelparamsArray.push(`Referente:${form.referente.nomapel}`);
        }
        const labelparams = labelparamsArray.join(',');
        return {sqm, codrep, pdesde, phasta, secid, refid, usid, fmt, labelparams};
    }

    imprimirReporte(params: any) {
        const urlTomcat = this.ctes.urlTomcat;
        const urlparams = this.domService.getUrlParams(params);
        const url = `${urlTomcat}/ReporteServlet?${urlparams}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

}
