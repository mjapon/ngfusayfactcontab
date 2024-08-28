import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {FechasService} from './fechas.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class PersonaService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fechasService: FechasService,
        private ctes: CtesService
    ) {
        super('/tpersona', localStrgServ, http);
    }

    getForm(): Observable<any> {
        return this._doGetAction(this.ctes.form);
    }

    buscarPorCi(ciruc: string): Observable<any> {
        return this._doGetAction(this.ctes.buscaci, {ciruc});
    }

    buscarPorCifull(ciruc: string): Observable<any> {
        return this._doGetAction(this.ctes.buscacifull, {ciruc});
    }

    buscarPorCod(perid: number) {
        return this._doGetAction(this.ctes.buscaporid, {perid});
    }

    buscarPorCodfull(perid: number): Observable<any> {
        return this._doGetAction(this.ctes.buscaporidfull, {perid});
    }

    buscarPorNomapelCiPag(filtro: string, pag: number, tipo: number) {
        return this._doGetAction(this.ctes.filtropag, {filtro, pag, tipo});
    }

    auxGetEndpointPerid(perid) {
        return this.urlEndPoint + '/' + perid;
    }

    guardar(form: any): Observable<any> {
        return this.doPost(this.http, this.auxGetEndpointPerid(form.per_id), this.getHOT({}), form);
    }

    eliminar(perId) {
        return this.doDelete(this.http, this.auxGetEndpointPerid(perId), this.getHOT({}));
    }

    actualizar(perId: number, form: any) {
        return this.doPut(this.http, this.auxGetEndpointPerid(perId), this.getHOT({}), form);
    }

    listarProveedores(): Observable<any> {
        return this._doGetAction(this.ctes.buscatipo, {per_tipo: 3});
    }

    listarMedicos(tipo: number): Observable<any> {
        return this._doGetAction(this.ctes.lmedicos, {tipo});
    }

    getTotalDeudas(codper: number) {
        return this._doGetAction(this.ctes.gtotaldeudas, {codper});
    }

    getTotalesTransacc(codper: number) {
        return this._doGetAction(this.ctes.gcuentafacts, {codper});
    }

    loadDataToform(form: any, personentity: any) {
        for (const prop in personentity) {
            if (personentity.hasOwnProperty(prop)) {
                form[prop] = personentity[prop];
            }
        }

        form.per_fechanac = null;

        if (personentity.per_fechanac && personentity.per_fechanac.trim().length > 0) {
            form.per_fechanacstr = personentity.per_fechanac;
            form.per_fechanac = this.fechasService.parseString(personentity.per_fechanac);
            form.per_fechanacobj = this.fechasService.parseString(personentity.per_fechanac);
        }
    }

    parsePerFechanac(form) {
        if (form.per_fechanacobj) {
            form.per_fechanac = this.fechasService.formatDate(form.per_fechanacobj);
        }
    }

    setPerEdad(form, obj = false) {
        let edad = 0;
        if (obj) {
            if (form.per_fechanacobj) {
                edad = this.fechasService.getEdad(form.per_fechanacobj);
            }
        } else {
            if (form.per_fechanac) {
                edad = this.fechasService.getEdad(form.per_fechanac);
            }
        }
        form.per_edad = {years: edad};
    }

    isTercedad(form, teredadref) {
        if (!form.per_edad) {
            this.setPerEdad(form);
        }
        let istercedadRes = false;
        if (form.per_edad) {
            istercedadRes = form.per_edad.years >= teredadref;
        }
        return istercedadRes;
    }

    getBasicValidFieldList() {
        return [
            {name: 'per_ciruc', msg: 'Debe ingresar el número de cédula del referente'},
            {name: 'per_nombres', msg: 'Debe ingresar los nombres del referente'},
            {name: 'per_apellidos', msg: 'Debe ingresar los apellidos del referente'}
        ];
    }

}
