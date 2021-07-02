import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReporteService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService
    ) {
        super('/treporte', localStrgServ, http);
    }

    listar() {
        return this._doGetAction(this.ctes.listar);
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    imprimirReporte(codrep: any, pdesde: string, phasta: string, secid: number, usid: number, refid: number, fmt: number) {
        const sqm = this.fautService.getEsquema();
        const urlTomcat = this.ctes.urlTomcat;
        const url = `${urlTomcat}/ReporteServlet?codrep=${codrep}&sqm=${sqm}&pdesde=${pdesde}&phasta=${phasta}&secid=${secid}&usid=${usid}&refid=${refid}&fmt=${fmt}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

}
