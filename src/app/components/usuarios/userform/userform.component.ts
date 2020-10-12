import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {CadenasutilService} from '../../../services/cadenasutil.service';
import {UiService} from '../../../services/ui.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {UsertokenService} from '../../../services/usertoken.service';

@Component({
    selector: 'app-userform',
    templateUrl: './userform.component.html',
    styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {
    form: any;
    roles: Array<any>;
    usId: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private fautService: UsertokenService,
                private cadsUtilService: CadenasutilService,
                private uiService: UiService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.usId = 0;
        this.form = {};
        this.roles = [];
        this.route.paramMap.subscribe(params => {
            this.usId = parseInt(params.get('us_id'), 10);
            this.loadForm();
        });
    }


    loadForm() {
        this.loadingUiService.publishBlockMessage();
        if (this.usId === 0) {
            //logica para creacion de nuevo usuario
        } else {
            this.fautService.getFormEdita(this.usId).subscribe(res => {
                if (res.status === 200) {
                    this.form = res.formedita;
                    this.roles = res.formedita.roles;
                    //this.uiService.setFocusById('rlNombre', 500);
                }
            });
        }
    }

    setFocus(nomApelInput: string) {
        this.uiService.setFocusById(nomApelInput);
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
        if (filtrados.length === 0) {
            this.swalService.fireToastError('Debe seleccionar el o los roles para el usuario');
        } else {
            this.form.roles = filtrados;
            this.loadingUiService.publishBlockMessage();
            this.fautService.guardarRoles(this.usId, this.form.roles).subscribe(res => {
                this.swalService.fireToastSuccess(res.msg);
                if (res.status === 200) {
                    this.router.navigate(['usuarios']);
                }
            });
        }

    }

}
