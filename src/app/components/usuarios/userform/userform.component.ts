import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {CadsUtilService} from '../../../services/cads-util.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {UsertokenService} from '../../../services/usertoken.service';
import {PersonaService} from '../../../services/persona.service';
import {DomService} from '../../../services/dom.service';

@Component({
    selector: 'app-userform',
    templateUrl: './userform.component.html',
    styles: ['.rol-list { height:27rem;overflow: auto }']
})
export class UserformComponent implements OnInit {
    form: any;
    roles: Array<any>;
    secciones: Array<any> = [];
    usId: number;
    formcli: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private fautService: UsertokenService,
                private cadsUtilService: CadsUtilService,
                private domService: DomService,
                private personaService: PersonaService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.usId = 0;
        this.form = {};
        this.formcli = {};
        this.roles = [];
        this.route.paramMap.subscribe(params => {
            this.usId = parseInt(params.get('us_id'), 10);
            this.loadForm();
        });
    }

    buscarPersona() {
        if (this.formcli.per_ciruc && this.formcli.per_ciruc.trim().length > 4) {
            this.loadingUiService.publishBlockMessage();
            this.personaService.buscarPorCi(this.formcli.per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    this.formcli.per_id = res.persona.per_id;
                    this.formcli.per_nombres = res.persona.per_nombres;
                    this.formcli.per_apellidos = res.persona.per_apellidos;
                    this.formcli.per_movil = res.persona.per_movil;
                    this.formcli.per_email = res.persona.per_email;
                } else if (res.status === 404) {
                    this.formcli.per_id = 0;
                    this.formcli.per_nombres = '';
                    this.formcli.per_apellidos = '';
                    this.formcli.per_movil = '';
                    this.formcli.per_email = '';
                }
            });
        }
    }

    loadForm() {
        this.loadingUiService.publishBlockMessage();
        if (this.usId === 0) {
            this.fautService.getFormCrea().subscribe(res => {
                this.form = res.form;
                this.roles = res.form.roles;
                this.formcli = res.formcli;
                this.secciones = res.form.secciones;
                this.domService.setFocusTm('ciPasInput', 800);
            });
        } else {
            this.fautService.getFormEdita(this.usId).subscribe(res => {
                if (res.status === 200) {
                    this.form = res.formedita.form;
                    this.formcli = res.formedita.formcli;
                    this.roles = res.formedita.form.roles;
                    this.secciones = res.formedita.form.secciones;
                }
            });
        }
    }

    setFocus(nomApelInput: string) {
        this.domService.setFocus(nomApelInput);
    }

    selectRol(item: any) {
        item.rl_marca = !item.rl_marca;
    }

    cancelar() {
        this.router.navigate(['usuarios']);
    }

    guardar() {
        const filtrados = this.roles.filter(item => {
            return item.rl_marca;
        });

        const secciones = this.secciones.filter(item => {
            return item.sec_marca;
        });

        if (filtrados.length === 0) {
            this.swalService.fireToastError('Debe seleccionar el o los roles para el usuario');
        } else {

            if (secciones.length === 0) {
                this.swalService.fireToastError('Debe seleccionar la sección o secciones habilitadas para este usuario');
                return;
            } else {
                let existeSecMain = false;
                secciones.forEach(item => {
                    if (item.fus_main) {
                        existeSecMain = true;
                    }
                });
                if (!existeSecMain) {
                    this.swalService.fireToastError('Debe seleccionar la sección principal para este usuario');
                    return;
                }
            }

            this.form.roles = filtrados;
            if (this.usId === 0) {
                this.loadingUiService.publishBlockMessage();
                this.fautService.crearUsuario(this.form, this.formcli).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.router.navigate(['usuarios']);
                    }
                });
            } else {
                this.loadingUiService.publishBlockMessage();
                this.fautService.guardarRoles(this.usId, this.form.roles, this.form.secciones).subscribe(res => {
                    this.swalService.fireToastSuccess(res.msg);
                    if (res.status === 200) {
                        this.router.navigate(['usuarios']);
                    }
                });
            }
        }
    }

    selectSec(item: any) {
        item.sec_marca = !item.sec_marca;
        if (!item.sec_marca) {
            item.fus_main = false;
        }
    }

    handleMainSec(item: any) {
        this.secciones.forEach(el => {
            el.fus_main = false;
        });
        item.fus_main = !item.fus_main;
    }
}
