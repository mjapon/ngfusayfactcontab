import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TicketService extends BaseService {

    constructor(private http: HttpClient,
                protected localStrgServ: LocalStorageService) {
        super('/tticket', localStrgServ);
    }

    listar(dia: string): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'listar', dia: dia});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getFormListado(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'forml'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getProdsForTickets(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'servticktes'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    getFormCrea(): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'form'});
        return this.doGet(this.http, this.urlEndPoint, httpOptions);
    }

    guardar(form: any, form_cli: any): Observable<any> {
        const httpOptions = this.getHttpOptionsToken({accion: 'guardar'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {form, form_cli});
    }

    anular(tkid) {
        const httpOptions = this.getHttpOptionsToken({accion: 'anular'});
        return this.doPost(this.http, this.urlEndPoint, httpOptions, {tk_id: tkid});
    }

    imprimir(ticketid: any) {
        // const rutaserver = "http://localhost:8080/imprentas/TicketServlet?tkid=" + ticketid;
        const rutaserver = 'http://mavil.site/tomcat/imprentas/TicketServlet?tkid=' + ticketid;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=500,height=700');
    }
}
