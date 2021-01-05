import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TicketService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tticket', localStrgServ, http);
    }

    listar(dia: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'listar', dia});
        return this._doGet(httpOptions);
    }

    getFormListado(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'forml'});
        return this._doGet(httpOptions);
    }

    getProdsForTickets(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'servticktes'});
        return this._doGet(httpOptions);
    }

    getFormCrea(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'form'});
        return this._doGet(httpOptions);
    }

    guardar(form: any, form_cli: any): Observable<any> {
        const httpOptions = this.getHOT({accion: 'guardar'});
        return this._doPost(httpOptions, {form, form_cli});
    }

    anular(tkid) {
        const httpOptions = this.getHOT({accion: 'anular'});
        return this._doPost(httpOptions, {tk_id: tkid});
    }

    imprimir(ticketid: any) {
        const rutaserver = 'https://mavil.site/tomcat/imprentas/TicketServlet?tkid=' + ticketid;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=500,height=700');
    }
}
