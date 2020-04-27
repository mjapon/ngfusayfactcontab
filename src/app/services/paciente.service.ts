import {Injectable} from '@angular/core';
import {BaseService} from "./base-service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class PacienteService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/public/tpacienteuser', localStrgServ);
    }

    registrar(form: any) {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptions({});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    getMatrizHoras(med_id: number, dia: any) {
        const httpOptions = this.getHttpOptions({'accion': 'matrizhoras', 'med_id': med_id, 'dia': dia});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }
}
