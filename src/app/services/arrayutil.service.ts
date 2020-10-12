import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ArrayutilService {
    constructor() {
    }

    getFirstResult(array: Array<any>, fnFilter: any): any {
        const res = array.filter(fnFilter);
        return res.length > 0 ? res[0] : null;
    }

    removeElement(array: Array<any>, element: any): any {
        const index = array.indexOf(element);
        array.splice(index, 1);
    }

    /**
     * Verifica si un arreglo tiene un item con el valor 'value'
     * @param arreglo
     * @param value
     */
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

}
