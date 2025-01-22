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
    private baseTomcat = environment.tomcat;
    private urlFilesAttach = environment.baseUrlDwfile;

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

    getRxDocUrl(doc: any) {
        const schema = this.fautService.getEsquema();
        return `${this.urlFilesAttach}?sqm=${schema}&codoc=${doc.rxd_id}`;
    }

    getDownloadUrlNode(doc: any) {
        const emp = this.fautService.getEmpCodigo();
        const burl = this.baseTomcat;
        return `${burl}/attach/${emp}/${doc.rxd_id}?tipo=rxd`;
    }

    getDownloadAdjUrlNode(doc: any) {
        const emp = this.fautService.getEmpCodigo();
        const burl = this.baseTomcat;
        return `${burl}/attach/${emp}/${doc.pgc_adj}?tipo=adj`;
    }

    eliminar(codoc: any) {
        return this._doPostAction(this.ctes.borrar, {cod: codoc});
    }

    editar(form: any) {
        return this._doPostAction(this.ctes.editar, form);
    }

    openWindows(url) {
        window.open(url, '_blank', 'toolbar=yes,scrollb ars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

}
