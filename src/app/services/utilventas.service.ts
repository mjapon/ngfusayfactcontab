import {BaseService} from './base-service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UtilventasService extends BaseService {

    constructor(protected http: HttpClient,
                private localStorageServ: LocalStorageService) {
        super('/utilventas', localStorageServ, http);
    }

    getForm() {
        return this._doGet(this.getHOT({accion: 'form'}));
    }

    getGrid(form: any) {
        return this._doPost(this.getHOT({accion: 'getgrid'}), form);
    }

}
