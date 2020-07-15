import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MenuItem} from "primeng";
import {PublicarticuloService} from "../../../services/publicarticulo.service";
import {DomService} from "../../../services/dom.service";
import {PacienteService} from "../../../services/paciente.service";
import {FechasService} from "../../../services/fechas.service";
import {DatePipe} from "@angular/common";
import {SwalService} from "../../../services/swal.service";

@Component({
    selector: 'app-citaspaciente',
    templateUrl: './citaspaciente.component.html',
    styleUrls: ['./citaspaciente.component.css']
})
export class CitaspacienteComponent implements OnInit {
    citaSelected: any;
    citas: Array<any>;
    isShowFormReg: boolean;
    teleservicios: Array<any>;
    matrizHoras: Array<any>;
    filaHoraSelected: any;
    servicioSelected: any;
    diaCita: Date;
    diaCitaTexto: string;
    horaCitaTexto: string;
    upCelular: string;
    es: any;
    minimumDate: Date = new Date();
    paciente: any;
    activeIndex: number;
    steps: MenuItem[];

    constructor(private publicArtService: PublicarticuloService,
                private domService: DomService,
                private pacienteService: PacienteService,
                private fechasService: FechasService,
                private fb: FormBuilder,
                private datepipe: DatePipe,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.clearAll();
        this.steps = [
            {label: 'Datos Personales'},
            {label: 'Fecha y Hora'},
            {label: 'Resumen'}
        ];
        this.citas = [];
        this.teleservicios = [];
        this.es = this.fechasService.getLocaleEsForPrimeCalendar();
        this.publicArtService.listarTeleServicios().subscribe(res => {
            this.teleservicios = res.data;
            this.clearAllSelectedServices();
        });
        let datosPaciente = this.pacienteService.getDatosPacienteLogged();
        this.paciente = datosPaciente;
        this.upCelular = datosPaciente['up_celular'];
        this.loadCitasPaciente();
        this.isShowFormReg = false;
    }

    clearAll() {
        this.isShowFormReg = false;
        this.diaCitaTexto = '';
        this.horaCitaTexto = '';
        this.activeIndex = 0;
        this.diaCita = new Date();
        this.matrizHoras = new Array<any>();
        this.servicioSelected = null;
        this.clearAllSelectedServices();
    }

    loadCitasPaciente() {
        this.pacienteService.listarCitasPaciente(this.paciente.up_email).subscribe(res => {
            if (res.status === 200) {
                this.citas = res.citaspac;
            }
        });
    }

    showResumen() {
        this.activeIndex = 2;
        this.servicioSelected = this.getServicioSelected();
        this.diaCitaTexto = this.getFechaCitaStr();
        let horaIni = this.filaHoraSelected['horaIni'];
        this.horaCitaTexto = horaIni.toString();
    }

    checkService(item: any) {
        item.selected = !item.selected;
        this.teleservicios.forEach(value => {
            if (value !== item) {
                value.selected = false;
            }
        });
    }

    isServiceSelected(): boolean {
        let selected = false;
        this.teleservicios.forEach(servicio => {
            if (servicio.selected) {
                selected = true;
            }
        });
        return selected;
    }

    isHoraSelected(): boolean {
        let selected = false;
        this.matrizHoras.forEach(item => {
            if (item.selected) {
                selected = true;
            }
        });
        return selected;
    }

    clearAllSelectedServices() {
        if (this.teleservicios) {
            this.teleservicios.forEach(value => {
                value.selected = false;
            });
        }
    }

    selectCita(row: any) {

    }

    getServicioSelected() {
        let servSelected: any;
        this.teleservicios.forEach(servicio => {
            if (servicio.selected) {
                servSelected = servicio;
            }
        });
        return servSelected;
    }

    procesaForm() {
        const formvalue: any = this.paciente;
        formvalue.provider = this.paciente.provider;
        let servSelected = this.getServicioSelected();
        formvalue.serv_id = servSelected.ic_id;
        formvalue.med_id = servSelected.med_id;
        let diaCitaParsed = this.datepipe.transform(this.diaCita, 'dd/MM/yyyy');
        formvalue.dia = diaCitaParsed;
        let horaIni = this.filaHoraSelected['horaIni'];
        formvalue.hora_ini = horaIni;
        formvalue.photoUrl = this.paciente.photoUrl;
        formvalue.celular = this.upCelular;
        formvalue.email = this.paciente.up_email;
        this.pacienteService.registrar(formvalue).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireSuccess(res.msg);
                this.clearAll();
                this.loadCitasPaciente();
            }
        });
    }

    getFechaCitaStr() {
        let diaStr = this.datepipe.transform(this.diaCita, 'EEEE', null, 'es-EC');
        let mesStr = this.datepipe.transform(this.diaCita, 'LLLL', null, 'es-EC');
        let dia = this.datepipe.transform(this.diaCita, 'dd');
        let anio = this.datepipe.transform(this.diaCita, 'yyyy');
        let fechaString = diaStr + ' ' + dia + ' de ' + mesStr + ' de ' + anio;
        return fechaString;
    }

    showFormSelectFechaHora() {
        this.activeIndex = 1;
        this.loadMatrizHoras();
    }

    onHoraClick(filaHora: any) {
        let valSelected = !filaHora['selected'];
        this.matrizHoras.forEach(value => {
            value.selected = false;
        });
        filaHora['selected'] = valSelected;
        if (filaHora.selected) {
            this.filaHoraSelected = filaHora;
        } else {
            this.filaHoraSelected = null;
        }
    }

    loadMatrizHoras() {
        let servSelected = this.getServicioSelected();
        let diaCitaParsed = this.datepipe.transform(this.diaCita, 'dd/MM/yyyy');
        let medId = servSelected.med_id;
        this.pacienteService.getMatrizHoras(medId, diaCitaParsed).subscribe(res => {
            if (res.status === 200) {
                this.matrizHoras = res.matriz;
            }
        });
        this.diaCitaTexto = this.getFechaCitaStr();
    }

    retornarAFecha() {
        this.activeIndex = 1;
    }

    retornarADatos() {
        this.activeIndex = 0;
    }

    onEnterMovil($event) {
        //this.procesaForm();
    }

    registraCita() {
        this.procesaForm();
    }

    cancelarRegistroCita() {
        this.clearAll();
    }

    startVideoLlamada() {
        alert('Inicio de video llamada');
    }
}