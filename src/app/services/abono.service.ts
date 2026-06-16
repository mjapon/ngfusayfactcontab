import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import { DomService } from './dom.service';

@Injectable({
    providedIn: 'root'
})
export class AbonoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected domService: DomService,
    ) {
        super('/tasiabono', localStrgServ, http);
    }

    getform(tracod: number) {
        return this._doGet(this.getHOT({accion: 'form', tracod}));
    }

    crear(form: any) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    listaAbonosFact(trncod: number) {
        return this._doGet(this.getHOT({accion: 'abosfact', trncod}));
    }

    anularAbono(codabo, obs) {
        const form = {codabo, obs};
        return this._doPost(this.getHOT({accion: 'anular'}), form);
    }

    buildDetallesAbono(codprov:number, creditos:string, montoAbonar:number){
        return {
            'codprov':codprov,
            'creditos': creditos,
            'montoabonar': montoAbonar
        }
    }

    abonarCreditosProvs(formdata: any){
        return this._doPostAction('abonar_creditos_prov', formdata);
    }

}
