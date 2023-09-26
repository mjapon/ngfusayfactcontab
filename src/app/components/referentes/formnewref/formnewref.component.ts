import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LoadingUiService } from '../../../services/loading-ui.service';
import { PersonaService } from '../../../services/persona.service';
import { SwalService } from '../../../services/swal.service';
import { DomService } from '../../../services/dom.service';
import { CtesService } from '../../../services/ctes.service';
import { PlantratamientoService } from 'src/app/services/plantratamiento.service';
import { CompeleService } from 'src/app/services/compele.service';
import { BaseComponent } from '../../shared/base.component';

@Component({
    selector: 'app-formnewref',
    templateUrl: './formnewref.component.html'
})
export class FormNewrefBasic extends BaseComponent implements OnInit, OnChanges {

    @Input() codref: number;
    @Input() planid: number;

    @Output() confirmPlanSaved = new EventEmitter<any>();
    @Output() canceledSavePlan = new EventEmitter<any>();

    referente: any = {};
    formautoref: any = {};

    tiposComprob = [];

    tipoComproEmite: any = {};

    constructor(private loadingUiService: LoadingUiService, private personaService: PersonaService,
        private swalService: SwalService, private domService: DomService, private planService: PlantratamientoService,
        private compele: CompeleService,
        private ctes: CtesService) {
        super();

    }

    ngOnChanges(changes: SimpleChanges): void {
        const pacchange = changes.codref;
        const codcurrentvalue = pacchange.currentValue;
        if (codcurrentvalue !== null) {
            this.loadFormOrData();
        }
    }

    ngOnInit(): void {
        this.referente = { per_edad: {} };

        this.tiposComprob = [{ label: 'Nota de venta', value: 2 },
        { label: 'Factura', value: 1 }];
        this.tipoComproEmite = this.tiposComprob[0];
    }

    loadFormOrData() {
        if (this.codref === 0) {
            this.referente = {};
        } else {
            this.buscarreferentePorCod();
        }
    }

    buscarreferentePorCod() {
        this.loadingUiService.publishBlockMessage();
        this.personaService.buscarPorCod(this.codref).subscribe(res => {
            if (res.status === 200) {
                this.referente = res.persona;
            }
        });
    }

    verificaRefRegistrado() {
        if (this.referente.per_id === 0) {
            this.buscarReferente(false);
        }
    }

    buscarReferente(showMessage) {
        const per_ciruc = this.referente.per_ciruc;
        if (per_ciruc && per_ciruc.trim().length > 0) {
            this.loadingUiService.publishBlockMessage();
            this.personaService.buscarPorCi(per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    if (showMessage) {
                        this.swalService.fireToastInfo(this.ctes.msgRefRegistered);
                    }
                    this.referente = res.persona;
                } else {

                    this.referente.per_ciruc = per_ciruc;
                }
            }
            );
        }
    }

    onEnterRef(ev) {
        this.auxFindFromAutocomplete();
    }

    onRefSelect() {
        this.auxFindFromAutocomplete();
    }

    auxFindFromAutocomplete() {
        if (this.formautoref && this.formautoref.referente.per_ciruc) {
            this.referente.per_ciruc = this.formautoref.referente.per_ciruc;
            this.buscarReferente(false);
        }
    }

    doEmiteFactura() {
        this.confirmarPlan(this.tipoComproEmite.value);
    }

    cancelEmiteFactura() {
        this.canceledSavePlan.emit('');
    }

    loadFormReferente() {
        this.referente = {};
        this.personaService.getForm().subscribe(res => {
            if (this.isResultOk(res)) {
                this.referente = res.form;
                this.domService.setFocusTm('input_per_id');
            }
        });
    }

    clearFormPersona() {
        this.loadFormReferente();
    }

    confirmarPlan(tipo) {
        const msgemitir = `emitir una ${this.tipoComproEmite.label}`;
        const msg = `¿Seguro que desea marcar como confirmado este plan y ${msgemitir}?`;
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.planService.cambiarEstado(this.planid, 2, tipo, this.referente).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        const compelenviado = res.compele.compelenviado || false;
                        if (compelenviado) {
                            if (!res.is_cons_final) {
                                this.compele.saveComprobContrib(res.compele.trn_codigo, res.compele.estado_envio).subscribe(rescomprob => {
                                    console.log('Respuesta de recomprob es', rescomprob);
                                });
                            }
                            else {
                                console.log('No se guarda el comprobante por que es consumidor final');
                            }
                        }
                        this.confirmPlanSaved.emit('');
                    }
                });
            }
        }
        );
    }

}
