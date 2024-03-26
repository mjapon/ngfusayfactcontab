import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "../base-service";
import { CtesService } from "../ctes.service";
import { FautService } from "../faut.service";
import { LocalStorageService } from "../local-storage.service";


@Injectable({
    providedIn: 'root'
})
export class FinanCreditosService extends BaseService {
    constructor(protected http: HttpClient,
        private ctes: CtesService,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService) {
        super('/fin/credito', localStrgServ, http);
    }

    getGrid(filtro, estado) {
        return this._doGetAction(this.ctes.listargrid, { filtro, estado });
    }

    getFormLista() {
        return this._doGetAction(this.ctes.formlista, {});
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    getDatosCredFull(creid) {
        return this._doGetAction('gdetcredfull', { creid });
    }

    getDatosCred(creid) {
        return this._doGetAction(this.ctes.gdetcred, { creid });
    }

    getFormAdjunto(creid) {
        return this._doGetAction('gformadj', { creid });
    }

    listarAdjuntos(creid) {
        return this._doGetAction('listadj', { creid });
    }

    guardarAdjunto(form) {
        return this._doPostAction('creaadj', form);
    }


    calculaTablaMor(form) {
        return this._doPostAction('calctablamor', form);
    }

    crearSolicutdCred(form) {
        return this._doPostAction(this.ctes.crea, form);
    }

    getFormCambioEstado(cre_id, cre_estado) {
        return {
            cre_id,
            cre_estado,
            obs: ''
        }
    }

    cambiarEstado(form) {
        return this._doPostAction(this.ctes.chgstate, form);
    }

    imprimirTablaAmor(cred) {
        const empCodigo = this.fautService.getEmpCodigo();
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/credito/${empCodigo}/${cred}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirPagare(cred) {
        const empCodigo = this.fautService.getEmpCodigo();
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/pagare/${empCodigo}/${cred}`, this.ctes._blank, this.ctes.featuresOpenNewWin);

    }
}