import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';
import {NumberService} from './number.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class ArticuloService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected numberService: NumberService,
        private ctes: CtesService
    ) {
        super('/titemconfig', localStrgServ, http);
    }

    getForm(): Observable<any> {
        return this._doGetAction(this.ctes.formcrea);
    }

    auxGetUrl(artid) {
        return `${this.urlEndPoint}/${artid}`;
    }

    getByCod(artId: number): Observable<any> {
        return this.http.get(this.auxGetUrl(artId), this.getHOT({}));
    }

    getNextCodbar(): Observable<any> {
        return this._doGetAction(this.ctes.seccodbarra);
    }

    existeCodbar(codbar: string): Observable<any> {
        return this._doGetAction(this.ctes.verifcodbar, {codbar});
    }

    guardarArticulo(form: any): Observable<any> {
        const endpoint = this.auxGetUrl(form.ic_id);
        const httpOptions = this.getHOT({});
        return this.http.post(endpoint, form, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    actualizaBarcode(icId: number, newbarcode: string) {
        const endpoint = this.auxGetUrl(icId);
        const httpOptions = this.getHOT({accion: this.ctes.updatecode});
        return this.doPost(this.http, endpoint, httpOptions, {new_ic_code: newbarcode});
    }

    anularArticulo(artId: any): Observable<any> {
        const endpoint = this.auxGetUrl(artId);
        const httpOptions = this.getHOT({accion: this.ctes.del});
        return this.doPost(this.http, endpoint, httpOptions, {});
    }

    anularCtaContable(icid: number) {
        const endpoint = this.auxGetUrl(icid);
        const httpOptions = this.getHOT({accion: this.ctes.anulactacontab});
        return this.doPost(this.http, endpoint, httpOptions, {});
    }

    listar(pfiltro: string, secId: number, codcat: number): Observable<any> {
        const endopoint = this.urlEndPoint;
        const httpOptions = this.getHOT({
            accion: this.ctes.listar,
            filtro: pfiltro,
            sec_id: secId,
            codcat
        });
        return this.http.get(endopoint, httpOptions).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.fnProcesaError)
        );
    }

    busArtsForTransacc(secid: number, filtro: string, tracod: number) {
        return this._doGetAction(this.ctes.gartsserv, {filtro, sec: secid, tracod});
    }

    busCtasContables(filtro: string) {
        return this._doGetAction(this.ctes.gctascontables, {filtro});
    }

    getAllCtasContables() {
        return this._doGetAction(this.ctes.gallctascontables);
    }

    buscaAllServDentalles() {
        return this._doGetAction(this.ctes.gservdentall);
    }

    getImpuestos() {
        return this._doGetAction(this.ctes.gimpuestos);
    }

    getRaizPlanCuentas(padrexpand) {
        return this._doGetAction(this.ctes.gplanc, {padrexpand});
    }

    getFormPlanCuenta(padre) {
        return this._doGetAction(this.ctes.gformplancta, {padre});
    }

    crearCtaContable(form) {
        return this._doPostAction(this.ctes.guardaplancta, form);
    }

    getDetCtaContable(codcta) {
        return this._doGetAction(this.ctes.gdetctacontable, {codcta});
    }

    initFormDetalles(formdet, datosart, isfacturacompra = false) {
        let icdpPrecio = datosart.icdp_precioventa;
        if (isfacturacompra) {
            icdpPrecio = datosart.icdp_preciocompra;
        }

        let ivaval = 0.0;
        let precio = icdpPrecio;
        if (datosart.icdp_grabaiva) {
            ivaval = this.numberService.getValorIva(icdpPrecio);
            if (!isfacturacompra) {
                precio = datosart.icdp_precioventa_iva;
            }
        }

        formdet.icdp_grabaiva = datosart.icdp_grabaiva;
        formdet.art_codigo = datosart.ic_id;
        formdet.ic_nombre = datosart.ic_nombre;
        formdet.dt_precio = icdpPrecio;
        formdet.ic_code = datosart.ic_code;
        formdet.dt_preref = datosart.icdp_preciocompra;
        formdet.icdp_modcontab = datosart.icdp_modcontab;
        formdet.dt_precioiva = precio;
        formdet.per_codigo = 0;
        formdet.dt_cant = 1;
        formdet.tipic_id = datosart.tipic_id;
        formdet.ice_stock = datosart.ice_stock;
        formdet.dt_decto = 0.0;
        formdet.cta_codigo = datosart.cta_codigo;
        formdet.dt_debito = datosart.mcd_signo;
        formdet.dai_impg = datosart.icdp_grabaiva ? this.numberService.getIva() : 0.0;
        formdet.subtotal = formdet.dt_cant * formdet.dt_precio;
        formdet.subtforiva = formdet.subtotal - formdet.dt_decto;
        formdet.ivaval = ivaval;
        formdet.total = formdet.subtotal + ivaval;
        formdet.dt_valor = formdet.subtforiva;
    }

    getTiposArt() {
        return [
            {label: 'Bien', value: 1},
            {label: 'Servicio', value: 2}
        ];
    }

    getIvas() {
        return [
            {label: 'Si', value: true},
            {label: 'No', value: false}
        ];
    }

}
