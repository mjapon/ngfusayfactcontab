import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FechasService {
    dayNames: Array<any>;
    dayNamesShort: Array<any>;
    dayNamesMin: Array<any>;
    monthNames: Array<any>;
    monthNamesShort: Array<any>;

    constructor() {
        this.dayNames =
            [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ];

        this.dayNamesShort =
            ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

        this.dayNamesMin =
            ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

        this.monthNames =
            [
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

        this.monthNamesShort =
            [
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

    getDiaString(dia: number) {
        let index = dia;
        if (dia === 7) {
            index = 0;
        }
        return this.dayNames[index];
    }

    getMesString(mes: number) {
        return this.monthNames[mes];
    }


}
