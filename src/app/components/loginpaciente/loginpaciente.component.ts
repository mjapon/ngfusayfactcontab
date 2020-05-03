import {Component, NgZone, OnInit} from '@angular/core';
import {PacienteService} from "../../services/paciente.service";
import {DomService} from "../../services/dom.service";
import {SwalService} from "../../services/swal.service";
import {Router} from "@angular/router";

declare var $: any;
declare const FB: any;
declare const gapi: any;

@Component({
    selector: 'app-loginpaciente',
    templateUrl: './loginpaciente.component.html',
    styleUrls: ['./loginpaciente.component.css']
})
export class LoginpacienteComponent implements OnInit {

    modo: number;
    paciente: any;
    formLogin: any;
    formRegistro: any;
    completaRegistro: boolean;
    disableBtnCrea: boolean;

    constructor(private pacienteService: PacienteService,
                private swalService: SwalService,
                private domService: DomService,
                private router: Router,
                private ngZone: NgZone) {
    }

    ngOnInit(): void {
        this.modo = 1;
        this.domService.setFocusTimeout('inputEmail', 2000);
        this.formRegistro = {
            provider: 'ningugo',
            nombres: '',
            celular: '',
            email: '',
            clave: '',
            photoUrl: ''
        };
        this.formLogin = {
            email: '',
            password: ''
        };
        this.completaRegistro = false;
        this.disableBtnCrea = false;
    }

    showFormRegistro() {
        this.modo = 2;
        this.domService.setFocusTimeout('inputNombres', 200);
    }

    cancelRegistro() {
        this.modo = 1;
        this.domService.setFocusTimeout('inputEmail', 200);
    }

    darDeAlta() {
        this.disableBtnCrea = true;
        if (this.formRegistro.nombres.trim().length === 0
            || this.formRegistro.celular.trim().length === 0
            || this.formRegistro.email.trim().length === 0
            || this.formRegistro.clave.trim().length === 0) {
            this.swalService.fireToastError('Por favor ingrese todos los datos que se solicitan');
            this.disableBtnCrea = false;
            return;
        }

        if (this.formRegistro.clave.trim().length < 4) {
            this.swalService.fireToastError('La clave ingresada es muy corta');
            this.disableBtnCrea = false;
            return;
        }

        this.pacienteService.crearCuenta(this.formRegistro).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireSuccess('Registrado correctamente');
                this.pacienteService.getDatosUser(this.formRegistro.email).subscribe(resGetData => {
                    if (resGetData.status === 200) {
                        this.swalService.fireToastSuccess('Bienvenido ' + resGetData.datosuser['up_nombres']);
                        this.pacienteService.setAsAuthenticated(resGetData.datosuser, '');
                        this.router.navigate(['citasPaciente']);
                    }
                });
            }
            this.disableBtnCrea = false;
        }, () => {
            this.disableBtnCrea = false;
        });
    }

    doLogin() {
        if (this.formLogin.email.trim() === 0 || this.formLogin.password.trim().length === 0) {
            this.swalService.fireToastError('Debe ingresar su dirección de correo y su clave');
            return;
        }
        this.pacienteService.autenticar(this.formLogin).subscribe(res => {
            if (res.status === 200) {
                if (res.autenticado) {
                    const datosuser = res.datosuser;
                    this.pacienteService.setAsAuthenticated(datosuser, '');
                    this.swalService.fireToastSuccess('Bienvenido');
                    this.router.navigate(['citasPaciente']);
                } else {
                    this.swalService.fireToastError('Usuario o clave incorrectos');
                }
            }
        });
    }

    signInWithFB(): void {
        let self = this;
        FB.login(response => {
            if (response.status === 'connected') {
                self.loadFacebookUserData();
            } else {
                console.log('No estas logueado');
            }
        });
    }

    loadFacebookUserData() {
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
                    nombres: response['name'],
                    photoUrl: response.picture ? response.picture.data.url : '',
                    celular: '',
                    clave: response['id']
                };
                self.pacienteService.getDatosUser(self.paciente.email).subscribe(resExiste => {
                    if (resExiste.status === 200) {
                        if (resExiste.existe) {
                            this.ngZone.run(() => {
                                self.swalService.fireToastSuccess('Bienvenido ' + response['name']);
                                self.pacienteService.setAsAuthenticated(resExiste.datosuser, '');
                                self.router.navigate(['citasPaciente']);
                            });
                        } else {
                            this.ngZone.run(() => {
                                this.completaRegistro = true;
                                self.formRegistro.nombres = self.paciente.nombres;
                                self.formRegistro.celular = '';
                                self.formRegistro.photoUrl = self.paciente.photoUrl;
                                self.formRegistro.provider = self.paciente.provider;
                                self.formRegistro.email = self.paciente.email;
                                self.formRegistro.clave = '';
                                self.modo = 2;
                                self.domService.setFocusTimeout('statiClaveReg', 2000);
                            });
                        }
                    }
                });
            });
    }

    signOut(): void {
        FB.logout(response => {
            console.log('FB.logout response--->');
        });
    }

}
