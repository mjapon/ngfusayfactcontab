import {Component, OnInit} from '@angular/core';
import {BaseComponent} from 'src/app/components/shared/base.component';
import {DomService} from 'src/app/services/dom.service';
import {FechasService} from 'src/app/services/fechas.service';
import {FinanCuentasService} from 'src/app/services/finan/finacuentas.service';
import {FinanMovService} from 'src/app/services/finan/finamovs.service';
import {SwalService} from 'src/app/services/swal.service';
import {RegexUtilService} from '../../../../services/shared/regex-util.service';
import {TableLazyLoadEvent} from 'primeng/table';

@Component({
    selector: 'app-finan-mov-form',
    templateUrl: './movsform.component.html'
})
export class FinanMovsFormComponent extends BaseComponent implements OnInit {
    form: any = {};
    formfiltro: any = {desde: null, hasta: null};
    numCta = '';
    formautoref: any = {};
    datoscta: any = {};
    tipostransa: Array<any> = [];
    movsgrid: any = {data: [], cols: []};
    selectedItem: any = {};
    isShowCreaMov = false;
    isSaving = false;
    tipotransa: any = null;
    cuentasSocio: Array<any> = [];
    ctasociosel: any = {};
    refsel: any = null;
    disabledBuscaRef = false;
    rows = 10;
    page = 0;
    totalRecord = 0;
    loadingGrid = false;

    constructor(
        private swalService: SwalService,
        private domService: DomService,
        private regexUtilService: RegexUtilService,
        private movService: FinanMovService,
        private fechasService: FechasService,
        private ctaService: FinanCuentasService,
    ) {
        super();
    }

    clearGridMovs() {
        this.movsgrid = {data: [], cols: []};
    }

    ngOnInit() {
        this.clearGridMovs();
        this.totalRecord = 0;
        this.domService.setFocusTm('refAutoCom', 300);
    }

    ontipocuentasel() {
        this.auxLoadDatosCuenta();
    }

    loadCtasSocio() {
        if (this.refsel) {
            this.cuentasSocio = [];
            this.ctaService.getCuentasSocio(this.refsel.per_id).subscribe(res => {
                if (this.isResultOk(res)) {
                    this.cuentasSocio = res.cuentas;
                    if (this.cuentasSocio && this.cuentasSocio.length > 0) {
                        this.ctasociosel = this.cuentasSocio[0];
                        this.auxLoadDatosCuenta();
                    } else {
                        this.swalService.fireWarning('Este socio no tiene cuentas aperturadas');
                    }
                }
            });
        }
    }

    auxLoadDatosCuenta() {
        if (this.ctasociosel) {
            this.numCta = this.ctasociosel.cue_id;
            this.buscarPorNumCta();
        }
    }

    setDatosSocioSel() {
        this.refsel = null;
        if (this.formautoref.referente && this.formautoref.referente.per_ciruc) {
            this.refsel = this.formautoref.referente;
        }
    }

    onEnterRef() {

    }

    onRefSelect() {
        this.setDatosSocioSel();
        this.loadCtasSocio();
        this.domService.setFocusTm('btnCrear');
        this.disabledBuscaRef = true;
    }

    onClearRef() {
        this.refsel = null;
        this.datoscta = {};
        this.disabledBuscaRef = false;
    }

    loadMovs() {
        const desde = this.formfiltro.desde ? this.fechasService.formatDate(this.formfiltro.desde) : '';
        const hasta = this.formfiltro.hasta ? this.fechasService.formatDate(this.formfiltro.hasta) : '';
        this.clearGridMovs();
        this.loadingGrid = true;
        this.movService.listar(this.datoscta.cue_id, desde, hasta, this.rows, this.page).subscribe(res => {
            this.loadingGrid = false;
            if (res.gmovs) {
                this.movsgrid = res.gmovs;
                if (this.page === 0) {
                    this.totalRecord = this.movsgrid.total;
                }
            }
        });
    }

    buscarPorNumCta() {
        this.isSaving = false;
        this.datoscta = {};
        this.turnOnLoading();
        this.clearGridMovs();
        this.ctaService.getDatosCuentaByNum(this.numCta).subscribe(res => {
            this.turnOffLoading();
            if (res.existe) {
                this.datoscta = res.datoscuenta;
                this.loadMovs();
            } else {
                this.swalService.fireWarning('No existe una cuenta con el número ingresado')
            }
        });
    }

    updateInfoCta() {
        this.ctaService.getDatosCuentaByNum(this.datoscta.cue_id).subscribe(res => {
            if (res.existe) {
                this.datoscta = res.datoscuenta;
            }
        });
    }

    verDetalles(row: any): void {
        console.log('Ver detalles');
    }

    onRowSelect(ev) {
        console.log('on row select', ev);

    }

    showModalCrea() {
        this.isSaving = false;
        this.form = {};
        this.tipotransa = null;
        this.movService.getForm(this.datoscta.cue_id).subscribe(res => {
            if (res.form) {
                this.form = res.form.form;
                this.tipostransa = res.form.tipostrans;
                this.tipotransa = this.tipostransa[0];
                this.isShowCreaMov = true;
                this.form.mov_total_transa = '';
                console.log('valor de form es:', this.form);
            }
        });
    }

    ontipotransaccsel(ev) {
        this.form.mov_tipotransa = this.tipotransa.tipt_id;
        this.form.mov_abreviado = this.tipotransa.tipt_cod;
        this.form.mov_deb_cred = this.tipotransa.tipt_debcred;
        this.domService.setFocusTm('mov_total_transa', 100);
    }

    guardarMov() {
        if (!this.isSaving) {
            const msg = '¿Confirma que desea registrar esta transacción?';
            this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.isSaving = true;
                    this.movService.crear(this.form).subscribe(res => {
                        this.isSaving = false;
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadMovs();
                        this.updateInfoCta();
                        this.isShowCreaMov = false;
                    });
                }
            });
        }

    }

    cancelCreaMov() {
        this.isShowCreaMov = false;
    }

    isValid(field: string, type: number) {
        const value = this.form[field];
        if (type === 1) {
            return this.regexUtilService.isValidDecimalPattern(value);
        }
        return true;
    }

    doLazyLoad($event: TableLazyLoadEvent) {
        this.page = $event.first;
        this.loadMovs();
    }
}
