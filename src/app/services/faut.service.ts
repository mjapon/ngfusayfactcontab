import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {CtesService} from './ctes.service';
import {jwtDecode} from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class FautService extends BaseService {
    private bssource = new BehaviorSubject('empty');
    public source = this.bssource.asObservable();
    public calendarType = 0;
    public countLoaded = 0;

    constructor(protected http: HttpClient,
                protected localStorageService: LocalStorageService,
                private ctes: CtesService) {
        super('/tfuser', localStorageService, http);
    }

    autenticar(empresa: string, username: string, password: string): Observable<any> {
        const endpoint = this.urlEndPoint;
        const form = {
            empresa,
            username,
            password
        };
        const httpOptions = this.getHO({accion: 'auth'});
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    isAuthenticated(): boolean {
        return this.localStorageService.getItem('fIsLogged') != null;
    }

    setAsAuthenticated(userinfo: any, token: any, menu: any, seccion: any, empNombreComercial, sqm: string, tdvcodigo: any) {
        this.localStorageService.setItem('fIsLogged', 'true');
        this.localStorageService.setItem('infoUserFLogged', JSON.stringify(userinfo));
        this.localStorageService.setItem('menuApp', JSON.stringify(menu));
        this.localStorageService.setItem('auToken', token);
        this.localStorageService.setItem('seccion', JSON.stringify(seccion));
        this.localStorageService.setItem('tdvcodigo', JSON.stringify(tdvcodigo));
        this.localStorageService.setItem('empNombreComercial', empNombreComercial);
        this.localStorageService.setItem('sqm', sqm);
    }

    updateTokenAndTdvcod(token: any, tdvcodigo: any) {
        this.localStorageService.setItem('auToken', token);
        this.localStorageService.setItem('tdvcodigo', tdvcodigo);
    }

    isTdvCodSaved() {
        const tdvcod = this.localStorageService.getItem('tdvcodigo');
        return tdvcod !== null;
    }

    setTdvCodigo(tdvcod) {
        this.localStorageService.setItem('tdvcodigo', JSON.stringify(tdvcod));
    }

    getTdvCodigo(): number {
        const tdvcod = this.localStorageService.getItem('tdvcodigo');
        let tdvcodproc = 0;
        if (tdvcod) {
            tdvcodproc = parseInt(tdvcod, 10);
        } else {
            tdvcodproc = 1;
        }
        return tdvcodproc;
    }

    getEsquema() {
        return this.localStorageService.getItem('sqm');
    }

    getVersionApp() {
        return this.localStorageService.getItem('versionApp') || '0.0';
    }

    setVersionApp(version) {
        this.localStorageService.setItem('versionApp', JSON.stringify(version));
    }

    setMenuApp(menu) {
        this.localStorageService.setItem('menuApp', JSON.stringify(menu));
    }

    getMenuApp() {
        const menuApp: string = this.localStorageService.getItem('menuApp');
        if (menuApp) {
            return JSON.parse(menuApp);
        }
        return null;
    }

    setSecciones(secciones: any) {
        this.localStorageService.setItem('secciones', JSON.stringify(secciones));
    }

    setTtpdvs(ttpdvs: any) {
        this.localStorageService.setItem('ttpdvs', JSON.stringify(ttpdvs));
    }

    getSecciones(): any {
        const infoSecciones: string = this.localStorageService.getItem('secciones');
        return JSON.parse(infoSecciones);
    }

    getTtpdvs(): any {
        const infoTtpdvs: string = this.localStorageService.getItem('ttpdvs');
        if (!infoTtpdvs) {
            return [{tdv_codigo: 1, tdv_numero: '001', tdv_nombre: 'PRINCIPAL'}];
        } else {
            return JSON.parse(infoTtpdvs);
        }
    }

    updateTokenAndSec(token: any, seccion: any) {
        this.localStorageService.setItem('auToken', token);
        this.localStorageService.setItem('seccion', JSON.stringify(seccion));
    }

    clearInfoAuthenticated() {
        this.localStorageService.removeItem('fIsLogged');
        this.localStorageService.removeItem('infoUserFLogged');
        this.localStorageService.removeItem('auToken');
        this.localStorageService.removeItem('menuApp');
        this.localStorageService.removeItem('seccion');
        this.localStorageService.removeItem('secciones');
        this.localStorageService.removeItem('tdvcodigo');
        this.localStorageService.removeItem('sqm');
        this.localStorageService.removeItem('versionApp');
        this.localStorageService.removeItem('empNombreComercial');
        this.localStorageService.removeItem('emp');
    }

    decodeToken() {
        const token = this.localStorageService.getAuthToken();
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
    }

    getEmpCodigo() {
        const empFromStorage = this.localStorageService.getItem('emp');
        if (empFromStorage) {
            return empFromStorage;
        }
        const token = this.localStorageService.getAuthToken();
        const decoded: any = jwtDecode(token);
        if (decoded) {
            return decoded.emp_id;
        }
        return 0;
    }

    setEmpCodigoFromRest(empCodigo) {
        this.localStorageService.setItem('emp', empCodigo);
    }

    getUserInfoSaved(): any {
        const infoUser: string = this.localStorageService.getItem('infoUserFLogged');
        return JSON.parse(infoUser);
    }

    getSeccionInfoSaved(): any {
        const infoSeccion: string = this.localStorageService.getItem('seccion');
        return JSON.parse(infoSeccion);
    }

    getNombreComercialSaved(): any {
        return this.localStorageService.getItem('empNombreComercial');
    }

    getAuToken() {
        return this.localStorageService.getItem('auToken');
    }

    publishMessage(message: string) {
        this.bssource.next(message);
    }

    publishMessageAddNavigate() {
        this.publishMessage('addnavigate');
    }

    chkRol(rol) {
        return this._doPostAction(this.ctes.chkrol, {rol});
    }

}
