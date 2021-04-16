import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DatosloggedService extends BaseService {
    constructor(protected http: HttpClient,
                protected localStrgServ: LocalStorageService
    ) {
        super('/datosinitlogged', localStrgServ, http);
    }

    getDatosLogged() {
        return this._doGet(this.getHOT({accion: 'datosgen'}));
    }

    checkPermiso(perms: string) {
        return this._doGet(this.getHOT({accion: 'chkperm', perm: perms}));
    }
}
