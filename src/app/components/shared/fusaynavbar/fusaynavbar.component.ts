import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SwalService} from '../../../services/swal.service';
import {Router} from '@angular/router';
import {SeccionService} from "../../../services/seccion.service";
import {LocalStorageService} from "../../../services/local-storage.service";

declare var $: any;

@Component({
    selector: 'app-fusaynavbar',
    templateUrl: './fusaynavbar.component.html',
    styleUrls: ['./fusaynavbar.component.css']
})
export class FusaynavbarComponent implements OnInit {

    isLogged: boolean;
    loginForm: FormGroup;
    submited: boolean;
    secciones: Array<any>;

    constructor(private fautService: FautService,
                private formBuilder: FormBuilder,
                private swalService: SwalService,
                private seccionService: SeccionService,
                private localStorageService: LocalStorageService,
                private router: Router) {
        this.initLoginForm();
    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnInit() {
        this.isLogged = this.fautService.isAuthenticated();
        this.submited = false;
        this.fautService.source.subscribe(msg => {
            if (msg === 'logout') {
                this.isLogged = false;
            } else if (msg === 'login') {
                this.isLogged = true;
            }
        });

        $('#modalLogin').on('show.bs.modal', () => {
            setTimeout(() => {
                $('.auxusername').focus();
            }, 500);
        });
    }

    initLoginForm() {
        //Verificar si existe registrado en el localstorage elcodigo de la emrpesa
        let globalCodEmpresa = this.localStorageService.getItem('GLOBAL_COD_EMPRESA');
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
        $('#modalLogin').modal();
    }

    logout() {
        this.fautService.clearInfoAuthenticated();
        this.fautService.publishMessage('logout');
    }

    showModalSeccion() {
        $('#modalSeccion').modal('show');
    }

    submitLogin() {
        this.submited = true;
        if (this.loginForm.invalid) {
            return;
        }

        const form = this.loginForm.value;
        this.fautService.autenticar(form['empresa'], form['username'], form['password']).subscribe(
            res => {
                if (res.autenticado) {
                    this.localStorageService.setItem('GLOBAL_COD_EMPRESA', form['empresa']);
                    this.fautService.publishMessage('login');
                    this.fautService.setAsAuthenticated(res.userinfo, res.token, res.menu, res.seccion);
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
                } else {
                    this.swalService.fireWarning('Usuario o clave incorrectos');
                }
            }
        );
    }

    cancelarLogin() {
        $('#modalLogin').modal('hide');
    }
}
