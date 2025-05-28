import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {HeadWeekView, MavilCita, NewMavilEvent, RangeHours, WeekEvent} from '../types/gencalendartypes';
import {addDays, addWeeks, getISODay, startOfWeek} from 'date-fns';
import {FechasService} from '../../../services/fechas.service';
import {TcitaService} from '../../../services/tcita.service';
import {ColorUtilsService} from '../../../services/utils/color.util.service';

@Component({
    selector: 'app-week-view',
    templateUrl: './week-view.component.html',
    styleUrl: './week-view.component.scss'
})
export class WeekViewComponent implements OnInit {

    @ViewChild('calendarGrid') calendarGrid: ElementRef;

    dias: Array<HeadWeekView>;
    citas: Array<MavilCita>;
    rangeHours: RangeHours = {cstart: 6, cend: 20, hours: []};

    @Input()
    selectedDate: Date = new Date();
    currentMonthDate: Date;

    @Input() tipoCita: number;

    @Output() newMonthSelected = new EventEmitter<Date>();
    @Output() showDatosCita = new EventEmitter<MavilCita>();
    @Output() showNewEvent = new EventEmitter<NewMavilEvent>();
    isCreatingEvent = false;

    startElement: HTMLElement | null = null;
    currentEvent: WeekEvent = {
        startHour: 0,
        startMinute: 0,
        endHour: 0,
        endMinute: 0,
        day: 0,
        element: null,
        date: null
    };

    startY = 0;
    minHeight = 15;
    startHeight = 15;
    maxHeight = 0;
    minuteBySlot = 15;

    constructor(private renderer: Renderer2,
                private colorService: ColorUtilsService,
                public fechasService: FechasService,
                private tcitaService: TcitaService) {
    }

    ngOnInit(): void {
        this.loadWorkingHours();
    }

    getNextDate(date: Date) {
        return addDays(date, 1);
    }

    loadWorkingHours() {
        this.tcitaService.getWorkingHours(this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.rangeHours = res.rangeh;
                this.maxHeight = this.rangeHours.hours.length * 4 * this.minHeight;
                this.loadDias();
            }
        });
    }

    setDate(date: Date) {
        const isSameWeek = this.fechasService.dateIsBetween(date, this.dias[0].fecha, this.dias[6].fecha);
        this.selectedDate = date;
        if (!isSameWeek) {
            this.loadDias();
        } else {
            this.dias.forEach(dia => {
                dia.css = '';
                if (this.fechasService.isSameDay(this.selectedDate, dia.fecha)) {
                    dia.css = 'current-day';
                }
            });
        }
    }

    loadDias() {
        this.dias = [];
        let iterdate = addDays(startOfWeek(addDays(this.selectedDate, -1)), 1);
        const fechasPromise = new Promise((resolve) => {
            for (let i = 0; i < 7; i++) {
                const resfecha = this.fechasService.getDayString(iterdate);
                resfecha.then((res) => {
                    let estilo = '';
                    if (this.fechasService.isSameDay(this.selectedDate, res.fecha)) {
                        estilo = 'current-day';
                    }
                    this.dias.push({
                        fecha: res.fecha,
                        diastr: res.diastr,
                        diames: res.diames,
                        css: estilo
                    });
                    if (i === 6) {
                        resolve(true);
                    }
                });
                iterdate = this.getNextDate(iterdate);
            }
        });

        fechasPromise.then(res => {
            this.loadCitas();
        });
    }

    removeAllCitasChildren() {
        const parent = this.calendarGrid.nativeElement;
        const children = parent.querySelectorAll('.calendar-event'); // Select children with the class
        children.forEach((child: any) => {
            this.renderer.removeChild(parent, child);
        });
    }

    addEventInDom(cita: MavilCita) {
        const fullEventInfo = (cita.per_nombres || '') +
            (cita.per_apellidos ? ' ' + cita.per_apellidos : '') +
            (cita.ct_titulo ? ' ' + cita.ct_titulo : '') +
            (cita.ct_obs ? ' ' + cita.ct_obs : '');

        let eventText = cita.per_nombres;
        if (!cita.per_nombres) {
            eventText = cita.ct_titulo;
            if (!cita.ct_titulo) {
                eventText = cita.ct_obs;
            }
        }

        const eventElement = this.renderer.createElement('div');
        this.renderer.addClass(eventElement, 'calendar-event');
        this.renderer.setStyle(eventElement, 'background-color', cita.ct_color);
        this.renderer.setStyle(eventElement, 'color', this.colorService.getTextColorSimple(cita.ct_color));
        this.renderer.addClass(eventElement, 'creating');
        this.renderer.setAttribute(eventElement, 'data-event-id', cita.ct_id.toString());
        const mavilCita = this.parseMavilEventToWeekEvent(cita);
        const timeText = this.formatEventTime(mavilCita);

        this.renderer.setAttribute(eventElement, 'title', fullEventInfo + ' ' + timeText);

        this.positionEventElement(eventElement, mavilCita);

        const timeElement = this.renderer.createElement('div');
        this.renderer.addClass(timeElement, 'calendar-event-time');


        this.renderer.appendChild(timeElement, this.renderer.createText(timeText));

        const titleElement = this.renderer.createElement('div');
        this.renderer.addClass(titleElement, 'calendar-event-title');
        this.renderer.appendChild(titleElement, this.renderer.createText(eventText));

        const titleTimeElemente = this.renderer.createElement('div');


        const {startTimeInMinutes, durationInMinutes} = this.getEventDurationInMinutes(mavilCita);
        if (durationInMinutes <= this.minuteBySlot) {
            this.renderer.addClass(titleTimeElemente, 'calendar-event-flow');
        }

        this.renderer.appendChild(titleTimeElemente, titleElement);
        this.renderer.appendChild(titleTimeElemente, timeElement);
        this.renderer.appendChild(eventElement, titleTimeElemente);


        // Add to DOM
        this.renderer.appendChild(this.calendarGrid.nativeElement, eventElement);

        eventElement.element = eventElement;

        // Add double click to edit
        this.renderer.listen(eventElement.element, 'click', () => {
            this.showDatosCita.emit(cita);
        });
    }

    loadCitas() {
        this.citas = [];
        this.removeAllCitasChildren();
        const startDate = this.dias[0].fecha;
        const endDate = this.dias[this.dias.length - 1].fecha;
        this.tcitaService.listar(this.fechasService.formatDate(startDate),
            this.fechasService.formatDate(endDate), this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.citas = res.citas;
                this.citas.forEach(cita => {
                    this.addEventInDom(cita);
                });
            }
        });
    }

    @HostListener('document:mouseup')
    onMouseUp(): void {
        if (this.isCreatingEvent) {
            this.positionEventElement(this.currentEvent.element, this.currentEvent);
            this.finishCreateEvent();
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.isCreatingEvent && target.classList.contains('time-slot')) {
            this.startY = event.clientY;
            this.startHeight = this.minHeight;
            this.startCreateEvent(target, event);
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.isCreatingEvent && this.startElement && this.currentEvent.element) {
            event.preventDefault();
            const deltaY = event.clientY - this.startY;
            let newHeight = this.startHeight + deltaY;
            newHeight = Math.max(this.minHeight, Math.min(newHeight, this.maxHeight));
            this.renderer.setStyle(this.currentEvent.element, 'height', `${newHeight}px`);
            const slots = Math.ceil(newHeight / this.minHeight);

            if (slots >= 1) {
                const endMinute = this.currentEvent.startMinute + (slots * this.minuteBySlot);
                const hourAdded = Math.floor(endMinute / 60);
                this.currentEvent.endMinute = endMinute % 60;
                this.currentEvent.endHour = this.currentEvent.startHour + hourAdded;
            }
            const timeElement = this.currentEvent.element.querySelector('.calendar-event-time');
            if (timeElement) {
                timeElement.textContent = this.formatEventTime(this.currentEvent);
            }
            const titleTimeElement = this.currentEvent.element.querySelector('.calendar-event-time-title');
            if (slots > 1) {
                this.renderer.removeClass(titleTimeElement, 'calendar-event-flow');
            } else {
                this.renderer.addClass(titleTimeElement, 'calendar-event-flow');
            }
        }
    }

    auxIsSameMonth(date: Date) {
        let sameMonth = true;
        if (!this.fechasService.isSameYear(this.currentMonthDate, date)) {
            sameMonth = false;
        } else if (!this.fechasService.isSameMonth(this.currentMonthDate, date)) {
            sameMonth = false;
        }
        return sameMonth;
    }

    toggleWeek(cant: number) {
        const newweekdate = addWeeks(this.selectedDate, cant);
        const samemonth = this.auxIsSameMonth(newweekdate);
        if (!samemonth) {
            this.newMonthSelected.emit(newweekdate);
        }
        this.selectedDate = newweekdate;
        this.loadDias();
    }

    startCreateEvent(cell: HTMLElement, event: MouseEvent): void {
        event.preventDefault();
        this.isCreatingEvent = true;
        this.startElement = cell;
        const {day, hour, minute, date} = this.getCellInfo(cell);
        this.currentEvent = {
            day,
            startHour: hour,
            startMinute: minute,
            endHour: hour,
            endMinute: minute + 15,
            element: null,
            date
        };
        // Create event element
        const eventElement = this.renderer.createElement('div');
        this.renderer.addClass(eventElement, 'calendar-event');
        this.renderer.addClass(eventElement, 'creating');

        // Position the event in the grid
        this.positionEventElement(eventElement, this.currentEvent);

        // Add event info
        const titleElement = this.renderer.createElement('div');
        this.renderer.addClass(titleElement, 'calendar-event-title');
        this.renderer.appendChild(titleElement, this.renderer.createText('(Sin título)'));

        const timeElement = this.renderer.createElement('div');
        this.renderer.addClass(timeElement, 'calendar-event-time');

        const timeText = this.formatEventTime(this.currentEvent);
        this.renderer.appendChild(timeElement, this.renderer.createText(timeText));

        const titleTimeElemente = this.renderer.createElement('div');
        this.renderer.addClass(titleTimeElemente, 'calendar-event-time-title');
        this.renderer.addClass(titleTimeElemente, 'calendar-event-flow');

        this.renderer.appendChild(titleTimeElemente, titleElement);
        this.renderer.appendChild(titleTimeElemente, timeElement);

        this.renderer.appendChild(eventElement, titleTimeElemente);
        this.renderer.appendChild(this.calendarGrid.nativeElement, eventElement);
        this.currentEvent.element = eventElement;
    }

    finishCreateEvent(): void {
        if (!this.currentEvent.element) {
            return;
        }

        this.isCreatingEvent = false;
        this.renderer.removeClass(this.currentEvent.element, 'creating');

        const newMavilEvent: NewMavilEvent = {
            date: this.currentEvent.date,
            startHour: this.currentEvent.startHour,
            startMinute: this.currentEvent.startMinute,
            endHour: this.currentEvent.endHour,
            endMinute: this.currentEvent.endMinute
        };

        this.showNewEvent.emit(newMavilEvent);
        this.startElement = null;
        this.currentEvent.element = null;
    }

    getCellInfo(cell: HTMLElement): { day: number, hour: number, minute: number, date: Date } {
        const dayStr = cell.getAttribute('data-day');
        const hourStr = cell.getAttribute('data-hour');
        const minuteStr = cell.getAttribute('data-minute');
        const date = new Date(cell.getAttribute('data-date'));

        return {
            day: dayStr ? parseInt(dayStr, 10) : 0,
            hour: hourStr ? parseInt(hourStr, 10) : 0,
            minute: minuteStr ? parseInt(minuteStr, 10) : 0,
            date
        };
    }

    parseMavilEventToWeekEvent(cita: MavilCita): WeekEvent {
        const eventDate = this.fechasService.parseString(cita.ct_fecha);
        const week = getISODay(eventDate) - 1;
        const startHour = Math.floor(cita.ct_hora);
        const startMinute = Math.floor((cita.ct_hora % 1) * 60);
        const endHour = Math.floor(cita.ct_hora_fin);
        const endMinute = Math.floor((cita.ct_hora_fin % 1) * 60);
        return {
            startHour,
            startMinute,
            endHour,
            endMinute,
            day: week,
            element: null,
            date: eventDate
        };
    }

    getEventDurationInMinutes(event: any) {
        const startTimeInMinutes = (event.startHour - this.rangeHours.cstart) * 60 + event.startMinute;
        const endTimeInMinutes = (event.endHour - this.rangeHours.cstart) * 60 + event.endMinute;
        const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
        return {startTimeInMinutes, durationInMinutes};
    }

    positionEventElement(element: HTMLElement, event: any): void {
        // Calculate position and size
        const dayWidth = 100 / this.dias.length;
        const leftPos = event.day * dayWidth;
        const {startTimeInMinutes, durationInMinutes} = this.getEventDurationInMinutes(event);
        const topPos = (startTimeInMinutes / 15) * this.minuteBySlot;
        const height = (durationInMinutes / 15) * this.minuteBySlot;

        // Set position and size
        this.renderer.setStyle(element, 'left', `${leftPos}%`);
        this.renderer.setStyle(element, 'top', `${topPos}px`);
        this.renderer.setStyle(element, 'width', `calc(${dayWidth}% - 2px)`);
        this.renderer.setStyle(element, 'height', `${height}px`);
        this.renderer.setAttribute(element, 'data-event-height', height.toString());
    }

    auxformatTime(hour: number, minute: number) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    formatEventTime(event: any): string {
        const startTimeInMinutes = event.startHour * 60 + event.startMinute;
        const endTimeInMinutes = event.endHour * 60 + event.endMinute;
        const durationInMinutes = endTimeInMinutes - startTimeInMinutes;

        const startTime = this.auxformatTime(event.startHour, event.startMinute);
        const endTime = this.auxformatTime(event.endHour, event.endMinute);
        if (durationInMinutes > 15) {
            return `${startTime} – ${endTime}`;
        } else {
            return `${startTime}`;
        }
    }
}
