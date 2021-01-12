import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {FautService} from './faut.service';

@Injectable({
    providedIn: 'root'
})
export class PlantratamientoService extends BaseService {
    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private fautService: FautService
    ) {
        super('/todplantrata', localStrgServ, http);
    }

    getForm(pac: number, traCod: number, tdvCodigo: number) {
        return this._doGet(this.getHOT({accion: 'form', pac, tra_cod: traCod, tdv_codigo: tdvCodigo}));
    }

    listar(pac: number) {
        return this._doGet(this.getHOT({accion: 'listar', pac}));
    }

    crear(form: any) {
        return this._doPost(this.getHOT({accion: 'crea'}), form);
    }

    cambiarEstado(planTrataId: number, nuevoEstado: number) {
        const formpost = {pnt_id: planTrataId, nv_estado: nuevoEstado};
        return this._doPost(this.getHOT({accion: 'chgestado'}), formpost);
    }

    getDetallesPlan(planTrataId: number) {
        return this._doGet(this.getHOT({accion: 'gdet', pnt_id: planTrataId}));
    }

    imprimirPlan(codPlan: any) {
        const sqm = this.fautService.getEsquema();
        const rutaserver = 'https://mavil.site/tomcat/imprentas/PlanTratamientoServlet?cod=' + codPlan + '&sqm=' + sqm;
        window.open(rutaserver, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

}
