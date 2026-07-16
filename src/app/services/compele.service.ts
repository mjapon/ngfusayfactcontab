import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class CompeleService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService
    ) {
        super('/compele', localStrgServ, http);
    }

    enviar(trncod: number) {
        return this._doPostAction('validar', { trncod });
    }

    redisEnviar(trncod: number) {
        return this._doPostAction('redis_enviar', { trncod });
    }

    consultaEstadoAut(trncod: number) {
        return this._doPostAction('autoriza', { trncod });
    }

    saveComprobContrib(trncod: number, estado: number) {
        return this._doPostAction('savecomprob', { trncod, estado });
    }

    sheduleChkEstadoAut(trncod: number, timetocheck: number) {
        setTimeout(() => {
            console.log(`Se ejecuta consulta estado aut for ${trncod} `);
            console.log(this.consultaEstadoAut);
            this.consultaEstadoAut(trncod);
        }, 20000);
    }

    getEmpsInfo() {
        return this._doPostAction('empsinfo', {});
    }

    updateDigitalSign(emp_codigo: number, p12_file_base64: string, pass_digital_sign: string) {
        return this._doPostAction('update_digital_sign', {
            emp_codigo,
            p12_file_base64,
            pass_digital_sign
        });
    }

}
