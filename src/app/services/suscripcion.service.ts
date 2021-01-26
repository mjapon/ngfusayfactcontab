import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class SuscripcionService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/tsuscripcion', localStrgServ, http);
    }

    getForm(ref) {
        return this._doGet(this.getHOT({accion: 'form', ref}));
    }

    crear(form) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    listbyref(ref) {
        return this._doGet(this.getHOT({accion: 'listbyref', ref}));
    }

    getDatosSuscrip(suscod: number) {
        return this._doGet(this.getHOT({accion: 'gdet', suscod}));
    }

    cambiarEstado(suscod: number, nuevoestado: number) {
        return this._doPost(this.getHOT({accion: 'cambiarestado'}), {sus_id: suscod, estado: nuevoestado});
    }

}
