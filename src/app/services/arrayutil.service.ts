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

}
