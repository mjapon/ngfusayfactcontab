import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CtesAguapService {

    rutaContra() {
        return 'aguap/contratos';
    }

    rutaContraForm() {
        return 'aguap/contratos/form';
    }

    rutaLectoMedForm() {
        return 'aguap/lectomed/form';
    }

    rutaPagos() {
        return 'aguap/cobros';
    }

    lblPerCirucInput() {
        return 'perCirucInput';
    }

    lblPerNombres() {
        return 'per_nombres';
    }

    lblMdg_num() {
        return 'mdg_num';
    }

    lblLmdValor() {
        return 'lmd_valor';
    }

    lblLmdValorAnt() {
        return 'lmd_valorant';
    }

    msgMedEncon() {
        return 'Medidor encontrado';
    }

    msgDataNumMed() {
        return 'Ingrese el número de medidor';
    }

    msgConfirmSaveInfo() {
        return '¿Confirma que desea guardar esta información?';
    }

}
