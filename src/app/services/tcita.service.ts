import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FechasService} from "./fechas.service";

@Injectable({
    providedIn: 'root'
})
export class TcitaService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService,
                private fechasService: FechasService) {
        super('/tcita', localStrgServ, http);
    }

    getForm() {
        return this._doGet(this.getHOT({accion: 'form'}));
    }

    listar(desde: string, hasta: string, tipo: number) {
        return this._doGet(this.getHOT({accion: 'lstw', desde, hasta, tipo}));
    }

    contar(desde: string, hasta: string, tipo: number) {
        return this._doGet(this.getHOT({accion: 'countm', desde, hasta, tipo}));
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

    getlastcita(perId: number, tipo: number) {
        return this._doGet(this.getHOT({accion: 'glastv', pac: perId, tipo}));
    }

    getNextCita(perId: number, tipo: number, fecha: string) {
        return this._doGet(this.getHOT({accion: 'getproxvcita', pac: perId, tipo, fecha}));
    }

    getPersonsCita() {
        return this._doGet(this.getHOT({accion: 'gpercita'}));
    }

    getFechaHoraStr(tcita: any) {
        const hora = tcita.ct_hora;
        const horaFin = tcita.ct_hora_fin;
        const cFecha = tcita.ct_fecha;
        const horaStr = this.fechasService.getHoraStrFromNumber(hora);
        const horaFinStr = this.fechasService.getHoraStrFromNumber(horaFin);
        const textoCita = `${cFecha}: ${horaStr} -${horaFinStr}`;
        return textoCita;
    }
}
