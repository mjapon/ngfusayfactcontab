import {Injectable} from '@angular/core';
import {CtesService} from '../../../services/ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CtesAguapService extends CtesService {

    private RutaHome = 'aguap/home';
    private RutaContraForm = 'aguap/home/form';
    private RutaLectoMedForm = 'aguap/lectomed/form';
    private RutaPagos = 'aguap/cobros';
    private MdgNum = 'mdg_num';
    private LmdValor = 'lmd_valor';
    private LmdValorant = 'lmd_valorant';
    private CnaTarifa = 'cna_tarifa';
    private MsgRefTieneMed = 'El referente ya tiene registrado medidores';
    private MsgAplTarfTercedad = 'Aplica tarifa tercera edad';
    private MsgEnterNumMed = 'Ingrese el número de medidor';

    // private MsgRefNoLectomed = 'No tiene pagos pendientes';

    get rutaHome() {
        return this.RutaHome;
    }

    get rutaContraForm() {
        return this.RutaContraForm;
    }

    get rutaLectoMedForm() {
        return this.RutaLectoMedForm;
    }

    get rutaPagos() {
        return this.RutaPagos;
    }

    get perCirucInput() {
        return this.PerCirucInput;
    }

    get per_nombres() {
        return this.PerNombres;
    }

    get mdg_num() {
        return this.MdgNum;
    }

    get lmd_valor() {
        return this.LmdValor;
    }

    get lmd_valorant() {
        return this.LmdValorant;
    }

    get cna_tarifa() {
        return this.CnaTarifa;
    }

    get msgRefTieneMed() {
        return this.MsgRefTieneMed;
    }

    get msgAplTarfTercedad() {
        return this.MsgAplTarfTercedad;
    }

    get msgEnterNumMed() {
        return this.MsgEnterNumMed;
    }

    btnNextS(adc: string) {
        return `btnNextS${adc}`;
    }

}
