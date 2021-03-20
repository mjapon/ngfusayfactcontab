import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DomService {
    constructor() {
    }

    /**
     * Setea el foco en el input especificado dado su id
     * @param elId: Identificador del componente al que desea obtene el foco
     */
    setFocus(elId) {
        if (document.getElementById(elId)) {
            document.getElementById(elId).focus();
        }
    }

    setFocusTimeout(elId, timeout) {
        setTimeout(() => {
                if (document.getElementById(elId)) {
                    document.getElementById(elId).focus();
                }
            }
            , timeout);
    }

    clonarObjeto(obj: any) {
        return Object.assign({}, obj);
    }

    txtInputFieldHasValue(input: any) {
        return input.value.toString().trim().length > 0;
    }

    cmbInputFieldHasValue(input: any) {
        return !(input.value === 0);
    }

}
