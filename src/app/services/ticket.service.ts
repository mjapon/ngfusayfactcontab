import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class TicketService extends BaseService {

    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService,
                private ctes: CtesService) {
        super('/tticket', localStrgServ, http);
    }

    listar(dia: string, desde: string, hasta: string, seccion: number, servicios: string): Observable<any> {
        return this._doGetAction(this.ctes.listar, {dia, desde, hasta, seccion, servicios});
    }

    getFormListado(): Observable<any> {
        return this._doGetAction(this.ctes.forml);
    }

    getProdsForTickets(): Observable<any> {
        return this._doGetAction(this.ctes.servticktes);
    }

    getFormCrea(): Observable<any> {
        return this._doGetAction(this.ctes.form);
    }

    getFormEdit(tkid) {
        return this._doGetAction(this.ctes.gformed, {tkid});
    }

    guardar(form: any, formCli: any): Observable<any> {
        return this._doPostAction(this.ctes.guardar, {form, form_cli: formCli});
    }

    actualizar(form: any) {
        return this._doPostAction('upd', form);
    }

    anular(tkid) {
        return this._doPostAction(this.ctes.anular, {tk_id: tkid});
    }

    getDetalles(tkid) {
        return this._doGetAction('gdet', {tkid});
    }

    imprimir(ticketid: any) {
        const basetomcat = this.ctes.urlTomcat;
        const url = `${basetomcat}/TicketServlet?tkid=${ticketid}`;
        window.open(url, this.ctes._blank, 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=500,height=700');
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
