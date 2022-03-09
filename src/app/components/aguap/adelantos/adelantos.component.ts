import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AbonoService } from "src/app/services/abono.service";
import { CobroaguaService } from "src/app/services/agua/cobroagua.service";
import { AsientoService } from "src/app/services/asiento.service";
import { CtesService } from "src/app/services/ctes.service";
import { DomService } from "src/app/services/dom.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../../shared/base.component";

@Component({
    selector: 'app-adelantos',
    templateUrl: './adelantos.component.html'
})
export class AdelantosComponent extends BaseComponent implements OnChanges {

    @Input() perid: number = 0;
    adelantos: Array<any> = [];

    abonosList: Array<any> = [];
    totalabonos: number;
    adelantosel: any = {};
    formPagoAdelantado: any = {};
    isShowFormPagoAdelantado = false;


    constructor(private cobroAguaServ: CobroaguaService,
        private ctes: CtesService,
        private domService: DomService,
        private abonoService: AbonoService,
        private swalService: SwalService,
        private asientoService: AsientoService) {
        super()
    }

    ngOnChanges(changes: SimpleChanges): void {
        const changePerid = changes.perid;
        if (changePerid.currentValue) {
            this.loadAdelantos();
        }
    }

    loadAdelantos() {
        this.turnOnLoading();
        this.adelantos = [];
        this.abonosList = [];
        this.cobroAguaServ.getAdelantos(this.perid).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.adelantos = res.adelantos;
                if (this.adelantos.length > 0) {
                    this.loadAbonos(this.adelantos[0]);
                }
            }
        })
    }


    anularAdelanto(fila: any) {
        this.swalService.fireDialog(this.ctes.msgSureWishAnulRecord).then(confirm => {
            if (confirm.value) {
                this.asientoService.anular(fila.trn_codigo, '').subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadAdelantos();
                    }
                });

            }
        });
    }

    loadAbonos(fila) {
        this.adelantosel = fila;
        this.totalabonos = 0.0;
        this.abonosList = [];
        this.abonoService.listaAbonosFact(fila.trn_codigo).subscribe(res => {
            if (res.status === 200) {
                this.abonosList = res.abonos;
                this.totalabonos = res.total;
            }
        });
    }

    anularAbono(abono) {
        const msg = '¿Confirma que desea anular este pago?';
        if (confirm(msg)) {
            this.cobroAguaServ.anularAboPagoAdel({
                trn_cod_abo: abono.trn_codigo_abo,
                codabo: abono.abo_codigo,
                obs: ''
            }).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadAbonos(this.adelantosel);
                    this.loadAdelantos();
                }
            });
        }
    }

    showFormCreaPagoAdelantado() {
        this.formPagoAdelantado = {};
        this.cobroAguaServ.getFormPagoAdelantado(this.perid).subscribe(res => {
            if (this.isResultOk(res)) {
                this.domService.setFocusTm('inputMontoPagAdel');
                this.formPagoAdelantado = res.form;
                this.isShowFormPagoAdelantado = true;
                this.loadAdelantos();
            }
        });
    }


    guardaPagoAdelantado() {
        this.swalService.fireDialog(this.ctes.msgConfirmSave).then(confirm => {
            if (confirm.value) {
                this.cobroAguaServ.creaPagoAdelantado(this.formPagoAdelantado).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.isShowFormPagoAdelantado = false;
                        this.loadAdelantos();
                    }
                });
            }
        });
    }

    cancelarCreaPagoAdelantado() {
        this.isShowFormPagoAdelantado = false;
    }

}