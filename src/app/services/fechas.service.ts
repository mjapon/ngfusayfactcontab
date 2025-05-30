import {Injectable} from '@angular/core';
import {
    compareAsc,
    format,
    getDate,
    getDay,
    getMonth,
    getWeekOfMonth,
    getYear,
    isAfter,
    isEqual,
    isSameDay,
    isSameWeek,
    isSameYear,
    isToday,
    isWithinInterval,
    parse,
    startOfDay
} from 'date-fns';
import {es} from 'date-fns/locale';
import {TranslateService} from '@ngx-translate/core';

import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import endOfISOWeek from 'date-fns/endOfISOWeek';
import endOfMonth from 'date-fns/endOfMonth';
import isSameMonth from 'date-fns/isSameMonth';
import startOfISOWeek from 'date-fns/startOfISOWeek';
import startOfMonth from 'date-fns/startOfMonth';
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';
import {CtesService} from './ctes.service';

type Options = {
    year: number,
    month: number
};

// tslint:disable-next-line:variable-name
type convertFn = (Date, {isSameMonth}) => any;
const getMountMatrix = (
    {year, month}: Options,
    // tslint:disable-next-line:no-shadowed-variable
    convertDate: convertFn = date => date,
) => {
    const date = new Date(year, month);
    const matrix = eachWeekOfInterval(
        {
            start: startOfMonth(date),
            end: endOfMonth(date),
        },
        {weekStartsOn: 1},
    );
    return matrix.map(weekDay =>
        eachDayOfInterval({
            start: startOfISOWeek(weekDay),
            end: endOfISOWeek(weekDay),
        }).map(day =>
            convertDate(day, {
                isSameMonth: isSameMonth(date, day),
            }),
        ),
    );
};


@Injectable({
    providedIn: 'root'
})
export class FechasService {
    private readonly formatoFecha: string;
    private dayNamesShort: Array<any>;
    private monthNames: Array<any>;
    private loaded: boolean;
    private loadedMonths: boolean;
    private promiseDateShort: Promise<any>;
    private promiseMontNames: Promise<any>;

    constructor(private translateService: TranslateService,
                private ctes: CtesService) {
        this.formatoFecha = this.ctes.fmtfecha;
        this.loaded = false;
        this.loadDayNamesShort();
        this.loadMontNames();
    }

    formatDate(dateObj): string {
        return format(dateObj, this.formatoFecha);
    }

    formatDateDb(dateObj): string {
        return format(dateObj, this.ctes.fmtfechaDb);
    }

    dateIsBetween(date: Date, start: Date, end: Date) {
        return isWithinInterval(date, {start, end});
    }

    parseString(dateString): Date {
        return parse(dateString, this.formatoFecha, new Date());
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

    getFullDayStringOfCurrentDate() {
        const currentDate = new Date();
        const diames = format(currentDate, 'd', {locale: es});
    }

    getDayString(date: Date): Promise<any> {
        const diasemana = getDay(date);
        const diames = format(date, 'd', {locale: es});
        const respuesta: any = {diames, fecha: date};
        return new Promise((resolve) => {
            if (this.loaded) {
                respuesta.diastr = this.dayNamesShort[diasemana];
                resolve(respuesta);
            } else {
                this.promiseDateShort.then(res => {
                    this.resolvePromiseFechas(res);
                    respuesta.diastr = this.dayNamesShort[diasemana];
                    resolve(respuesta);
                });
            }
        });
    }

    resolvePromiseFechas(res) {
        this.loaded = true;
        this.dayNamesShort = res;
    }

    resolvePromiseMonts(res) {
        this.loadedMonths = true;
        this.monthNames = res;
    }

    loadDayNamesShort() {
        this.promiseDateShort = this.translateService.get('primeng.dayNamesShort').toPromise();
    }

    isGreaterOrEqualToCurrentDate(date: Date): boolean {
        // Normalizamos la fecha dada al inicio del día.
        const soloFecha1 = startOfDay(date);

        // Normalizamos la fecha actual al inicio del día.
        const soloFechaActual = startOfDay(new Date());

        // Usamos compareAsc para verificar si es mayor o igual.
        const comparacion = compareAsc(soloFecha1, soloFechaActual);

        return comparacion === 1 || comparacion === 0;
    }

    isGreaterOrEqual(dateA: Date, dateB: Date) {
        const comparacion = compareAsc(dateA, dateB);
        return comparacion === 1 || comparacion === 0;
    }

    loadMontNames() {
        this.promiseMontNames = this.translateService.get('primeng.monthNames').toPromise();
    }

    getHoraStrFromNumber(horaNumber: number) {
        const resto = horaNumber % 1;
        const nmin = Math.trunc(resto * 60);
        const nhoras = Math.trunc(horaNumber);
        const nhorasstr = nhoras.toString().padStart(2, '0');
        const nminstr = nmin.toString().padStart(2, '0');
        return `${nhorasstr}:${nminstr}`;
    }

    getDayOfMonth(date: Date) {
        return getDate(date);
    }

    getMonthArray(year: number, month: number, slctdDate?: Date) {
        const initDate = new Date(year, month);
        const css = [];
        const bordecss = [];
        let csstd = '';
        const matrix = getMountMatrix({year, month});
        return matrix.map(week => {
            return week.map(tday => {
                csstd = isToday(tday) ? 'smDiaCalHoy' : '';
                const dcal: any = {
                    num: getDate(tday),
                    fecha: tday,
                    sm: isSameMonth(tday, initDate),
                    css,
                    bordecss,
                    csstd
                };

                if (slctdDate && isEqual(slctdDate, tday)) {
                    dcal.selected = true;
                    dcal.css = 'smDiaCalSel';
                }
                return dcal;
            });
        });
    }

    getCurrentDate() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return hoy;
    }

    getCurrentDateStr() {
        const cd = this.getCurrentDate();
        return this.formatDate(cd);
    }

    getDiasSemana() {
        return ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    }

    getMesString(mes: number) {
        return new Promise((resolve) => {
            if (this.loadedMonths) {
                resolve(this.monthNames[mes - 1]);
            } else {
                this.promiseMontNames.then(res => {
                    this.resolvePromiseMonts(res);
                    resolve(this.monthNames[mes - 1]);
                });
            }
        });
    }

    getWeekOfMonth(date: Date) {
        return getWeekOfMonth(date, {weekStartsOn: 1});
    }

    getMonth(date: Date) {
        return getMonth(date);
    }

    getFirstMontDate(mes: number, anio: number) {
        return new Date(anio, mes - 1, 1);
    }

    dateInSameWeek(dateA: Date, dateB) {
        return isSameWeek(dateA, dateB, {weekStartsOn: 1});
    }

    isAfter(dateA: Date, dateB: Date) {
        return isAfter(dateA, dateB);
    }

    isSameDate(dateA: Date, dateB: Date) {
        return isEqual(dateA, dateB);
    }

    isSameDay(dateA: Date, dateB: Date) {
        return isSameDay(dateA, dateB);
    }

    isSameMonth(dateA: Date, dateB: Date) {
        return isSameMonth(dateA, dateB);
    }

    isSameYear(dateA: Date, dateB: Date) {
        return isSameYear(dateA, dateB);
    }

    isCurrentYearBisiesto() {
        const anio = getYear(new Date());
        return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
    }

    getEndYearDate(date: Date) {
        const endDate = '31/12/' + date.getFullYear();
        return this.parseString(endDate);
    }

    getDateFilters(form: any) {
        let desde = '';
        let hasta = '';
        if (form.desde) {
            desde = this.formatDate(form.desde);
        }
        if (form.hasta) {
            hasta = this.formatDate(form.hasta);
        }
        return {desde, hasta};
    }

    getDateStringFull(fecha: Date) {
        const fechaFormateada = format(fecha, 'EEEE, d \'de\' MMMM \'de\' yyyy', {
            locale: es
        });

        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    }
}
