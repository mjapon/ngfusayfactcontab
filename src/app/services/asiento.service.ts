import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AsientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tasiento', localStrgServ, http);
    }

    getDoc(trncod: number) {
        return this._doGet(this.getHOT({accion: 'gdetdoc', trncod}));
    }

    getFormCab(traCod: number, tdvCod: number) {
        return this._doGet(this.getHOT({accion: 'formcab', tra_cod: traCod, tdv_codigo: tdvCod}));
    }

    listarFacturas(perCodigo: number) {
        return this.auxListarFacturas(perCodigo, 1);
    }

    listarFacturasCompra(perCodigo) {
        return this.auxListarFacturas(perCodigo, 2);
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

    marcarErrado(trncod: number) {
        return this._doPost(this.getHOT({accion: 'errar'}), {trncod});
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

    getAsientos() {
        return this._doGet(this.getHOT({accion: 'getasientos'}));
    }

    listarMovsCtaContable(cta, desde, hasta) {
        return this._doGet(this.getHOT({accion: 'getmovscta', cta, desde, hasta}));
    }

    getFormLibroMayor() {
        return this._doGet(this.getHOT({accion: 'getformlibromayor'}));
    }

    getDatosAsientoContable(cod: number) {
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

}
