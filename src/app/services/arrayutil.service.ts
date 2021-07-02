import {Injectable} from '@angular/core';
import {NumberService} from './number.service';

@Injectable({
    providedIn: 'root'
})
export class ArrayutilService {
    constructor(
        private numberService: NumberService
    ) {
    }

    getFirstResult(array: Array<any>, fnFilter: any): any {
        const res = array.filter(fnFilter);
        return res.length > 0 ? res[0] : null;
    }

    findSeccion(secciones: Array<any>, secid: number) {
        return this.getFirstResult(secciones, el => {
            return el.sec_id === secid;
        });
    }

    findUsuario(users: Array<any>, usid: number) {
        return this.getFirstResult(users, el => {
            return el.us_id === usid;
        });
    }

    removeElement(array: Array<any>, element: any): any {
        const index = array.indexOf(element);
        array.splice(index, 1);
    }

    moveElement(array: Array<any>, oldIndex: number, newIndex: number): any {
        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    }

    contains(arreglo: Array<any>, value) {
        let contains = false;
        if (arreglo) {
            arreglo.forEach(item => {
                if (item === value) {
                    contains = true;
                }
            });
        }
        return contains;
    }

    /**
     * Se usa en transacciones que involucran cuentas contables
     * @param thearray El array que tiene todas la cuentas
     * @param idx el indice actual de la fila a analizar
     * @param total el total del importe
     */
    getMontoFila(thearray, idx, total) {
        let suma = total;
        if (idx > 0) {
            const arrsuma = thearray.slice(0, idx);
            suma = Number(0.0);
            arrsuma.forEach(item => {
                suma += Number(item.dt_valor);
            });
            const diff = Number(total) - suma;
            if (diff >= 0) {
                suma = this.numberService.round2(diff);
            } else {
                suma = 0.0;
            }
        }
        return suma;
    }


}
