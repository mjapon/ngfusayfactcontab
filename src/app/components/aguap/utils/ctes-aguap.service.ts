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
    private RutaListados = 'aguap/listados/:grid';
    private RutaListadosBase = 'aguap/listados/';
    private RutaPagoMavil = 'aguap/pagomavil';
    private RutaReporteLecturas = 'aguap/reportes/lecturas';
    private RutaReportePagos = 'aguap/reportes/pagos';
    private RutaMain = 'aguap/main';
    private MdgNum = 'mdg_num';
    private LmdValor = 'lmd_valor';
    private LmdValorant = 'lmd_valorant';
    private CnaTarifa = 'cna_tarifa';
    private MsgRefTieneMed = 'El referente ya tiene registrado medidores';
    private MsgAplTarfTercedad = 'Aplica tarifa tercera edad';
    private MsgEnterNumMed = 'Ingrese el número de medidor';

    get rutaHome() {
        return this.RutaHome;
    }

    get rutaMain(){
        return this.RutaMain;
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

    get rutaPagoMavil() {
        return this.RutaPagoMavil;
    }

    get rutaReporteLecturas() {
        return this.RutaReporteLecturas;
    }

    get rutaReportePagos() {
        return this.RutaReportePagos;
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

    get rutaListados() {
        return this.RutaListados;
    }

    get rutaListadosBase() {
        return this.RutaListadosBase;
    }

    btnNextS(adc: string) {
        return `btnNextS${adc}`;
    }

}
