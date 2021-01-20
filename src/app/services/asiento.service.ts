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
        return this._doGet(this.getHOT({accion: 'gfact', per: perCodigo}));
    }

    listarGridVentas() {
        return this._doGet(this.getHOT({accion: 'gridventas'}));
    }

    crearDocumento(form: any) {
        return this._doPost(this.getHOT({accion: 'creadoc'}), form);
    }

    anular(trncod: number, obs: string) {
        const form = {trncod, obs}
        return this._doPost(this.getHOT({accion: 'anular'}), form);
    }

    marcarErrado(trncod: number) {
        return this._doPost(this.getHOT({accion: 'errar'}), {trncod});
    }

}
