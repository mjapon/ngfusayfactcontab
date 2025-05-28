import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {addMonths, getMonth, getYear} from 'date-fns';
import {FechasService} from '../../../services/fechas.service';
import {SwalService} from '../../../services/swal.service';
import {TcitaService} from '../../../services/tcita.service';
import {PersonaService} from '../../../services/persona.service';
import {DomService} from '../../../services/dom.service';
import {MenuItem} from 'primeng/api';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {CitasodontmsgService} from '../../../services/citasodontmsg.service';
import {Router} from '@angular/router';
import {ConsMedicaMsgService} from '../../../services/cons-medica-msg.service';
import {NewMavilEvent, RangeHours} from '../types/gencalendartypes';
import {WeekViewComponent} from '../week-view/week-view.component';

@Component({
    selector: 'app-mvcalendar',
    templateUrl: './odcalendar.component.html',
    styleUrls: ['./odcalendar.component.scss']
})
export class MvcalendarComponent implements OnInit, OnChanges {
    @Input() tipoCita: number;
    @Input() showCancelar = false;
    @Input() showListado = false;
    @Input() enableCalendars = false;

    @ViewChild('calendarWeekView') calendarWeekView: WeekViewComponent;

    selectedDate: Date;
    selectedDiaCalMes: any;

    horasList: Array<any>;
    hours: Array<any> = [];
    rangeHours: RangeHours = {cstart: 6, cend: 20, hours: []};
    colores: Array<any>;
    form: any;

    textoNewEv: string;
    mesArray: Array<any>;
    diasSemana: Array<any>;
    mesString: string;
    mesDateString: string;
    currentMonthDate: Date;
    currentMonthNumber: number;
    showModalCrea: boolean;
    showModalDetalles: boolean;
    datosCita: any;
    pacsFiltered: Array<any>;
    medicos: Array<any>;
    personsCita: Array<any>;
    personCitaSel: number;
    colorsMI: Array<MenuItem>;
    currentDate: Date;
    defEvColor: string;
    titEvNewEdCita: string;
    pacForCalendar: any;

    @Output() evCreated = new EventEmitter<any>();
    @Output() evCancelar = new EventEmitter<any>();
    @Output() evListado = new EventEmitter<any>();

    @Output() evGotoDetallesCita = new EventEmitter<any>();
    isShowFormCreaRef = false;
    codreferenteform = 0;

    constructor(public fechasService: FechasService,
                private swalService: SwalService,
                private personaService: PersonaService,
                private lclStrgService: LocalStorageService,
                private tcitaService: TcitaService,
                private router: Router,
                private cosMsgService: ConsMedicaMsgService,
                private citasOdontMsgService: CitasodontmsgService,
                private loadinUiServ: LoadingUiService,
                private domService: DomService) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const tipcitaChange = changes.tipoCita;
        if (tipcitaChange.currentValue) {
            this.personCitaSel = tipcitaChange.currentValue;
        }
    }

    ngOnInit(): void {
        this.form = {};
        this.pacForCalendar = null;
        this.datosCita = {};
        this.defEvColor = '#039BE5';
        this.colores = [];
        this.colorsMI = [];
        this.textoNewEv = '';
        this.selectedDate = new Date();
        this.currentMonthDate = this.selectedDate;
        this.diasSemana = this.fechasService.getDiasSemana();
        this.pacsFiltered = [];
        this.currentDate = new Date();

        this.auxLoadDatosTipCita();
        this.loadPersonsCita();
        this.initListasForm();
    }

    initListasForm() {
        this.tcitaService.getForm(this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.horasList = res.horas;
                this.colores = res.colores;
                this.hours = res.hours;
                this.rangeHours = res.rangeh;
            }
        });
    }

    loadMedicos() {
        this.medicos = [];
        this.personaService.listarMedicos(this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.medicos = res.medicos;
            }
        });
    }

    loadPersonsCita() {
        this.personsCita = [];
        this.tcitaService.getPersonsCita().subscribe(res => {
            if (res.status === 200) {
                this.personsCita = res.personscita;
            }
        });
    }

    toggleMonth(cant: number) {
        this.currentMonthDate = addMonths(this.currentMonthDate, cant);
        this.loadMesArray();
    }

    onNewMonthSelected(newDate: Date) {
        this.currentMonthDate = newDate;
        this.loadMesArray();
        const dayCal = this.auxFindDateInMonthArray(newDate);
        this.selectedDiaCalMes = dayCal;
        this.clearCssMonthCalc();
        dayCal.css = 'smDiaCalSel';

        const anio = getYear(this.currentMonthDate);
        this.fechasService.getMesString(getMonth(this.currentMonthDate) + 1).then(res => {
            this.mesDateString = `${res} de ${anio}`;
        });
    }


    loadMesArray(dateSel?: Date) {
        this.currentMonthNumber = this.fechasService.getMonth(this.currentMonthDate);
        const anio = getYear(this.currentMonthDate);
        this.fechasService.getMesString(getMonth(this.currentMonthDate) + 1).then(res => {
            this.mesString = `${res} de ${anio}`;
        });
        this.mesArray = this.fechasService.getMonthArray(getYear(this.currentMonthDate), getMonth(this.currentMonthDate), dateSel);

        const firstweek = this.mesArray[0];
        const lastweek = this.mesArray[this.mesArray.length - 1];
        const desdestr = this.fechasService.formatDate(firstweek[0].fecha);
        const hastastr = this.fechasService.formatDate(lastweek[lastweek.length - 1].fecha);

        this.tcitaService.contar(desdestr, hastastr, this.tipoCita).subscribe(resc => {
            this.mesArray.forEach(row => {
                const filtered = row.filter(dc => dc.selected);
                if (filtered && filtered.length > 0) {
                    filtered[0].css = ['smDiaCalSel'];
                    this.setCalendarDate(filtered[0]);
                }
                row.forEach(dc => {
                    const dcfilt = resc.citas.filter(cf =>
                        this.fechasService.isSameDate(this.fechasService.parseString(cf.ct_fecha), dc.fecha));
                    if (dcfilt && dcfilt.length > 0) {
                        dc.bordecss = ['smDiaCF'];
                    }
                });
            });
        });
    }


    canCitaEdit() {
        return this.fechasService.isGreaterOrEqualToCurrentDate(
            this.fechasService.parseString(this.datosCita.ct_fecha)
        );
    }

    onNewEvent(newEvent: NewMavilEvent) {
        this._auxIniFormEv();
        const eventDate = newEvent.date;
        eventDate.setHours(newEvent.startHour, newEvent.startMinute);
        if (this.fechasService.isGreaterOrEqual(eventDate, new Date())) {
            this.form.ct_fechaobj = newEvent.date;
            this.form.ct_hora = newEvent.startHour + (newEvent.startMinute / 60.0);
            this.form.ct_hora_fin = newEvent.endHour + +(newEvent.endMinute / 60.0);
            this.showModalCrea = true;
        } else {
            this.swalService.fireWarning('No es posible crear un evento antes de la fecha actual');
            this.calendarWeekView.loadCitas();
        }
    }

    initFormEditEv() {
        this.titEvNewEdCita = 'Editar Cita';
        this.form.ct_id = this.datosCita.ct_id;
        this.form.ct_titulo = this.datosCita.ct_titulo;
        this.form.paciente = {per_id: this.datosCita.pac_id};
        this.form.med_id = this.datosCita.med_id;
        this.form.ct_obs = this.datosCita.ct_obs;
        this.form.ct_td = false;
        this.form.ct_color = this.datosCita.ct_color;
        const fechaEv = this.fechasService.parseString(this.datosCita.ct_fecha);
        this.form.ct_fechaobj = fechaEv;
        const currentDate = new Date();
        if (this.fechasService.isSameDay(fechaEv, currentDate)) {
            this.form.ct_fechaobj.setHours(currentDate.getHours());
            this.form.ct_fechaobj.setMinutes(currentDate.getMinutes());
            this.form.ct_fechaobj.setSeconds(currentDate.getSeconds());
        }
        this.form.ct_hora = this.datosCita.ct_hora;
        this.form.ct_hora_fin = this.datosCita.ct_hora_fin;
    }

    _auxIniFormEv() {
        this.titEvNewEdCita = 'Nueva Cita';
        this.form.ct_id = 0;
        this.form.ct_tipo = this.tipoCita;
        this.form.ct_titulo = '';
        this.form.paciente = null;
        const pacForCal = this.lclStrgService.getItem('PAC_FOR_CAL');
        if (pacForCal) {
            this.pacForCalendar = JSON.parse(pacForCal);
            this.form.paciente = this.pacForCalendar;
        }
        this.form.med_id = this.medicos.length > 0 ? this.medicos[0].per_id : null;
        this.form.ct_obs = '';
        this.form.ct_td = false;
        this.form.ct_color = this.defEvColor;
    }

    initFormEvBtn() {
        this._auxIniFormEv();
        if (this.selectedDate) {
            this.form.ct_fechaobj = this.selectedDate;
        } else {
            this.form.ct_fechaobj = new Date();
        }

        this.form.ct_hora = 0;
        this.form.ct_hora_fin = 0;
    }

    onCreaEvClic() {
        this.initFormEvBtn();
        this.showModalCrea = true;
    }

    changeSelectedDate(date: Date, sameMonth: boolean) {
        this.selectedDate = date;
        this.currentMonthDate = this.selectedDate;
        if (!sameMonth) {
            this.loadMesArray(date);
        }
        const anio = getYear(this.currentMonthDate);
        this.fechasService.getMesString(getMonth(this.selectedDate) + 1).then(res => {
            this.mesDateString = `${res} de ${anio}`;
        });
    }

    auxFindDateInMonthArray(date: Date) {
        let daycal = null;
        this.mesArray.forEach(row => {
            row.forEach(dc => {
                if (this.fechasService.isSameDate(dc.fecha, date)) {
                    daycal = dc;
                    return;
                }
            });
        });
        return daycal;
    }

    setCalendarDate(dayCal: any) {
        this.selectedDiaCalMes = dayCal;
        this.clearCssMonthCalc();
        dayCal.css = 'smDiaCalSel';
        this.changeSelectedDate(dayCal.fecha, dayCal.sm);
        this.calendarWeekView.setDate(dayCal.fecha);
    }

    clearCssMonthCalc() {
        this.mesArray.forEach(row => {
            row.forEach(dc => {
                dc.css = '';
            });
        });
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

    fechaActual() {
        return this.fechasService.getDateStringFull(new Date());
    }

    hoy() {
        this.selectedDiaCalMes = null;
        const fechaActual = this.fechasService.getCurrentDate();
        const sameMonth = this.auxIsSameMonth(fechaActual);
        if (sameMonth) {
            this.clearCssMonthCalc();
        }
        this.changeSelectedDate(fechaActual, sameMonth);
        this.calendarWeekView.setDate(new Date());
    }

    onCloseModalNewEv() {
        this.closeModalNewEv();
    }

    closeModalNewEv() {
        this.form = {};
        this.showModalCrea = false;
        this.calendarWeekView.loadCitas();
    }

    buscaPacs(event) {
        this.personaService.buscarPorNomapelCiPag(event.query, 0, 0).subscribe(res => {
            if (res.status === 200) {
                this.pacsFiltered = res.items;
            }
        });
    }

    guardarEv() {
        if (this.form.paciente) {
            this.form.pac_id = this.form.paciente.per_id;
        } else {
            this.form.pac_id = 0;
        }

        this.form.ct_fecha = this.fechasService.formatDate(this.form.ct_fechaobj);
        if (this.form.ct_hora === 0 || this.form.ct_hora_fin === 0) {
            this.swalService.fireWarning('Debe ingresar la fecha y hora de la cita');
            this.closeModalNewEv();
            return;
        }

        this.tcitaService.guardar(this.form).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.calendarWeekView.loadCitas();
                this.closeModalNewEv();
                this.clearPacForCalendar();
                this.evCreated.emit(this.form);
            }
        });
    }

    onPacSelect($event: any) {
        this.domService.setFocusTm('detalleCitaTa', 100);
    }

    onMedicoChange($event: any) {
        this.domService.setFocusTm('detalleCitaTa', 100);
    }

    onModalNewEvShow($evet: any) {
        this.domService.setFocusTm('inputCtTitulo', 100);
    }

    onEventClic(tcita: any) {
        this.loadinUiServ.publishBlockMessage();
        this.tcitaService.getDatosCita(tcita.ct_id).subscribe(res => {
            if (res.status === 200) {
                this.datosCita = res.cita;
                this.showModalDetalles = true;
            }
        });
    }

    selectColor(color: any) {
        this.form.ct_color = color;
    }

    anularEv() {
        const msg = '¿Seguro que desea anular este evento?';
        this.showModalDetalles = false;
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.tcitaService.anular(this.datosCita.ct_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.calendarWeekView.loadCitas();
                        }
                        this.showModalDetalles = false;
                    });
                }
            }
        );
    }

    editarEv() {
        this.showModalDetalles = false;
        this.initFormEditEv();
        this.showModalCrea = true;
    }

    closeModalDetEv() {
        this.showModalDetalles = false;
    }

    setFocusPac() {
        this.domService.setFocusTm('pacAutoCom', 100);
    }

    clearPacForCalendar() {
        this.pacForCalendar = null;
        this.form.paciente = null;
        this.lclStrgService.removeItem('PAC_FOR_CAL');
    }

    raiseCancelClic() {
        this.evCancelar.emit('');
    }

    raiseListadoClic() {
        this.evListado.emit(this.tipoCita);
    }

    auxLoadDatosTipCita() {
        this.changeSelectedDate(this.fechasService.getCurrentDate(), true);
        this.loadMesArray();
        this.loadMedicos();
    }

    onPersonCitaChange($event: any) {
        if (this.personCitaSel && this.personCitaSel !== this.tipoCita) {
            this.tipoCita = this.personCitaSel;
            this.calendarWeekView.tipoCita = this.tipoCita;
            this.auxLoadDatosTipCita();
            this.calendarWeekView.loadWorkingHours();
            this.initListasForm();
        }
    }

    showFormCreaRef() {
        this.isShowFormCreaRef = true;
    }

    onCancelaCreacionRef($event: any) {
        this.isShowFormCreaRef = false;
    }

    onReferenteCreado($event: any) {
        this.personaService.buscarPorCod($event).subscribe(res => {
            this.isShowFormCreaRef = false;
            if (res.status === 200) {
                this.pacForCalendar = res.persona;
                this.form.paciente = this.pacForCalendar;
            }
        });
    }

    gotoFicha() {
        if (this.datosCita.pac_id > 0) {
            if (this.tipoCita === 2) {
                this.router.navigate(['odonto']).then(() => {
                    setTimeout(() => {
                        const paciente = {tipo: 1, paciente: {per_id: this.datosCita.pac_id}};
                        this.citasOdontMsgService.publishMessage(paciente);
                    }, 500);
                });
            } else {
                this.router.navigate(['historiaclinica', '1']).then(() => {
                    setTimeout(() => {
                        const paciente = {tipo: 1, msg: {per_id: this.datosCita.pac_id}};
                        this.cosMsgService.publishMessage(paciente);
                    }, 500);
                });
            }
        }

    }

    toggleWeek(amount: number) {
        this.calendarWeekView.toggleWeek(amount);
    }
}
