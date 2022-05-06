import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DomService } from "src/app/services/dom.service";
import { FinanCuentasService } from "src/app/services/finan/finacuentas.service";
import { PersonaService } from "src/app/services/persona.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../../shared/base.component";

@Component({
    selector: 'app-finan-form',
    templateUrl: './financuentas.component.html',
})
export class FinanCuentasComponent extends BaseComponent implements OnInit {

    form: any = {};
    referente: any = {};
    formautoref: any = {};
    tiposcuentas: Array<any> = [];
    tipoctasel: any = {};

    constructor(
        private personService: PersonaService,
        private domService: DomService,
        private swalService: SwalService,
        private router: Router,
        private cuentaService: FinanCuentasService,
    ) {
        super();
    }

    ngOnInit() {
        this.loadForm();
        this.domService.setFocusTm('per_ciruc');
    }

    ontipoctasel(event: any) {
        this.form.tc_id = this.tipoctasel.tc_id;
    }

    loadForm() {
        this.cuentaService.getForm(0).subscribe(res => {
            if (this.isResultOk(res)) {
                console.log('Valor de res:', res);
                this.form = res.form.form;
                this.tiposcuentas = res.form.tiposcuenta;
                this.tipoctasel = this.tiposcuentas[0];
            }
        });
    }

    onRefSelect() {
        if (this.formautoref.referente && this.formautoref.referente.per_ciruc) {
            this.form.per_ciruc = this.formautoref.referente.per_ciruc;
            this.buscarReferente();
        }
    }

    onEnterRef($ev) {

    }

    onClearRef() {
        console.log('on clear ref-->');
        this.ngOnInit();
        this.referente = {};
    }


    buscarReferente() {
        this.referente = {};
        const msg = 'No existe referente';
        this.personService.buscarPorCi(this.form.per_ciruc).subscribe(res => {
            if (this.isResultOk(res)) {
                this.cuentaService.existeCtaAhorro(res.persona.per_id).subscribe(res1 => {
                    if (res1.has_cuenta) {
                        this.swalService.fireWarning('Ya tiene una cuenta apertura este socio')
                    }
                    else {
                        this.referente = res.persona;
                        this.form.per_id = this.referente.per_id;
                    }
                });
            }
            else {
                this.swalService.fireError(msg);
            }
        });
    }


    guardar() {
        const msg = "¿Confirma que desea aperturar la cuenta?"
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.cuentaService.crear(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireSuccess(res.msg);
                        this.gotoHome();
                    }
                });
            }
        })
    }

    gotoHome() {
        this.router.navigate(['lghome']);
    }

    cancelar() {
        this.gotoHome();
    }

}