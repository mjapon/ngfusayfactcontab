import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';

@Injectable({
    providedIn: 'root'
})
export class AsientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService
    ) {
        super('/tasiento', localStrgServ, http);
    }

    getDoc(trncod: number, foredit = 0) {
        return this._doGet(this.getHOT({accion: 'gdetdoc', trncod, foredit}));
    }

    getFormCab(traCod: number) {
        return this._doGet(this.getHOT({accion: 'formcab', tra_cod: traCod}));
    }

    auxListarFacturas(per, clase) {
        return this._doGet(this.getHOT({accion: 'gfact', per, clase}));
    }

    listarGridVentas(desde, hasta, filtro, tracod, tipo) {
        return this._doGet(this.getHOT({accion: 'gridventas', desde, hasta, filtro, tracod, tipo}));
    }

    crearDocumento(form: any) {
        return this._doPost(this.getHOT({accion: 'creadoc'}), form);
    }

    anular(trncod: number, obs: string) {
        const form = {trncod, obs};
        return this._doPost(this.getHOT({accion: 'anular'}), form);
    }

    duplicar(trncod: number) {
        return this._doPost(this.getHOT({accion: 'duplicar'}), {trn_codigo: trncod});
    }

    getAsientoForm() {
        return this._doGet(this.getHOT({accion: 'formasiento'}));
    }

    crearAsiento(form: any) {
        return this._doPost(this.getHOT({accion: 'creasiento'}), form);
    }

    editarAsiento(form: any) {
        return this._doPost(this.getHOT({accion: 'editasiento'}), form);
    }

    getAsientos(desde, hasta) {
        return this._doGet(this.getHOT({accion: 'getasientos', desde, hasta}));
    }

    listarMovsCtaContable(cta, desde, hasta) {
        return this._doGet(this.getHOT({accion: 'getmovscta', cta, desde, hasta}));
    }

    getFormLibroMayor() {
        return this._doGet(this.getHOT({accion: 'getformlibromayor'}));
    }

    getDatosAsiContab(cod: number) {
        return this._doGet(this.getHOT({accion: 'getdatosasiconta', cod}));
    }

    getBalanceGeneral(desde, hasta) {
        return this._doGet(this.getHOT({accion: 'getbalancegeneral', desde, hasta}));
    }

    getEstadoResultados(desde, hasta) {
        return this._doGet(this.getHOT({accion: 'getestadoresultados', desde, hasta}));
    }

    listarTransaccsBytTipo(tipo) {
        return this._doGet(this.getHOT({accion: 'gettransaccs', tipo}));
    }

    imprimirFactura(trncod) {
        const sqm = this.fautService.getEsquema();
        const rutaserver = 'https://mavil.site/tomcat/imprentas/Factura?trn=' + trncod + '&sqm=' + sqm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

    getFormFiltroLibroDiario() {
        return this._doGet(this.getHOT({accion: 'formfiltrolibd'}));
    }

}
