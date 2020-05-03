import {Injectable} from '@angular/core';
import {BaseService} from "./base-service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "./local-storage.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PacienteService extends BaseService {

    private bssource = new BehaviorSubject('empty');
    public source = this.bssource.asObservable();

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/public/tpacienteuser', localStrgServ);
    }

    isAuthenticated(): boolean {
        return this.localStrgServ.getItem('pacienteIsLogged') != null;
    }

    setAsAuthenticated(pacienteInfo: any, token: any) {
        this.localStrgServ.setItem('pacienteIsLogged', 'true');
        this.localStrgServ.setItem('infoUserPacienteLogged', JSON.stringify(pacienteInfo));
        this.localStrgServ.setItem('tokenPacienteLoged', token);
        this.publishMessage('login');
    }

    getDatosPacienteLogged() {
        return JSON.parse(this.localStrgServ.getItem('infoUserPacienteLogged'));
    }

    clearDatosPacienteLogged() {
        this.localStrgServ.removeItem('pacienteIsLogged');
        this.localStrgServ.removeItem('infoUserPacienteLogged');
        this.localStrgServ.removeItem('tokenPacienteLoged');
        this.publishMessage('logout');
    }


    publishMessage(message: string) {
        this.bssource.next(message);
    }

    registrar(form: any) {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptions({});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    crearCuenta(form: any) {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptions({accion: 'creacuenta'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    actualizarCita(form: any) {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptions({accion: 'updatecita'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    autenticar(form: any) {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptions({accion: 'autenticar'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    getMatrizHoras(med_id: number, dia: any) {
        const httpOptions = this.getHttpOptions({'accion': 'matrizhoras', 'med_id': med_id, 'dia': dia});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    listarCitas(med_id: number, dia: any) {
        const httpOptions = this.getHttpOptions({'accion': 'citasmedico', 'med_id': med_id, 'dia': dia});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getDatosUser(email: string) {
        const httpOptions = this.getHttpOptions({'accion': 'getdatauser', 'email': email});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    creaActualizaFromSocial(form: any) {
        const endpoint = this.urlEndPoint + '/0';
        const httpOptions = this.getHttpOptions({accion: 'updateFromSocial'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    listarCitasPaciente(email: string) {
        const httpOptions = this.getHttpOptions({'accion': 'citaspaciente', 'email': email});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }
}
