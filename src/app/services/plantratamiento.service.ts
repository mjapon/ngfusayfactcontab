import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { FautService } from './faut.service';
import { CtesService } from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class PlantratamientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService,
        private ctes: CtesService,
    ) {
        super('/todplantrata', localStrgServ, http);
    }

    getForm(pac: number, traCod: number) {
        return this._doGetAction(this.ctes.form, { pac, tra_cod: traCod });
    }

    listar(pac: number) {
        return this._doGetAction(this.ctes.listar, { pac });
    }

    crear(form: any) {
        return this._doPostAction(this.ctes.crea, form);
    }

    cambiarEstado(planTrataId: number, nuevoEstado: number, tipoComprobante: number = 0,
        formref: any = {}) {
        const formpost = {
            pnt_id: planTrataId, nv_estado: nuevoEstado,
            tipo_comprob: tipoComprobante, formref
        };
        return this._doPostAction('chgestado', formpost);
    }

    getDetallesPlan(planTrataId: number) {
        return this._doGetAction('gdet', { pnt_id: planTrataId });
    }

    imprimirPlan(codPlan: any) {
        const empCodigo = this.fautService.getEmpCodigo();
        const urlTomcat = this.ctes.urlTomcat;
        const url = `${urlTomcat}/plan-tratamiento/${empCodigo}/${codPlan}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

}
