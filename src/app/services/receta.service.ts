import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class RecetaService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService
    ) {
        super('/treceta', localStrgServ, http);
    }

    listar(pacId: number) {
        return this._doGetAction(this.ctes.listar, {pac: pacId});
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    guardar(form: any) {
        return this._doPostAction(this.ctes.guardar, form);
    }

    anular(form: any) {
        return this._doPostAction(this.ctes.anular, form);
    }

    imprimir(codReceta: any) {
        const sqm = this.fautService.getEsquema();
        const urlTomcat = this.ctes.urlTomcat;
        const url = `${urlTomcat}/RecetaOdServlet?rec=${codReceta}&sqm=${sqm}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }
}
