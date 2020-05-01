import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticuloService} from '../../services/articulo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PublicarticuloService} from '../../services/publicarticulo.service';
import {DomService} from '../../services/dom.service';

import {PacienteService} from "../../services/paciente.service";
import {SwalService} from "../../services/swal.service";
import {MenuItem} from "primeng/api";
import {DatePipe} from "@angular/common";
import {FechasService} from "../../services/fechas.service";
import {FirebaseauthService} from "../../services/firebaseauth.service";

import {MetadataSocialUser} from 'src/app/model/metadasocialuser';
import {environment} from "../../../environments/environment";

declare var $: any;
declare const FB: any;

@Component({
    selector: 'app-telemedicina',
    templateUrl: './telemedicina.component.html',
    styleUrls: ['./telemedicina.component.css']
})
export class TelemedicinaComponent implements OnInit {
    @ViewChild('loginRef', {static: true}) loginElement: ElementRef;
    @ViewChild('solicitaCitaBtn', {static: true}) creaCitaElement: ElementRef;

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

    auth2: any;

    private paciente: MetadataSocialUser;
    private pacienteLogged: boolean;
    private applicationId: string;

    constructor(private artService: ArticuloService,
                private publicArtService: PublicarticuloService,
                private domService: DomService,
                private pacienteService: PacienteService,
                private fechasService: FechasService,
                private fb: FormBuilder,
                private datepipe: DatePipe,
                private swalService: SwalService,
                public firebaseAuthServ: FirebaseauthService) {
    }

    ngOnInit() {
        this.applicationId = environment.facebookLoginApp;
        this.loadFBSDK();
        this.googleSDK();

        this.clearAll();
        this.steps = [
            {label: 'Datos Personales'},
            {label: 'Fecha y Hora'},
            {label: 'Resumen'}
        ];
        this.es = this.fechasService.getLocaleEsForPrimeCalendar();
        this.publicArtService.listarTeleServicios().subscribe(res => {
            this.teleservicios = res.data;
            this.clearAllSelectedServices();
        });
    }


    loadFBSDK() {
        let self = this;
        (window as any).fbAsyncInit = () => {
            FB.init({
                appId: self.applicationId,
                xfbml: false,
                version: 'v2.9'
            });
            console.log('Se ejecuto FB.init-->');
        };
        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-js-sdk'));
    }


    googleSDK() {
        window['googleSDKLoaded'] = () => {
            window['gapi'].load('auth2', () => {
                this.auth2 = window['gapi'].auth2.getAuthInstance({
                    client_id: environment.googleLoginApp,
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email'
                });
                this.prepareLoginButton();
            });
        }

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));

    }

    prepareLoginButton() {

        this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
            (googleUser) => {
                let profile = googleUser.getBasicProfile();
                this.paciente = {
                    provider: 'google',
                    id: profile.getId(),
                    firstName: '',
                    lastName: '',
                    email: profile.getEmail(),
                    name: profile.getName(),
                    photoUrl: profile.getImageUrl() ? profile.getImageUrl() : ''
                };
                this.pacienteLogged = (this.paciente != null);
                this.afterUserDataLoaded();
            }, (error) => {
                alert(JSON.stringify(error, undefined, 2));
            });
    }

    clearAllSelectedServices() {
        if (this.teleservicios) {
            this.teleservicios.forEach(value => {
                value.selected = false;
            });
        }
    }

    afterUserDataLoaded() {
        setTimeout(() => {
            this.showFormRegistro();
            this.domService.setFocus('celularInput');
            $('#modalLoginPac').modal('hide');
            let element: HTMLElement = document.getElementById('solicitaCitaBtnId') as HTMLElement;
            element.click();
        }, 1000);
    }

    clearAll() {
        this.submited = false;
        this.isShowFormReg = false;
        this.diaCitaTexto = '';
        this.horaCitaTexto = '';
        this.activeIndex = 0;
        this.showMensajeFinal = false;
        this.pacienteLogged = false;
        this.paciente = null;
        this.diaCita = new Date();
        this.matrizHoras = new Array<any>();
        this.servicioSelected = null;
        this.buildEmptyForm();
        this.clearAllSelectedServices();
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
        formvalue.photoUrl = this.paciente.photoUrl;
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
        //this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.closeModal();
    }

    signInWithFB(): void {
        let self = this;
        FB.login(response => {
            console.log('valor de response es:');
            console.log(response);
            if (response.status === 'connected') {
                console.log('Ya estas logueado');
                self.loadFacebookUserData();
            } else {
                // The person is not logged into your webpage or we are unable to tell.
                console.log('No estas logueado');
            }
        });

        this.closeModal();
    }

    loadFacebookUserData() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
        console.log('Welcome!  Fetching your information.... ');
        let self = this;
        FB.api(
            '/me',
            'GET',
            {"fields": "id,name,email, birthday,picture, gender, last_name, first_name, hometown "},
            response => {
                self.paciente = {
                    provider: 'facebook',
                    id: response['id'],
                    firstName: response['first_name'],
                    lastName: response['last_name'],
                    email: response['email'],
                    name: response['name'],
                    photoUrl: response.picture ? response.picture.data.url : ''
                };
                self.pacienteLogged = (self.paciente != null);
                self.afterUserDataLoaded();
            });
    }

    signOut(): void {
        FB.logout(response => {
            // user is now logged out
            console.log('FB.logout response--->');
        });
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
