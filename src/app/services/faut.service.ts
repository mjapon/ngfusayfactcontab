import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class FautService extends BaseService {
    private bssource = new BehaviorSubject('empty');
    public source = this.bssource.asObservable();

    constructor(protected http: HttpClient,
                protected localStorageService: LocalStorageService) {
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

    setAsAuthenticated(userinfo: any, token: any, menu: any, seccion: any, empNombreComercial, sqm: string) {
        this.localStorageService.setItem('fIsLogged', 'true');
        this.localStorageService.setItem('infoUserFLogged', JSON.stringify(userinfo));
        this.localStorageService.setItem('menuApp', JSON.stringify(menu));
        this.localStorageService.setItem('auToken', token);
        this.localStorageService.setItem('seccion', JSON.stringify(seccion));
        this.localStorageService.setItem('empNombreComercial', empNombreComercial);
        this.localStorageService.setItem('sqm', sqm);
    }

    getEsquema() {
        return this.localStorageService.getItem('sqm');
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

    getSecciones(): any {
        const infoSecciones: string = this.localStorageService.getItem('secciones');
        return JSON.parse(infoSecciones);
    }

    updateToken(token: any, seccion: any) {
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
        this.localStorageService.removeItem('empNombreComercial');
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

    saveManuCli(menu: any) {
        this.localStorageService.setItem('menuCliApp', JSON.stringify(menu));
    }

    getMenuCli() {
        const menuCliApp = this.localStorageService.getItem('menuCliApp');
        if (menuCliApp) {
            return JSON.parse(menuCliApp);
        }
        return null;
    }

    getAuToken() {
        const auToken: string = this.localStorageService.getItem('auToken');
        return auToken;
    }

    publishMessage(message: string) {
        this.bssource.next(message);
    }


}
