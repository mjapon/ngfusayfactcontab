import {Injectable} from '@angular/core';
import {parse} from 'date-fns';

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

    getLocaleEsForPrimeCalendar() {
        return {
            firstDayOfWeek: 1,
            dayNames: this.getDayNames(),
            dayNamesShort: this.getDayNamesShort(),
            dayNamesMin: this.getDayNamesMin(),
            monthNames: this.getMonthNames(),
            monthNamesShort: this.getMonthNamesShort(),
            today: 'Hoy',
            clear: 'Borrar'
        };
    }

    parseString(dateString) {
        let parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
        return parsedDate;
    }

    sumarDias(fecha, dias) {
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }

    getEdad(fechaNacimiento: Date): number {
        const today: Date = new Date();
        let age: number = today.getFullYear() - fechaNacimiento.getFullYear();
        const month: number = today.getMonth() - fechaNacimiento.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < fechaNacimiento.getDate())) {
            age--;
        }
        return age;
    }
}
