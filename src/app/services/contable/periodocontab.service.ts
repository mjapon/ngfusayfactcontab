import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "../base-service";
import { LocalStorageService } from "../local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class PeriodoContableService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStorageServ: LocalStorageService
    ) {
        super('/tperiodocontable', localStorageServ, http);

    }

    getCurrent() {
        return this._doGetAction('current');
    }


}