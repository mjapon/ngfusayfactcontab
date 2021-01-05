import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';

@Injectable({
    providedIn: 'root'
})
export class RecetaService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService
    ) {
        super('/treceta', localStrgServ, http);
    }

    listar(pacId: number) {
        return this._doGet(this.getHOT({accion: 'listar', pac: pacId}));
    }

    getForm() {
        return this._doGet(this.getHOT({accion: 'form'}));
    }

    guardar(form: any) {
        return this._doPost(this.getHOT({accion: 'guardar'}), form);
    }

    anular(form: any) {
        return this._doPost(this.getHOT({accion: 'anular'}), form);
    }

    imprimir(codReceta: any) {
        const sqm = this.fautService.getEsquema();
        const rutaserver = 'https://mavil.site/tomcat/imprentas/RecetaOdServlet?rec=' + codReceta + '&sqm=' + sqm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }
}
