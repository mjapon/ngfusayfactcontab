import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {RolService} from '../../../../services/rol.service';
import {UiService} from '../../../../services/ui.service';
import {CadenasutilService} from '../../../../services/cadenasutil.service';

@Component({
    selector: 'app-rolesform',
    templateUrl: './rolesform.component.html',
    styleUrls: ['./rolesform.component.css']
})
export class RolesformComponent implements OnInit {
    form: any;
    permisos: Array<any>;
    rolId: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private rolesService: RolService,
                private cadsUtilService: CadenasutilService,
                private uiService: UiService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.rolId = 0;
        this.form = {};
        this.permisos = [];
        this.route.paramMap.subscribe(params => {
            this.rolId = parseInt(params.get('rl_id'), 10);
            this.loadForm();
        });
    }

    cancelar() {
        this.router.navigate(['roles']);
    }

    loadForm() {
        this.loadingUiService.publishBlockMessage();
        if (this.rolId === 0) {
            this.rolesService.getFormCrear().subscribe(res => {
                if (res.status === 200) {
                    this.form = res.form;
                    this.permisos = res.permisos;
                    this.uiService.setFocusById('rlNombre', 500);
                }
            });
        } else {
            this.rolesService.getFormEditar(this.rolId).subscribe(res => {
                if (res.status === 200) {
                    this.form = res.form;
                    this.permisos = res.form.permisos;
                    this.uiService.setFocusById('rlNombre', 500);
                }
            });
        }
    }

    setFocus(nomApelInput: string) {
        this.uiService.setFocusById(nomApelInput);
    }

    selectPermiso(item: any) {
        item.rl_marca = !item.rl_marca;
    }

    guardar() {
        if (!this.cadsUtilService.esNoNuloNoVacio(this.form.rl_name)) {
            this.swalService.fireToastError('Por favor ingrese el nombre');
        } else if (!this.cadsUtilService.esNoNuloNoVacio(this.form.rl_abreviacion)) {
            this.swalService.fireToastError('Por favor ingrese la abreviación');
        } else {
            const filtrados = this.permisos.filter(item => {
                return item.rl_marca;
            });
            if (filtrados.length === 0) {
                this.swalService.fireToastError('Debe seleccionar los permisos para el rol');
            } else {
                this.form.permisos = filtrados;
                this.loadingUiService.publishBlockMessage();
                this.rolesService.crear(this.form).subscribe(res => {
                    this.swalService.fireToastSuccess(res.msg);
                    if (res.status === 200) {
                        this.router.navigate(['roles']);
                    }
                });
            }
        }
    }
}
