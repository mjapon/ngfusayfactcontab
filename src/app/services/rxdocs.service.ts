import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RxdocsService extends BaseService {

    private baseUrlDwfile = environment.baseUrlDwfile;
    private baseUrlDwFileNode = environment.baseUrlDwfileNode;

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService
    ) {
        super('/todrxdocs', localStrgServ, http);
    }

    getForm(pacId: number, tipo: number) {
        return this._doGet(this.getHOT({accion: 'form', pac_id: pacId, tipo}));
    }

    listar(pacId: number, tipo: number) {
        return this._doGet(this.getHOT({accion: 'listar', pac_id: pacId, tipo}));
    }

    crear(form: any) {
        return this._doPost(this.getHOT({accion: 'crear'}), form);
    }

    getDownloadUrl(coddoc: any) {
        const sqm = this.fautService.getEsquema();
        const burl = this.baseUrlDwfile;
        return `${burl}?sqm=${sqm}&codoc=${coddoc}`;
    }

    getDownloadUrlNode(doc: any) {
        const sqm = this.fautService.getEsquema();
        const burl = this.baseUrlDwFileNode;
        return `${burl}/getrxdoc/${sqm}/${doc.rxd_id}/${doc.rxd_filename}`;
    }

    eliminar(codoc: any) {
        return this._doPost(this.getHOT({accion: 'borrar'}), {cod: codoc});
    }

    editar(form: any) {
        return this._doPost(this.getHOT({accion: 'editar'}), form);
    }

}
