import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {FechasService} from './fechas.service';

@Injectable({
    providedIn: 'root'
})
export class PersonaService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fechasService: FechasService
    ) {
        super('/tpersona', localStrgServ, http);
    }

    getForm(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'form'});
        return this._doGet(httpOptions);
    }

    buscarPorCi(pciruc: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscaci', ciruc: pciruc});
        return this._doGet(httpOptions);
    }

    buscarPorCifull(pciruc: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscacifull', ciruc: pciruc});
        return this._doGet(httpOptions);
    }

    buscarPorCod(perid: number) {
        return this._doGet(this.getHOT({accion: 'buscaporid', perid}));
    }

    buscarPorCodfull(perid: number): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscaporidfull', perid});
        return this._doGet(httpOptions);
    }

    buscarPorEmail(pemail: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscaci', email: pemail});
        return this._doGet(httpOptions);
    }

    buscarPorNomapel(nomapel: string): Observable<any> {
        const httpOptions = this.getHOT({accion: 'filtronomapel', filtro: nomapel});
        return this._doGet(httpOptions);
    }

    buscarPorNomapelCiPag(filtro: string, pag: number) {
        const httpOptions = this.getHOT({accion: 'filtropag', filtro, pag});
        return this._doGet(httpOptions);
    }

    guardar(form: any): Observable<any> {
        const endpoint = this.urlEndPoint + '/' + form.per_id;
        const httpOptions = this.getHOT({});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    actualizar(perId: number, form: any) {
        const endpoint = this.urlEndPoint + '/' + perId;
        const httpOptions = this.getHOT({});
        return this.doPut(this.http, endpoint, httpOptions, form);
    }

    listarProveedores(): Observable<any> {
        const httpOptions = this.getHOT({accion: 'buscatipo', per_tipo: 3});
        return this._doGet(httpOptions);
    }

    listarMedicos(tipo: number): Observable<any> {
        return this._doGet(this.getHOT({accion: 'lmedicos', tipo}));
    }

    getTotalDeudas(codper: number) {
        return this._doGet(this.getHOT({accion: 'gtotaldeudas', codper}));
    }

    getTotalesTransacc(codper: number) {
        return this._doGet(this.getHOT({accion: 'gcuentafacts', codper}));
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
