import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {environment} from '../../environments/environment';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class RxdocsService extends BaseService {
    private baseUrlDwFileNode = environment.baseUrlDwfileNode;

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService
    ) {
        super('/todrxdocs', localStrgServ, http);
    }

    getForm(pacId: number, tipo: number) {
        return this._doGetAction(this.ctes.form, {pac_id: pacId, tipo});
    }

    listar(pacId: number, tipo: number) {
        return this._doGetAction(this.ctes.listar, {pac_id: pacId, tipo});
    }

    crear(form: any) {
        return this._doPostAction(this.ctes.crear, form);
    }

    getDownloadUrlNode(doc: any) {
        const sqm = this.fautService.getEsquema();
        const burl = this.baseUrlDwFileNode;
        return `${burl}/getrxdoc/${sqm}/${doc.rxd_id}/${doc.rxd_filename}`;
    }

    eliminar(codoc: any) {
        return this._doPostAction(this.ctes.borrar, {cod: codoc});
    }

    editar(form: any) {
        return this._doPostAction(this.ctes.editar, form);
    }

}
