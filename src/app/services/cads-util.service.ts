import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CadsUtilService {

    constructor() {
    }

    esSoloNumeros(texto: string): boolean {
        return /^([0-9])*$/.test(texto);
    }

    isEmpty(texto: string): boolean {
        let result = true;
        if (texto) {
            result = texto.trim().length === 0;
        }
        return result;
    }

    esNoNuloNoVacio(texto: string): boolean {
        if (texto) {
            return texto.trim().length > 0;
        }
        return false;
    }


}
