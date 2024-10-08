import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CreditoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tasicredito', localStrgServ, http);
    }

    listarCreditos(codper: number, clase: number, tipopago: number) {
        return this._doGet(this.getHOT({accion: 'listarcreds', per: codper, clase, tipopago}));
    }

    getDatosCredito(codcred: number) {
        return this._doGet(this.getHOT({accion: 'gdet', codcred}));
    }

    listarGrid(tipo, desde, hasta, filtro, limit, first, tipopago) {
        const doexp = 0;
        return this._doGet(this.getHOT({
            accion: 'listargrid',
            tipo,
            desde,
            hasta,
            filtro,
            limit,
            first,
            tipopago,
            doexp
        }));
    }

    listarGridForExport(tipo, desde, hasta, filtro, tipopago) {
        const doexp = 1;
        const first = 0;
        const limit = 50;
        return this._doGet(this.getHOT({
            accion: 'listargrid',
            tipo,
            desde,
            hasta,
            filtro,
            limit,
            first,
            tipopago,
            doexp
        }));
    }

    getFormCrea(clase, ref) {
        return this._doGet(this.getHOT({accion: 'gformcrea', clase, ref}));
    }

    guardaCredRef(form: any) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    getTiposPagos() {
        return [{label: 'Con saldo pendiente', value: 1},
            {label: 'Créditos cancelados', value: 2}, {label: 'Todos', value: 0}];
    }
}
