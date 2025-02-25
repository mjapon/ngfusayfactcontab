import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {addDays, addMonths, addWeeks, getMonth, getYear, startOfWeek} from 'date-fns';
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

    calHoraIni: number;
    calHoraFin: number;
    intervalo: number;
    parteshora: number;
    citas: any;
    citasmatrix: any;
    filas: number;
    columnas: number;
    anchocelda = 135;
    altocelda = 18;
    dias: Array<any>;
    selectedDate: Date;
    selectedDiaCalMes: any;
    fechasPromise: Promise<any>;
    pixelsselected: Array<any>;

    horasList: Array<any>;
    colores: Array<any>;
    form: any;

    clicstart = false;
    clicfinish = false;

    xini = 0;
    yini = 0;
    bloque = 1;
    cssform: any;

    anchoCeldaHora: number;
    altoCeltaDia: number;
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
    isShowFormCreaRef = false;
    codreferenteform = 0;

    constructor(private fechasService: FechasService,
                private swalService: SwalService,
                private personaService: PersonaService,
                private lclStrgService: LocalStorageService,
                private tcitaService: TcitaService,
                private router: Router,
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
        this.pixelsselected = [];
        this.cssform = {};
        this.textoNewEv = '';
        this.currentMonthDate = this.selectedDate;
        this.diasSemana = this.fechasService.getDiasSemana();
        this.pacsFiltered = [];
        this.currentDate = new Date();
        this.calHoraIni = 8.0;
        this.calHoraFin = 19.0;
        this.anchoCeldaHora = 70;
        this.altoCeltaDia = 50;
        this.intervalo = 0.25; // 15minutos
        this.parteshora = 1 / this.intervalo;
        this.columnas = 7;

        this.loadinUiServ.publishBlockMessage();
        this.tcitaService.getDatosTipoCita(this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.auxLoadDatosTipCita(res.dtipcita);
                this.loadPersonsCita();
                this.initListasForm();
            }
        });
    }

    initListasForm() {
        this.tcitaService.getForm(this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.horasList = res.horas;
                this.colores = res.colores;
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

    toggleWeek(cant: number) {
        const newweekdate = addWeeks(this.selectedDate, cant);
        const samemonth = this.auxIsSameMonth(newweekdate);
        if (!samemonth) {
            this.currentMonthDate = newweekdate;
            this.loadMesArray();
        }
        const daycal = this.auxFindDateInMonthArray(newweekdate);
        if (daycal) {
            this.setCalendarDate(daycal);
        }
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

    getHoraNumber(fila) {
        let index = this.citasmatrix.indexOf(fila);
        if (typeof fila === 'number') {
            index = fila - 1;
        }
        return this.calHoraIni + (index * this.intervalo);
    }

    gethoraStr(fila) {
        const hora = this.getHoraNumber(fila);
        return this.fechasService.getHoraStrFromNumber(hora);
    }

    getNextDate(date: Date) {
        return addDays(date, 1);
    }

    updateEstiloDia() {
        this.dias.forEach(d => {
            let estilo = [];
            if (this.fechasService.isSameDate(this.selectedDate, d.fecha)) {
                estilo = ['smDiaCalSel'];
            }
            d.css = estilo;
        });
    }

    loadDias() {
        this.dias = [];
        let iterdate = addDays(startOfWeek(addDays(this.selectedDate, -1)), 1);
        this.fechasPromise = new Promise((resolve) => {
            for (let i = 0; i < 7; i++) {
                const resfecha = this.fechasService.getDayString(iterdate);
                resfecha.then((res) => {
                    let estilo = [];
                    if (this.fechasService.isSameDate(this.selectedDate, res.fecha)) {
                        estilo = ['smDiaCalSel'];
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

        this.fechasPromise.then(res => {
            this.buildEmptyPixelsArray();
            this.loadCitas();
        });
    }

    addCol(fila) {
        const resto = this.citasmatrix.indexOf(fila) % this.parteshora;
        return resto === 0;
    }

    getDia(x: number) {
        return this.dias[x];
    }

    getNewPixelEmpty(x, y) {
        const cssclass = ['limitedia'];
        if (y % this.parteshora === 0) {
            cssclass.push('limitehora');
        }
        return {
            id: x + ',' + y,
            x,
            y,
            status: 0,
            cssclass,
            startcss: cssclass,
            lock: 0,
            comprado: 0,
            dia: this.getDia(x - 1),
            hora: this.getHoraNumber(y)
        };
    }

    getancho(pixel) {
        return this.anchocelda;
    }

    getalto(pixel) {
        const pxY = pixel.px_row;
        const pxYend = pixel.px_row_end;
        const numpxborde = Math.abs(pxY - pxYend) + 1;
        return numpxborde * this.altocelda;
    }

    getPixelFromCita(tcita: any) {
        const hora = tcita.ct_hora;
        const horaFin = tcita.ct_hora_fin;
        const cFecha = tcita.ct_fecha;
        const cFechaDate = this.fechasService.parseString(cFecha);

        const horaStr = this.fechasService.getHoraStrFromNumber(hora);
        const horaFinStr = this.fechasService.getHoraStrFromNumber(horaFin);
        const paciente = `${tcita.per_nombres} ${tcita.per_apellidos}`;
        const textoCita = `${horaStr} -${horaFinStr}: ${paciente} - ${tcita.ct_titulo} - ${tcita.ct_obs}`;

        let pxRow = 0;
        let pxRowEnd = 0;

        let pxCol = 0;
        let pxColEnd = 0;

        this.citasmatrix.forEach(row => {
            row.forEach(col => {
                if ((col.hora === hora) || (col.hora === horaFin)) {
                    if (col.hora === hora) {
                        pxRow = col.y;
                    }
                    if (col.hora === horaFin) {
                        pxRowEnd = col.y - 1;
                    }
                }
                if (this.fechasService.isSameDate(col.dia.fecha, cFechaDate)) {
                    pxCol = col.x;
                    pxColEnd = col.x;
                }
            });
        });

        return {
            px_row: pxRow,
            px_row_end: pxRowEnd,
            px_col: pxCol,
            px_col_end: pxColEnd,
            px_color: tcita.ct_color,
            px_texto: textoCita
        };
    }

    getcss(pixel: any) {
        const pxY = pixel.px_row < pixel.px_row_end ? pixel.px_row : pixel.px_row_end;
        const pxX = pixel.px_col;
        const left = this.anchoCeldaHora + ((pxX - 1) * this.anchocelda);
        const top = (pxY - 1) * this.altocelda;
        const topPx = `${top}px`;
        const leftPx = `${left}px`;
        const anxhopx = this.getancho(pixel);
        const altopx = this.getalto(pixel);
        const opacidad = pixel.px_estado === 0 ? '0.4' : '1';
        const border = pixel.px_estado === 0 ? '0px solid black' : '0px solid orange';

        const cssg = {
            position: 'absolute',
            left: leftPx,
            top: topPx,
            width: `${anxhopx}px`,
            'min-width': `${anxhopx}px`,
            height: `${altopx}px`,
            'background-color': pixel.px_color,
            border,
            opacity: opacidad
        };
        try {
            const fila = this.citasmatrix[pixel.px_row - 1];
            const col = fila[pxX - 1];
            const fila2 = this.citasmatrix[pixel.px_row_end - 1];
            const col2 = fila2[pxX - 1];
            const hora = col.hora;
            const horaFin = col2.hora + this.intervalo;
            const horaStr = this.fechasService.getHoraStrFromNumber(hora);
            const horaFinStr = this.fechasService.getHoraStrFromNumber(horaFin);
            this.textoNewEv = `${horaStr} -${horaFinStr}`;
        } catch (err) {
            this.textoNewEv = 'err';
        }
        return cssg;
    }

    computeCssForm() {
        const pixel = {
            px_row: this.form.yini,
            px_row_end: this.form.yfin,
            px_col: this.form.xini,
            px_col_end: this.form.xfin
        };
        this.cssform = this.getcss(pixel);
    }

    getCssForm(cita: any) {
        const pixel = this.getPixelFromCita(cita);
        return {css: this.getcss(pixel), texto: pixel.px_texto};
    }

    buildEmptyPixelsArray() {
        this.citasmatrix = [];
        for (let i = 1; i <= this.filas + 1; i++) {
            const pixelr = [];
            for (let j = 1; j <= this.columnas; j++) {
                pixelr.push(this.getNewPixelEmpty(j, i));
            }
            this.citasmatrix.push(pixelr);
        }
    }

    getCeldasMenores(pxref) {
        const xref = pxref.x;
        const yref = pxref.y;

        // Solo pude seleccionar las celdas en la direccion y
        this.pixelsselected = [];
        if (this.xini === xref) {
            let ystart = this.yini;
            let yend = yref;
            if (yref < this.yini) {
                ystart = yref;
                yend = this.yini;
            }

            this.form.xfin = pxref.x;
            this.form.yfin = pxref.y;

            this.citasmatrix.forEach(row => {
                row.forEach(pxit => {
                    pxit.cssclass = [...pxit.startcss];
                    if ((pxit.y >= ystart && pxit.y <= yend) && (pxit.x === this.xini)) {
                        this.pixelsselected.push(pxit);
                    } else {
                        if (pxit.lock > 0) {
                            pxit.lock = 0;
                        }
                    }
                });
            });
        }

        let hascomprado = false;
        this.pixelsselected.forEach(pxSelIt => {
            pxSelIt.cssclass.push('marcado');
            if (pxSelIt.comprado === 1) {
                hascomprado = true;
            }
        });
        if (hascomprado) {
            this.pixelsselected.forEach(pxSelIt => {
                pxSelIt.cssclass.push('marcadoerror');
            });
        }
    }


    mousedown($event: MouseEvent, px: any) {
        this.clicstart = true;
        this.clicfinish = false;
        this.pixelsselected = [];
        this.xini = px.x;
        this.yini = px.y;
        this.form.xini = this.xini;
        this.form.yini = this.yini;
        this.form.pxini = px;
    }

    onMouseOver($event: MouseEvent, px: any) {
        if (this.clicstart) {
            this.getCeldasMenores(px);
        }
    }

    initFormEv() {
        this._auxIniFormEv();
        this.form.ct_fechaobj = this.form.pxfin.dia.fecha;
        this.form.ct_hora = this.form.pxini.hora;
        this.form.ct_hora_fin = (this.form.pxfin.hora + this.intervalo);
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
        this.form.ct_fechaobj = this.fechasService.parseString(this.datosCita.ct_fecha);
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

    mouseup($event: MouseEvent, px: any) {
        if (this.clicstart) {
            this.clicfinish = true;
            this.clicstart = false;
            this.xini = 0;
            this.yini = 0;
            this.form.xfin = px.x;
            this.form.yfin = px.y;
            let haserror = false;
            this.citasmatrix.forEach(row => {
                row.forEach(pxit => {
                    if (pxit.cssclass.includes('marcado')) {
                        pxit.lock = this.bloque;
                    } else if (pxit.cssclass.includes('marcadoerror')) {
                        pxit.lock = 0;
                        pxit.cssclass = '';
                        haserror = true;
                    }
                });
            });
            this.bloque = this.bloque + 1;
            this.computeCssForm();
            if (!haserror) {
                this.form.pxfin = px;
                this.initFormEv();
                this.showModalCrea = true;
            }
        }
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

    mustLoadNewWeek(date: Date) {
        return !this.fechasService.dateInSameWeek(date, this.selectedDate);
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
        const loadWeek = this.mustLoadNewWeek(dayCal.fecha);
        this.clearCssMonthCalc();
        dayCal.css = ['smDiaCalSel'];
        this.changeSelectedDate(dayCal.fecha, dayCal.sm);
        if (loadWeek) {
            this.loadDias();
        } else {
            this.updateEstiloDia();
        }
    }

    clearCitasMatrix() {
        this.citasmatrix.forEach(row => {
            row.forEach(pxit => {
                pxit.cssclass = [...pxit.startcss];
            });
        });
    }

    clearCssMonthCalc() {
        this.mesArray.forEach(row => {
            row.forEach(dc => {
                dc.css = '';
            });
        });
        this.dias.forEach(d => {
            d.css = '';
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

    hoy() {
        const fechaActual = this.fechasService.getCurrentDate();
        const loadWeek = this.mustLoadNewWeek(fechaActual);
        const sameMonth = this.auxIsSameMonth(fechaActual);
        if (sameMonth) {
            this.clearCssMonthCalc();
        }
        this.changeSelectedDate(fechaActual, sameMonth);
        if (loadWeek) {
            this.loadDias();
        } else {
            this.updateEstiloDia();
        }
    }

    hoyplusdays(ndays) {
        const fechaActual = this.fechasService.getCurrentDate();
        const fechaIter = this.fechasService.sumarDias(fechaActual, ndays);
        const loadWeek = this.mustLoadNewWeek(fechaIter);
        const sameMonth = this.auxIsSameMonth(fechaIter);
        if (sameMonth) {
            this.clearCssMonthCalc();
        }
        this.changeSelectedDate(fechaIter, sameMonth);
        if (loadWeek) {
            this.loadDias();
        } else {
            this.updateEstiloDia();
        }
    }

    closeModalNewEv() {
        this.pixelsselected = [];
        this.clicfinish = false;
        this.clicstart = false;
        this.cssform = {};
        this.form = {};
        this.showModalCrea = false;
        this.clearCitasMatrix();
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
        this.tcitaService.guardar(this.form).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.loadCitas();
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

    loadCitas() {
        const first = this.citasmatrix[0];
        const firstcol = first[0];
        const endcol = first[first.length - 1];
        this.loadinUiServ.publishBlockMessage();
        this.tcitaService.listar(this.fechasService.formatDate(firstcol.dia.fecha),
            this.fechasService.formatDate(endcol.dia.fecha), this.tipoCita).subscribe(res => {
            if (res.status === 200) {
                this.citas = res.citas;
                this.citas.forEach(it => {
                    const rescsstxt = this.getCssForm(it);
                    it.css = rescsstxt.css;
                    it.texto = rescsstxt.texto;
                });
                this.loadMesArray();
            }
        });
    }

    onEventClic(tcita) {
        this.loadinUiServ.publishBlockMessage();
        this.tcitaService.getDatosCita(tcita.ct_id).subscribe(res => {
            if (res.status === 200) {
                this.datosCita = res.cita;
                this.showModalDetalles = true;
            }
        });
    }

    selectColor(color: any, ev: any) {
        ev.preventDefault();
        this.form.ct_color = color;
    }

    anularEv() {
        const msg = '¿Seguro que desea anular este evento?';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.tcitaService.anular(this.datosCita.ct_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadCitas();
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

    auxLoadDatosTipCita(dtipcita) {
        this.calHoraIni = dtipcita.tipc_calini;
        this.calHoraFin = dtipcita.tipc_calfin;
        this.filas = (this.calHoraFin - this.calHoraIni) * this.parteshora;
        this.changeSelectedDate(this.fechasService.getCurrentDate(), true);
        this.loadDias();
        this.loadMesArray();
        this.loadMedicos();
    }

    onPersonCitaChange($event: any) {
        if (this.personCitaSel) {
            if (this.personCitaSel !== this.tipoCita) {
                this.tipoCita = this.personCitaSel;
                this.tcitaService.getDatosTipoCita(this.tipoCita).subscribe(res => {
                    if (res.status === 200) {
                        this.auxLoadDatosTipCita(res.dtipcita);
                        this.loadCitas();
                        this.initListasForm();
                    }
                });
            }
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
            this.citasOdontMsgService.publishMessage({
                tipo: 1, paciente: {per_id: this.datosCita.pac_id}
            });
            this.router.navigate(['odonto']);
        }
    }
}
