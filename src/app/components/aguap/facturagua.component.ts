import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CobroaguaService } from "src/app/services/agua/cobroagua.service";
import { ContratoaguaService } from "src/app/services/agua/contratoagua.service";
import { AsientoService } from "src/app/services/asiento.service";
import { LoadingUiService } from "src/app/services/loading-ui.service";
import { PersonaService } from "src/app/services/persona.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../shared/base.component";
import { CtesAguapService } from "./utils/ctes-aguap.service";

@Component({
    selector: 'app-facturagua',
    templateUrl: './facturagua.component.html'
})
export class FacturaguaComponent extends BaseComponent implements OnInit, OnChanges {

    @Input() lectoids: Array<any> = [];
    @Input() codmed: number = 0;

    datosmedidor: any = null
    referente: any = null;
    montos: any = {};
    initotal: number = 0;
    inimulta: number = 0;

    form: any = {
        montos: { formcab: { secuencia: 0 } }
    };

    @Output() evSaved = new EventEmitter<any>();
    @Output() evCancel = new EventEmitter<any>();

    constructor(private swalService: SwalService,
        private contraguaServ: ContratoaguaService,
        private loadingServ: LoadingUiService,
        private asientoService: AsientoService,
        private personaService: PersonaService,
        private ctes: CtesAguapService,
        private cobroAguaServ: CobroaguaService) {
        super();
    }

    loadForm() {
        this.isLoading = true;
        this.cobroAguaServ.getForm().subscribe(res => {
            this.isLoading = false;
            this.form = res.form.form;
            this.form.montos.formcab = {};
        });
    }

    ngOnInit() {
        this.form.montos.formcab.secuencia = 0;
        this.loadForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change = changes.lectoids;
        const changeCodmed = changes.codmed;
        if (change && change.currentValue) {
            console.log('Valor de lecto id es:', change.currentValue);

            this.calcularPago();
        }

        if (changeCodmed && changeCodmed.currentValue) {
            this.loadDatosMedidor();
        }
    }

    calcularPago() {
        if (this.lectoids.length > 0) {
            this.form.lecturas = this.lectoids;
            this.montos = {}
            this.cobroAguaServ.getDatosPago(this.form.lecturas).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.montos = res.datospago;
                    this.initotal = this.montos.total;
                    this.inimulta = this.montos.multa;
                }
            });
        }
    }

    loadDatosMedidor() {
        this.contraguaServ.findByCodMed(this.codmed).subscribe(resMed => {
            if (this.isResultOk(resMed)) {
                this.datosmedidor = resMed.datosmed;
                this.setDatosMedidor();
            }
        });
    }

    setDatosMedidor() {
        if (this.datosmedidor.mdg_id) {
            this.personaService.buscarPorCod(this.datosmedidor.per_id).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.referente = res.persona;
                }
            });
        }
    }

    getParamsComproAgua(trn) {
        const params = {
            trn,
            pexceso: this.form.montos?.consumo_exceso,
            pvconsumo: this.form.montos?.costobase + this.form.montos?.comision_mavil,
            pvexceso: this.form.montos?.costoexceso,
            pvsubt: this.form.montos?.costobase + this.form.montos?.costoexceso,
            pvdesc: this.form.montos?.descuento,
            pvmulta: this.form.montos?.multa,
            pvtotal: this.form.montos?.total,
            pfechamaxpago: this.form.montos?.fecha_max_pago
        };
        return params;
    }

    onMultaChange() {
        const inputv = Number(this.montos.multa);
        let multa = 0;
        if (inputv && inputv >= 0) {
            multa = inputv;
        }
        this.montos.total = (this.initotal-this.inimulta) + multa;
        let firstprop = null;
        for (let prop in this.montos.pagosdet) {
            firstprop = prop;
            this.montos.pagosdet[prop].multa = 0;
        }
        this.montos.pagosdet[firstprop].multa = multa;
    }

    doCancel() {
        this.evCancel.emit();
    }

    doSave() {
        this.swalService.fireDialog(this.ctes.msgConfirmSave).then(confirm => {
            if (confirm.value) {
                this.form.mdg_num = this.datosmedidor.mdg_num;
                this.form.mdg_id = this.datosmedidor.mdg_id;
                this.form.lecturas = this.lectoids;
                this.form.montos = this.montos;
                this.form.referente = this.referente;
                console.log('Valor de form que se envia:', this.form);

                this.loadingServ.publishBlockMessage();
                this.cobroAguaServ.crearFactura(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.swalService.fireDialog(res.msg, '').then(confprint => {
                            if (confprint.value) {
                                this.asientoService.imprimirComproAgua(this.getParamsComproAgua(res.trncod));
                            }
                        });
                        this.evSaved.emit('');
                    }
                });
            }
        });
    }
}