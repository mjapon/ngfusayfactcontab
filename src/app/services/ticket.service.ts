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

    listar(dia: string, desde: string, hasta: string, seccion: number, servicios: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'listar', dia, desde, hasta, seccion, servicios});
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

    getFormEdit(tkid) {
        return this._doGet(this.getHOT({accion: 'gformed', tkid}));
    }

    guardar(form: any, form_cli: any): Observable<any> {
        const httpOptions = this.getHOT({accion: 'guardar'});
        return this._doPost(httpOptions, {form, form_cli});
    }

    actualizar(form: any) {
        return this._doPost(this.getHOT({accion: 'upd'}), form);
    }

    anular(tkid) {
        const httpOptions = this.getHOT({accion: 'anular'});
        return this._doPost(httpOptions, {tk_id: tkid});
    }

    getDetalles(tkid) {
        return this._doGet(this.getHOT({accion: 'gdet', tkid}));
    }

    imprimir(ticketid: any) {
        const rutaserver = 'https://mavil.site/tomcat/imprentas/TicketServlet?tkid=' + ticketid;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=500,height=700');
    }

    isDataValid(form, formcli, swalService) {
        if (form.tk_nro === null || form.tk_nro.toString().trim().length === 0) {
            swalService.fireError('Debe ingresar el número del ticket');
            return false;
        } else if (form.tk_costo == null || form.tk_costo.toString().trim().length === 0) {
            swalService.fireError('Debe ingresar el precio del ticket');
            return false;
        } else if (formcli.per_nombres == null || formcli.per_nombres.trim().length === 0) {
            swalService.fireError('Debe ingresar el nombre del paciente');
            return false;
        }
        return true;
    }

    getCodServicios(servicios) {
        const filtrados = servicios.filter(item => {
            return item.ic_marca;
        });

        const codigos = filtrados.map(e => {
            return e.ic_id;
        });
        return codigos.toString();
    }
}
