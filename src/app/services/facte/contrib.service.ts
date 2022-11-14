import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base-service';
import { LocalStorageService } from '../local-storage.service';


@Injectable({
    providedIn: 'root'
})
export class FacteContribService extends BaseService {
    private bssource = new BehaviorSubject('empty');
    public source = this.bssource.asObservable();

    constructor(protected http: HttpClient,
        protected localStrgServ: LocalStorageService) {
        super('/tcontrib', localStrgServ, http);
    }

    autenticar(user: string, password: string): Observable<any> {
        const endpoint = this.urlEndPoint;
        const form = {
            user,
            password
        };
        const httpOptions = this.getHO({ accion: 'auth' });
        return this.doPost(this.http, endpoint, httpOptions, form);
    }

    isAuthenticated(): boolean {
        return this.localStrgServ.getItem('MvFacteIsLogged') != null;
    }

    setAsAuthenticated(userinfo: any, token: any) {
        this.localStrgServ.setItem('MvFacteIsLogged', 'true');
        this.localStrgServ.setItem('MvFacteInfoUserFLogged', JSON.stringify(userinfo));
        this.localStrgServ.setItem('MvFacteAuToken', token);
    }

    clearInfoAuthenticated() {
        this.localStrgServ.removeItem('MvFacteIsLogged');
        this.localStrgServ.removeItem('MvFacteInfoUserFLogged');
        this.localStrgServ.removeItem('MvFacteAuToken');
    }

    getUserInfoSaved(): any {
        let data = this.localStrgServ.getItem('MvFacteInfoUserFLogged');
        const infoUser: string = data != null ? data : '';
        return JSON.parse(infoUser);
    }

    getAuToken() {
        return this.localStrgServ.getItem('auToken');
    }

    publishMessage(message: string) {
        this.bssource.next(message);
    }

}
