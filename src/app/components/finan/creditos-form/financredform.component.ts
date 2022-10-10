import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { throwIfEmpty } from "rxjs/operators";
import { DomService } from "src/app/services/dom.service";
import { FechasService } from "src/app/services/fechas.service";
import { FinanCreditosService } from "src/app/services/finan/finacreditos.service";
import { FinanCuentasService } from "src/app/services/finan/finacuentas.service";
import { PersonaService } from "src/app/services/persona.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../../shared/base.component";
import { CtesFinanService } from "../ctesfina.service";

@Component({
    selector: 'app-financredform',
    templateUrl: './financredform.component.html'
})
export class FinanCredFormComponent extends BaseComponent implements OnInit {
    form: any = {};
    referente: any = {};
    productos: Array<any> = [];
    prodsel: any = {};
    datostabla: any = {};
    isLoadingTabla = false;
    datoscuenta: any = {};
    formautoref: any = {};
    cuentaok = false;

    constructor(private credSerice: FinanCreditosService,
        private ctesFinanServ: CtesFinanService,
        private personService: PersonaService,
        private domService: DomService,
        private swalService: SwalService,
        private fechasService: FechasService,
        private cuentasService: FinanCuentasService,
        private router: Router) {
        super();
    }

    ngOnInit() {
        this.cuentaok = false;
        this.loadForm();
    }

    loadDatosCuenta() {
        this.datoscuenta = {};
        this.cuentaok = false;
        this.cuentasService.getDatosCuenta(this.form.per_id, 1).subscribe(res => {
            if (this.isResultOk(res)) {
                if (res.existe) {
                    this.datoscuenta = res.datoscuenta;
                    this.cuentaok = true;
                }
                else {
                    this.swalService.fireError('No tiene una cuenta aperturada, verifique')
                    this.datoscuenta = {};
                }
            }
        });
    }

    onprodchange(event: any) {
        this.form.cre_prod = this.prodsel.prod_id;
        this.form.cre_tasa = this.prodsel.prod_tasa;
    }

    buscarReferente() {
        this.referente = {};
        const msg = 'No existe referente';
        this.personService.buscarPorCi(this.form.per_ciruc).subscribe(res => {
            if (this.isResultOk(res)) {
                this.referente = res.persona;
                this.form.per_id = this.referente.per_id;
                this.domService.setFocusTm('cre_monto');

                this.loadDatosCuenta();
            }
            else {
                this.swalService.fireError(msg);
            }
        });
    }

    generaCuotas() {
        this.isLoadingTabla = true;
        this.setFechaPrestamo();
        if (this.form.cre_monto > 0) {
            this.credSerice.calculaTablaMor(this.form).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.datostabla = res.tabla;
                }
                this.isLoadingTabla = false;
            });
        }
        else {
            this.swalService.fireWarning('Ingrese el monto del crédito');
        }
    }

    loadForm() {
        this.credSerice.getForm().subscribe(res => {
            if (this.isResultOk(res)) {
                this.form = res.form.form;
                this.productos = res.form.productos;
                this.prodsel = this.productos[0];
                this.form.fecprestamo = this.fechasService.parseString(this.form.cre_fecprestamo);
                this.domService.setFocusTm('refAutoCom',300);
            }
        });
    }

    setFechaPrestamo() {
        this.form.cre_fecprestamo = this.fechasService.formatDate(this.form.fecprestamo);
    }
    guardar() {
        this.form.cre_prod = this.prodsel.prod_id;
        this.setFechaPrestamo();
        const msg = "¿Confirma que desea registrar la solicitud de crédito?"
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.credSerice.crearSolicutdCred(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireSuccess(res.msg);
                        this.gotoHome();
                        this.router.navigate([this.ctesFinanServ.rutaDetCredSm, res.codcred]);
                    }
                });
            }
        })
    }

    setYear(year) {
        this.form.cre_plazo = year * 12;
        this.generaCuotas();
    }

    gotoHome() {
        this.router.navigate([this.ctesFinanServ.rutaHome]);
    }

    cancelar() {
        this.gotoHome();
    }

    onEnterRef($ev) {

    }

    onRefSelect() {
        if (this.formautoref.referente && this.formautoref.referente.per_ciruc) {
            this.form.per_ciruc = this.formautoref.referente.per_ciruc;
            this.buscarReferente();
        }
    }

    onClearRef() {
        this.ngOnInit();
        this.referente = {};
        this.datoscuenta = {};
    }

}