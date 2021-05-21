import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SwalService} from '../../../../../services/swal.service';
import {CreditoService} from '../../../../../services/credito.service';
import {LoadingUiService} from '../../../../../services/loading-ui.service';
import {FechasService} from '../../../../../services/fechas.service';
import {ArrayutilService} from '../../../../../services/arrayutil.service';
import {DomService} from '../../../../../services/dom.service';
import {NumberService} from '../../../../../services/number.service';
import {CtesService} from '../../../../../services/ctes.service';

@Component({
    selector: 'app-credrefform',
    templateUrl: './credrefform.component.html'
})
export class CredrefformComponent implements OnInit, OnChanges {
    @Input() tipo: number;
    @Input() codref: number;
    titulo = '';
    isLoading = false;
    form: any = {};
    formasi: any = {};
    currentDate = new Date();
    cuentasforcred: Array<any> = [];

    @Output() evCancelar = new EventEmitter<any>();
    @Output() evDeudaCreada = new EventEmitter<any>();

    constructor(private swalService: SwalService,
                private loadingService: LoadingUiService,
                private domService: DomService,
                private fechasService: FechasService,
                private arrayService: ArrayutilService,
                private ctes: CtesService,
                private numberService: NumberService,
                private creditoService: CreditoService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.tipo;
        if (chng.currentValue) {
            this.loadForm();
        }
    }

    ngOnInit(): void {
        this.domService.setFocusTm(this.ctes.monto, 300);
    }

    ontiposel(fila: any) {
        const idx = this.form.motivos.indexOf(fila);
        this.domService.setFocusTm(`tipo_valor_${idx}`, 100);
        fila.dt_valor = this.auxGetMontoFila(this.form.motivos, idx);
    }

    removeCuenta(fila) {
        this.arrayService.removeElement(this.form.motivos, fila);
    }

    loadForm() {
        this.isLoading = true;
        this.creditoService.getFormCrea(this.tipo, this.codref).subscribe(res => {
            this.form = res.form.formtopost.form;
            this.formasi = res.form.formtopost.formasiento;
            this.formasi.formasiento.trn_fecregobj = this.fechasService.parseString(this.formasi.formasiento.trn_fecreg);
            this.isLoading = false;
            this.titulo = res.form.titulo;
            this.cuentasforcred = res.form.cuentasforcred;
        });
    }

    addcuentas() {
        this.form.motivos.push({cta_codigo: 0, dt_valor: 0.0});
    }

    guardar() {
        const montotal = this.form.monto;
        if (this.numberService.round2(montotal) <= 0) {
            this.swalService.fireToastError(this.ctes.msgMontoIncVerif);
            return;
        }

        let totalctas = Number(0.0);
        this.form.motivos.forEach(cuenta => {
            totalctas += Number(cuenta.dt_valor);
        });
        if (!this.formasi.formasiento.trn_fecregobj) {
            this.swalService.fireToastError('Debe ingresar la fecha de la transacción');
            return;
        }
        this.formasi.formasiento.trn_fecreg = this.fechasService.formatDate(this.formasi.formasiento.trn_fecregobj);

        if (this.numberService.round2(montotal) === this.numberService.round2(totalctas)) {
            this.swalService.fireDialog('¿Confirma que desea crear este registro?', '').then(confirm => {
                if (confirm.value) {
                    const formtopost = {
                        form: this.form, formasiento: this.formasi
                    };
                    this.loadingService.publishBlockMessage();
                    this.creditoService.guardaCredRef(formtopost).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.evDeudaCreada.emit('');
                            this.cancelar();
                        }
                    });
                }
            });
        } else {
            this.swalService.fireToastError('Los montos ingresados no coinciden, favor verificar');
        }
    }

    cancelar() {
        this.evCancelar.emit('');
    }

    auxGetMontoFila(thearray, idx) {
        return this.arrayService.getMontoFila(thearray, idx, this.form.monto);
    }

}
