import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FinanCredlistFilter {
    filtro = '';
    estadosel: any = {};

    claer() {
        this.filtro = '';
        this.estadosel = {};
    }
}
