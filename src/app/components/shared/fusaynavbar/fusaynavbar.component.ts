import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SwalService} from '../../../services/swal.service';
import {Router} from '@angular/router';
import {SeccionService} from "../../../services/seccion.service";

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
                private router: Router) {
        this.initLoginForm();
        $('#modalLogin').on('show.bs.modal', () => {
            console.log('fusaynavbar show.bs.modal------------------>');
            setTimeout(() => {
                console.log('fusaynavbar timeout show.bs.modal---------->');
                $('.auxusername').focus();
            }, 500);
        });
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
    }

    initLoginForm() {
        this.loginForm = this.formBuilder.group({
            empresa: ['', Validators.required],
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
        console.log('logout->');
        this.fautService.clearInfoAuthenticated();
        console.log('infoautenticated terminado--->');
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
                    this.fautService.publishMessage('login');
                    console.log('Userinfo------------>');
                    console.log(res.userinfo);
                    console.log(res.token);
                    console.log(res.menu);
                    this.fautService.setAsAuthenticated(res.userinfo, res.token, res.menu, res.seccion);
                    this.swalService.fireToastSuccess('', 'Bienvenido: ' + res.userinfo.per_nombres);
                    $('#modalLogin').modal('hide');
                    this.router.navigate(['lghome']);

                    this.seccionService.listar().subscribe(ressec => {
                        console.log("Valor de ressecc es:");
                        console.log(ressec);
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
