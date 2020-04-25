import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../services/articulo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PublicarticuloService} from '../../services/publicarticulo.service';
import {DomService} from '../../services/dom.service';

import {AuthService, SocialUser} from 'angularx-social-login';
import {FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';

@Component({
    selector: 'app-telemedicina',
    templateUrl: './telemedicina.component.html',
    styleUrls: ['./telemedicina.component.css']
})
export class TelemedicinaComponent implements OnInit {

    isShowFormReg: boolean;
    teleservicios: Array<any>;
    pacienteForm: FormGroup;
    numbersPattern: string = '^[0-9]*\\.*[0-9]*$';
    emailPatteern: string = '';
    submited: boolean;

    private user: SocialUser;
    private loggedIn: boolean;

    constructor(private artService: ArticuloService,
                private publicArtService: PublicarticuloService,
                private domService: DomService,
                private fb: FormBuilder,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.submited = false;
        this.isShowFormReg = false;
        this.teleservicios = new Array<any>();
        this.buildForm();

        let prom = this.publicArtService.listarTeleServicios();
        prom.subscribe(res => {
            this.teleservicios = res.data.data;
            this.teleservicios.forEach(value => {
                value.selected = false;
            });
            console.log('Valor de servicios es:');
            console.log(this.teleservicios);

        });

        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);

            console.log('Authservice subscribed:');
            console.log(this.user);
            console.log(this.loggedIn);
        });

    }

    get f() {
        return this.pacienteForm.controls;
    }

    buildForm() {
        this.pacienteForm = this.fb.group({
            nombres: ['', Validators.required],
            email: ['', Validators.required],
            celular: ['', Validators.required]
            /*edad: ['', Validators.required]**/
        });
    }

    getFormPersona() {

    }

    showFormRegistro() {
        this.buildForm();
        this.isShowFormReg = true;
    }

    checkService(item: any) {
        item.selected = !item.selected;
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

    procesaForm() {

        alert('Registrarme');
    }

    onEnterNombres($event) {
        console.log('onEnternombres');
        this.domService.setFocus('emailInput');
    }

    onEnterEmail($event) {
        this.domService.setFocus('celularInput');
    }

    onEnterMovil($event) {
        this.procesaForm();
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    signOut(): void {
        this.authService.signOut();
    }

}
