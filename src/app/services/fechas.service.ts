import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FechasService {

    dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
    ];

    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
    ];

    monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
    ];

    constructor() {
    }

    getDayNames() {
        return this.dayNames;
    }

    getDayNamesShort() {
        return this.dayNamesShort;
    }

    getDayNamesMin() {
        return this.dayNamesMin;
    }

    getMonthNames() {
        return this.monthNames;
    }

    getMonthNamesShort() {
        return this.monthNamesShort;
    }


}
