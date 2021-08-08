import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class AsientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService,
        private ctes: CtesService
    ) {
        super('/tasiento', localStrgServ, http);
    }

    getDoc(trncod: number, foredit = 0) {
        return this._doGetAction(this.ctes.gdetdoc, {trncod, foredit});
    }

    getFormCab(traCod: number) {
        return this._doGetAction(this.ctes.formcab, {tra_cod: traCod});
    }

    auxListarFacturas(per, clase) {
        return this._doGetAction(this.ctes.gfact, {per, clase});
    }

    listarGridVentas(desde, hasta, filtro, tracod, tipo) {
        return this._doGetAction(this.ctes.gridventas, {desde, hasta, filtro, tracod, tipo});
    }

    crearDocumento(form: any) {
        return this._doPostAction(this.ctes.creadoc, form);
    }

    anular(trncod: number, obs: string) {
        const form = {trncod, obs};
        return this._doPostAction(this.ctes.anular, form);
    }

    duplicar(trncod: number) {
        return this._doPostAction(this.ctes.duplicar, {trn_codigo: trncod});
    }

    getAsientoForm() {
        return this._doGetAction(this.ctes.formasiento);
    }

    crearAsiento(form: any) {
        return this._doPostAction(this.ctes.creasiento, form);
    }

    editarAsiento(form: any) {
        return this._doPostAction(this.ctes.editasiento, form);
    }

    getAsientos(desde, hasta) {
        return this._doGetAction(this.ctes.getasientos, {desde, hasta});
    }

    listarMovsCtaContable(cta, desde, hasta) {
        return this._doGetAction(this.ctes.getmovscta, {cta, desde, hasta});
    }

    getFormLibroMayor() {
        return this._doGetAction(this.ctes.getformlibromayor);
    }

    getDatosAsiContab(cod: number) {
        return this._doGetAction(this.ctes.getdatosasiconta, {cod});
    }

    getBalanceGeneral(desde, hasta) {
        return this._doGetAction(this.ctes.getbalancegeneral, {desde, hasta});
    }

    getEstadoResultados(desde, hasta) {
        return this._doGetAction(this.ctes.getestadoresultados, {desde, hasta});
    }

    listarTransaccsBytTipo(tipo) {
        return this._doGetAction(this.ctes.gettransaccs, {tipo});
    }

    imprimirFactura(trncod) {
        const sqm = this.fautService.getEsquema();
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/Factura?trn=${trncod}&sqm=${sqm}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirAbono(trncod) {
        const sqm = this.fautService.getEsquema();
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/Abono?trn=${trncod}&sqm=${sqm}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    getFormFiltroLibroDiario() {
        return this._doGetAction(this.ctes.formfiltrolibd);
    }

    changeSeccion(form) {
        return this._doPostAction(this.ctes.changesec, form);
    }

    getFormChangeSec(trncod) {
        return this._doGetAction(this.ctes.formchangesec, {trncod});
    }

}
