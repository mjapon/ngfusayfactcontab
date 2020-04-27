import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../services/articulo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PublicarticuloService} from '../../services/publicarticulo.service';
import {DomService} from '../../services/dom.service';

import {AuthService, SocialUser} from 'angularx-social-login';
import {FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import {PacienteService} from "../../services/paciente.service";
import {SwalService} from "../../services/swal.service";
import {MenuItem} from "primeng/api";
import {DatePipe} from "@angular/common";
import {FechasService} from "../../services/fechas.service";

declare var $: any;

@Component({
    selector: 'app-telemedicina',
    templateUrl: './telemedicina.component.html',
    styleUrls: ['./telemedicina.component.css']
})
export class TelemedicinaComponent implements OnInit {

    isShowFormReg: boolean;
    teleservicios: Array<any>;
    matrizHoras: Array<any>;
    filaHoraSelected: any;
    pacienteForm: FormGroup;
    numbersPattern: string = '^[0-9]*\\.*[0-9]*$';
    emailPatteern: string = '';
    submited: boolean;
    servicioSelected: any;
    diaCita: Date;
    diaCitaTexto: string;
    horaCitaTexto: string;
    showMensajeFinal: boolean;
    es: any;
    minimumDate: Date = new Date();

    activeIndex: number;

    steps: MenuItem[];

    private paciente: SocialUser;
    private pacienteLogged: boolean;

    constructor(private artService: ArticuloService,
                private publicArtService: PublicarticuloService,
                private domService: DomService,
                private pacienteService: PacienteService,
                private fechasService: FechasService,
                private fb: FormBuilder,
                private datepipe: DatePipe,
                private swalService: SwalService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.clearAll();
        this.steps = [
            {label: 'Datos Personales'},
            {label: 'Fecha y Hora'},
            {label: 'Resumen'}
        ];
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };

        let prom = this.publicArtService.listarTeleServicios();
        prom.subscribe(res => {
            this.teleservicios = res.data;
            this.teleservicios.forEach(value => {
                value.selected = false;
            });
        });
        this.authService.authState.subscribe((user) => {
            this.paciente = user;
            this.pacienteLogged = (user != null);
            if (this.pacienteLogged) {
                $('#modalLoginPac').modal('hide');
                setTimeout(() => {
                    this.showFormRegistro();
                    this.domService.setFocus('celularInput');
                }, 1000);
            }
        });
    }

    clearAll() {
        this.submited = false;
        this.isShowFormReg = false;
        this.diaCitaTexto = '';
        this.horaCitaTexto = '';
        this.activeIndex = 0;
        this.showMensajeFinal = false;
        this.pacienteLogged = false;
        this.diaCita = new Date();
        this.matrizHoras = new Array<any>();
        this.servicioSelected = null;
        this.buildEmptyForm();
    }

    get f() {
        return this.pacienteForm.controls;
    }

    buildEmptyForm() {
        this.pacienteForm = this.fb.group({
            nombres: ['', Validators.required],
            email: ['', Validators.required],
            celular: ['', Validators.required]
            /*edad: ['', Validators.required]**/
        });
    }

    buildForm() {
        this.pacienteForm = this.fb.group({
            nombres: [this.paciente.name, Validators.required],
            email: [this.paciente.email, Validators.required],
            celular: ['', Validators.required]
            /*edad: ['', Validators.required]**/
        });
    }

    showModalLogin() {
        console.log('Valor de pacienteLogged');
        console.log(this.pacienteLogged);
        if (this.pacienteLogged) {
            this.showFormRegistro();
        } else {
            $('#modalLoginPac').modal('show');
        }
    }

    showFormRegistro() {
        this.buildForm();
        this.isShowFormReg = true;
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

    getServicioSelected() {
        let servSelected: any;
        this.teleservicios.forEach(servicio => {
            if (servicio.selected) {
                servSelected = servicio;
            }
        });
        return servSelected;
    }

    showFormSelectFechaHora() {
        this.activeIndex = 1;
        this.loadMatrizHoras();
    }

    getFechaCitaStr() {
        let diaStr = this.datepipe.transform(this.diaCita, 'EEEE', null, 'es-EC');
        let mesStr = this.datepipe.transform(this.diaCita, 'LLLL', null, 'es-EC');

        let dia = this.datepipe.transform(this.diaCita, 'dd');
        let anio = this.datepipe.transform(this.diaCita, 'yyyy');
        let fechaString = diaStr + ' ' + dia + ' de ' + mesStr + ' de ' + anio;
        return fechaString;
    }

    showResumen() {
        this.activeIndex = 2;
        this.servicioSelected = this.getServicioSelected();
        this.diaCitaTexto = this.getFechaCitaStr();
        let horaIni = this.filaHoraSelected['horaIni'];
        this.horaCitaTexto = horaIni.toString();
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

    procesaForm() {
        const formvalue: any = this.pacienteForm.getRawValue();
        formvalue.provider = this.paciente.provider;
        let servSelected = this.getServicioSelected();
        formvalue.serv_id = servSelected.ic_id;
        formvalue.med_id = servSelected.med_id;
        let diaCitaParsed = this.datepipe.transform(this.diaCita, 'dd/MM/yyyy');
        formvalue.dia = diaCitaParsed;
        let horaIni = this.filaHoraSelected['horaIni'];
        formvalue.hora_ini = horaIni;
        this.pacienteService.registrar(formvalue).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.signOut();
                this.clearAll();
                this.showMensajeFinal = true;
            }
        });
    }

    onEnterNombres($event) {
        console.log('onEnternombres');
        this.domService.setFocus('emailInput');
    }

    retornarAFecha() {
        this.activeIndex = 1;
    }

    retornarADatos() {
        this.activeIndex = 0;
    }

    onEnterEmail($event) {
        this.domService.setFocus('celularInput');
    }

    onEnterMovil($event) {
        //this.procesaForm();
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.closeModal();
    }

    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.closeModal();
    }

    signOut(): void {
        this.authService.signOut();
    }

    closeModal() {
        $('#modalLoginPac').modal('hide');
    }

    cancelarLogin() {
        this.closeModal();
    }

    registraCita() {
        this.procesaForm();
    }

    cancelarRegistroCita() {
        this.signOut();
        this.clearAll();
    }

    cerrarNotificacion() {
        this.showMensajeFinal = false;
    }
}
