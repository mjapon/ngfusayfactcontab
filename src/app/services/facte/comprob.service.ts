import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CtesService } from "../ctes.service";
import { LocalStorageService } from "../local-storage.service";
import { BaseFacteService } from "./basefacte.service";

@Injectable({
    providedIn: 'root'
})
export class FacteComprobService extends BaseFacteService {

    constructor(protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private ctes: CtesService) {
        super('/tfacte', localStrgServ, http);
    }

    listar() {
        return this._doGetAction('facturas');
    }

    genRIDEPDF(clave) {
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/RideServlet?claveacceso=${clave}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    genRIDEXML(clave) {
        const urlTomcat = this.ctes.urlTomcat;
        window.open(`${urlTomcat}/XmlCompeServlet?claveacceso=${clave}`, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

}