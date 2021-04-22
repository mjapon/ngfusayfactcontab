import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SwalService} from '../../services/swal.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {FautService} from '../../services/faut.service';
import {SeccionService} from '../../services/seccion.service';
import {UsertokenService} from '../../services/usertoken.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {DomService} from '../../services/dom.service';
import {TtpdvService} from '../../services/ttpdv.service';

@Component({
    selector: 'app-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    submited: boolean;
    secciones: Array<any>;

    constructor(
        private fb: FormBuilder,
        private fautService: FautService,
        private swalService: SwalService,
        private router: Router,
        private localStorageService: LocalStorageService,
        private seccionService: SeccionService,
        private ttpdvService: TtpdvService,
        private domService: DomService,
        private userTokenService: UsertokenService,
        private loadingServ: LoadingUiService
    ) {

    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnInit() {
        this.createForm();
        this.verificarLogueado();
    }

    verificarLogueado() {
        if (this.fautService.isAuthenticated()) {
            this.router.navigate(['lghome']);
        }
    }

    createForm() {
        const globalCodEmpresa = this.localStorageService.getItem('GLOBAL_COD_EMPRESA');
        let codEmpresa = '';
        let codFocus = 'empresaInput';
        if (globalCodEmpresa) {
            codEmpresa = globalCodEmpresa;
            codFocus = 'usernameInput';
        }
        this.loginForm = this.fb.group({
            empresa: [codEmpresa, Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.domService.setFocusTimeout(codFocus, 1500);
    }

    onclickSubmit() {
        this.submited = true;
        if (this.loginForm.invalid) {
            return;
        }


        const form = this.loginForm.value;
        this.loadingServ.publishBlockMessage();
        this.fautService.autenticar(form.empresa, form.username, form.password).subscribe(
            res => {
                if (res.autenticado) {
                    this.localStorageService.setItem('GLOBAL_COD_EMPRESA', form.empresa);
                    this.fautService.publishMessage('login');
                    this.fautService.setAsAuthenticated(res.userinfo, res.token, res.menu, res.seccion,
                        res.empNombreComercial, res.sqm, res.tdv_codigo);
                    this.swalService.fireToastSuccess('', 'Bienvenido: ' + res.userinfo.per_nombres);
                    this.router.navigate(['lghome']);
                    this.seccionService.listar().subscribe(ressec => {
                        if (ressec.status === 200) {
                            this.secciones = ressec.items;
                            this.fautService.setSecciones(this.secciones);
                            this.fautService.publishMessage('updateSecciones');
                        }
                    });
                    this.ttpdvService.listarMin().subscribe(restpdv => {
                        if (restpdv.status === 200) {
                            this.fautService.setTtpdvs(restpdv.ttpdvs);
                            this.fautService.publishMessage('updateTtpdvs');
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
}
