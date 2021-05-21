import {Component, OnInit} from '@angular/core';
import {LectomedaguaService} from '../../../services/agua/lectomedagua.service';
import {SwalService} from '../../../services/swal.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {DomService} from '../../../services/dom.service';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {LoadingUiService} from '../../../services/loading-ui.service';

@Component({
    selector: 'app-lectomed',
    templateUrl: './lectomed.component.html'
})
export class LectomedComponent implements OnInit {
    isLoading = false;
    form: any = {};
    meses: Array<any> = [];
    anios: Array<any> = [];
    validfl: Array<any> = [];
    datosmedidor: any = null;
    lastlectomed: any = null;

    constructor(private lectomedService: LectomedaguaService,
                private contraguaServ: ContratoaguaService,
                private loadingServ: LoadingUiService,
                private router: Router,
                private domService: DomService,
                private ctes: CtesAguapService,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.isLoading = true;
        this.lectomedService.getForm().subscribe(res => {
            this.isLoading = false;
            this.form = res.form.form;
            this.meses = res.form.meses;
            this.anios = res.form.anios;
            this.validfl = res.form.vfl;
            this.domService.setFocusTm(this.ctes.mdg_num, 100);
        });
    }

    clearForm() {
        this.lectomedService.clearForm(this.form);
    }

    buscarMedidor() {
        this.datosmedidor = null;
        if (this.form.mdg_num.trim().length < 2) {
            this.swalService.fireToastError(this.ctes.msgEnterNumMed);
            return;
        }
        this.loadingServ.publishBlockMessage();
        this.contraguaServ.findByNumMed(this.form.mdg_num).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastInfo(res.msg);
                this.datosmedidor = res.data;
                this.form.mdg_id = this.datosmedidor.mdg_id;
                this.loadLastLectoMed();
            } else {
                this.clearForm();
                this.swalService.fireToastWarn(res.msg);
            }
        });
    }

    loadLastLectoMed() {
        this.lastlectomed = null;
        this.form.lmd_valorant = 0;
        this.lectomedService.getLast(this.form.mdg_num).subscribe(res => {
            if (res.status === 200) {
                this.lastlectomed = res.lectomed;
                this.form.lmd_valorant = this.lastlectomed.lmd_valor;
                this.domService.setFocusTm(this.ctes.lmd_valor, 100);
            } else {
                this.domService.setFocusTm(this.ctes.lmd_valorant, 100);
            }
        });
    }

    doSave() {
        const isValidMed = this.domService.validFormData(this.form, this.validfl);
        if (!isValidMed) {
            return;
        }
        this.swalService.fireDialog(this.ctes.msgConfirmSave, '').then(confirm => {
            if (confirm.value) {
                this.loadingServ.publishBlockMessage();
                this.lectomedService.guardar(this.form).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.gotoMain();
                    }
                });
            }
        });
    }

    calculaConsumo() {
        this.form.lmd_consumo = this.lectomedService.generaConsumo(this.form);
    }

    gotoMain() {
        this.router.navigate([this.ctes.rutaHome]);
    }

    doCancel() {
        this.gotoMain();
    }
}
