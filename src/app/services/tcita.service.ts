import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class TcitaService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tcita', localStrgServ, http);
    }

    getForm() {
        return this._doGet(this.getHOT({accion: 'form'}));
    }

    listar(desde: string, hasta: string) {
        return this._doGet(this.getHOT({accion: 'lstw', desde, hasta}));
    }

    contar(desde: string, hasta: string) {
        return this._doGet(this.getHOT({accion: 'countm', desde, hasta}));
    }

    guardar(form: any) {
        return this._doPost(this.getHOT({accion: 'guardar'}), form);
    }

    getDatosCita(citaId: number) {
        return this._doGet(this.getHOT({accion: 'gdet', cod: citaId}));
    }

    anular(citaId: number) {
        return this._doPost(this.getHOT({accion: 'anular', cod: citaId}), {});
    }
}
