import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CadenasutilService {

    constructor() {
    }

    esSoloNumeros(texto: string): boolean {
        return /^([0-9])*$/.test(texto);
    }


}
