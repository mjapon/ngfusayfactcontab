import {Component, OnDestroy, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SwalService} from '../../../services/swal.service';
import {Router} from '@angular/router';
import {SeccionService} from '../../../services/seccion.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {PacienteService} from '../../../services/paciente.service';
import {Subscription} from 'rxjs';
import {UsertokenService} from '../../../services/usertoken.service';

declare var $: any;
declare const FB: any;

@Component({
    selector: 'app-fusaynavbar',
    templateUrl: './fusaynavbar.component.html',
    styleUrls: ['./fusaynavbar.component.css']
})
export class FusaynavbarComponent implements OnInit, OnDestroy {
    isLogged: boolean;
    loginForm: FormGroup;
    submited: boolean;
    secciones: Array<any>;
    isPacienteLogged: boolean;
    subscription: Subscription;

    constructor(private fautService: FautService,
                private formBuilder: FormBuilder,
                private swalService: SwalService,
                private seccionService: SeccionService,
                private localStorageService: LocalStorageService,
                private userTokenService: UsertokenService,
                private pacienteService: PacienteService,
                private router: Router) {
        this.initLoginForm();
    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnInit() {
        this.isLogged = this.fautService.isAuthenticated();
        this.submited = false;
        this.isPacienteLogged = this.pacienteService.isAuthenticated();
        this.fautService.source.subscribe(msg => {
            if (msg === 'logout') {
                this.isLogged = false;
            } else if (msg === 'login') {
                this.isLogged = true;
            }
        });

        this.subscription = this.pacienteService.source.subscribe(msg => {
            if (msg === 'login') {
                this.isPacienteLogged = true;
            } else if (msg === 'logout') {
                this.isPacienteLogged = false;
            }
        });

        $('#modalLogin').on('show.bs.modal', () => {
            setTimeout(() => {
                $('.auxusername').focus();
            }, 500);
        });
    }

    initLoginForm() {
        const globalCodEmpresa = this.localStorageService.getItem('GLOBAL_COD_EMPRESA');
        let codEmpresa = '';
        if (globalCodEmpresa) {
            codEmpresa = globalCodEmpresa;
        }

        this.loginForm = this.formBuilder.group({
            empresa: [codEmpresa, Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    showModalLogin() {
        this.submited = false;
        this.initLoginForm();
        this.router.navigate(['login']);
    }

    logout() {
        this.fautService.clearInfoAuthenticated();
        this.fautService.publishMessage('logout');
    }

    showModalSeccion() {
        $('#modalSeccion').modal('show');
    }

    logoutPaciente() {
        this.pacienteService.clearDatosPacienteLogged();
        FB.logout(response => {
            console.log('FB.logout response--->');
        });
        this.router.navigate(['home']);
    }

    submitLogin() {
        this.submited = true;
        if (this.loginForm.invalid) {
            return;
        }

        const form = this.loginForm.value;
        this.fautService.autenticar(form.empresa, form.username, form.password).subscribe(
            res => {
                if (res.autenticado) {
                    this.localStorageService.setItem('GLOBAL_COD_EMPRESA', form.empresa);
                    this.fautService.publishMessage('login');
                    this.fautService.setAsAuthenticated(res.userinfo, res.token, res.menu, res.seccion, res.empNombreComercial);
                    this.swalService.fireToastSuccess('', 'Bienvenido: ' + res.userinfo.per_nombres);
                    $('#modalLogin').modal('hide');
                    this.router.navigate(['lghome']);
                    this.seccionService.listar().subscribe(ressec => {
                        if (ressec.status === 200) {
                            this.secciones = ressec.items;
                            this.fautService.setSecciones(this.secciones);
                            this.fautService.publishMessage('updateSecciones');
                        }
                    });
                    this.userTokenService.getMenu(res.userinfo.us_id).subscribe(resMenu => {
                        if (resMenu.status === 200) {
                            this.fautService.setMenuApp(resMenu.menu);
                            this.fautService.publishMessage('loadmenu');
                        }
                    });
                } else {
                    this.swalService.fireWarning('Usuario o clave incorrectos');
                }
            }
        );
    }

    cancelarLogin() {
        $('#modalLogin').modal('hide');
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}