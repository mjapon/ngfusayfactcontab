import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {CtesService} from './ctes.service';
import {FautService} from './faut.service';
import {LocalStorageService} from './local-storage.service';


@Injectable({
    providedIn: 'root'
})
export class AsientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService,
        private ctes: CtesService
    ) {
        super('/tasiento', localStrgServ, http);
    }

    getDoc(trncod: number, foredit = 0) {
        return this._doGetAction(this.ctes.gdetdoc, {trncod, foredit});
    }

    generarNotaCredito(trncodigo) {
        return this._doPostAction('notacred', {trn_codigo: trncodigo});
    }

    getFormCab(traCod: number) {
        return this._doGetAction(this.ctes.formcab, {tra_cod: traCod});
    }

    auxListarFacturas(per, clase) {
        return this._doGetAction(this.ctes.gfact, {per, clase});
    }

    listarGridVentas(desde, hasta, filtro, tracod, tipo, limit, first) {
        const doexp = 0;
        return this._doGetAction(this.ctes.gridventas, {desde, hasta, filtro, tracod, tipo, limit, first, doexp});
    }

    listarGridVentasForExport(desde, hasta, filtro, tracod, tipo, limit) {
        const doexp = 1;
        const first = 0;
        return this._doGetAction(this.ctes.gridventas, {desde, hasta, filtro, tracod, tipo, limit, first, doexp});
    }

    crearDocumento(form: any) {
        return this._doPostAction(this.ctes.creadoc, form);
    }

    anular(trncod: number, obs: string) {
        const form = {trncod, obs};
        return this._doPostAction(this.ctes.anular, form);
    }

    duplicar(trncod: number) {
        return this._doPostAction(this.ctes.duplicar, {trn_codigo: trncod});
    }

    getAsientoForm() {
        return this._doGetAction(this.ctes.formasiento);
    }

    crearAsiento(form: any) {
        return this._doPostAction(this.ctes.creasiento, form);
    }

    editarAsiento(form: any) {
        return this._doPostAction(this.ctes.editasiento, form);
    }

    getAsientos(desde, hasta, cta) {
        return this._doGetAction(this.ctes.getasientos, {desde, hasta, cta});
    }

    listarMovsCtaContable(cta, desde, hasta) {
        return this._doGetAction(this.ctes.getmovscta, {cta, desde, hasta});
    }

    getFormLibroMayor() {
        return this._doGetAction(this.ctes.getformlibromayor);
    }

    getDatosAsiContab(cod: number) {
        return this._doGetAction(this.ctes.getdatosasiconta, {cod});
    }

    getBalanceGeneral(desde, hasta, chkper = '1') {
        return this._doGetAction(this.ctes.getbalancegeneral, {desde, hasta, chkper});
    }

    getEstadoResultados(desde, hasta) {
        return this._doGetAction(this.ctes.getestadoresultados, {desde, hasta});
    }

    listarTransaccsBytTipo(tipo) {
        return this._doGetAction(this.ctes.gettransaccs, {tipo});
    }

    imprimirFactura(trncod) {
        const empCodigo = this.fautService.getEmpCodigo();
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/factura/${empCodigo}/${trncod}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirAbono(trncod) {
        const empCodigo = this.fautService.getEmpCodigo();
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/abono/${empCodigo}/${trncod}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    viewBlob(data, contentType) {
        var file = new Blob([data], {
            type: contentType
        });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirComproAgua(params: any) {
        const empCodigo = this.fautService.getEmpCodigo();
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/compro-agua/${empCodigo}`;
        const req = this.http.post(uri, params, {
            responseType: 'arraybuffer'
        });
        req.subscribe((res: ArrayBuffer) => {
            this.viewBlob(res, 'application/pdf');
        });
    }

    genPdfBanlance(items: Array<any>, periodo: string, resumen: any, titulo: string) {
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/contable/genPdf`;
        const body = {titulo, periodo, items, resumenItems: resumen};
        return this.http.post(uri, body, {
            responseType: 'arraybuffer'
        });
    }

    exportVentasListPDF(body: any) {
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/grid/pdf`;
        return this.http.post(uri, body, {
            responseType: 'arraybuffer'
        });
    }

    genExcelBalanceGeneral(items: Array<any>, periodo: string, titulo: string) {
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/contable/genBalanceGeneral`;
        const body = {titulo, periodo, items};

        return this.http.post(uri, body, {
            responseType: 'blob',
        });
    }

    exportVentasList(body: any) {
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/grid/excel`;
        return this.http.post(uri, body, {
            responseType: 'blob',
        });
    }

    getFormFiltroLibroDiario() {
        return this._doGetAction(this.ctes.formfiltrolibd);
    }

    changeSeccion(form) {
        return this._doPostAction(this.ctes.changesec, form);
    }

    getFormChangeSec(trncod) {
        return this._doGetAction(this.ctes.formchangesec, {trncod});
    }


}
