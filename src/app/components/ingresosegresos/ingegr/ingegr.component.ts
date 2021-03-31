import {Component, OnInit} from '@angular/core';
import {BilleteraService} from '../../../services/billetera.service';
import {SwalService} from '../../../services/swal.service';
import {DomService} from '../../../services/dom.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {VentaticketService} from '../../../services/ventaticket.service';
import {Router} from '@angular/router';
import {BilleteramovService} from '../../../services/billeteramov.service';
import {FechasService} from '../../../services/fechas.service';

@Component({
    selector: 'app-ingegr',
    templateUrl: './ingegr.component.html'
})
export class IngegrComponent implements OnInit {
    isLoading = false;
    billeteras = [];
    isShowNewBill = false;
    isLoadingFormBill = false;
    formbill: any = {};
    cajasdisp = [];
    isFormBillSubmit = false;
    numbersPattern = '^[0-9]*\\.*[0-9]*$';
    titleFormBill = '';

    grid: any = {};
    total = 0.0;
    isLoadingMovs = false;
    isShowFilter = false;

    formfiltros: any = {};
    tipos: Array<any> = [];
    cuentas: Array<any> = [];
    isShowDetalleMov = false;
    codmovsel: number;
    selBillHasMoves = false;

    constructor(private billeteraService: BilleteraService,
                private billmovService: BilleteramovService,
                private vtService: VentaticketService,
                private domService: DomService,
                private router: Router,
                private fechasService: FechasService,
                private loadingUiService: LoadingUiService,
                private swalService: SwalService) {
        registerLocaleData(es);
    }

    ngOnInit(): void {
        this.isLoading = false;
        this.loadBilleteras();
        this.loadMovimientos();
    }

    loadBilleteras() {
        this.isLoading = true;
        this.billeteraService.listar().subscribe(res => {
            if (res.status === 200) {
                this.billeteras = res.billeteras;
            }
            this.isLoading = false;
        });
    }

    crearBilletera() {
        this.isLoadingFormBill = true;
        this.selBillHasMoves = false;
        this.titleFormBill = 'Nueva Billetera';
        this.billeteraService.getForm().subscribe(res => {
            if (res.status === 200) {
                this.formbill = res.form;
                this.cajasdisp = res.form.cajas;
            }
            this.isLoadingFormBill = false;
            this.isShowNewBill = true;
            this.domService.setFocusTimeout('bil_nombre', 500);
        });
    }

    cancelCreaBill() {
        this.isShowNewBill = false;
    }

    toggleAutogencode() {
        this.formbill.bil_autogencode = this.formbill.bil_autogencode === 1 ? 0 : 1;
        if (this.formbill.bil_autogencode === 0) {
            this.domService.setFocusTimeout('bil_code', 100);
        }
    }

    doSaveBill() {
        this.isFormBillSubmit = true;
        // Verificar que ningun campo tenga error

        if (!this.domService.txtInputFieldHasValue(this.formbill.bil_code) ||
            !this.domService.txtInputFieldHasValue(this.formbill.bil_nombre) ||
            (this.formbill.bil_id === 0 && this.formbill.haycajasdisp === 1 && !this.domService.cmbInputFieldHasValue(this.formbill.ic_id))
        ) {
            this.swalService.fireToastError('Datos Incorrectos verifique por favor');
            return;
        }
        let msg = '¿Confirma la creación de esta billetera?';
        if (this.formbill.bil_id > 0) {
            msg = '¿Confirma la actualización de esta billetera?';
        }

        // this.swalService.fireDialog(msg).then(confirm => {
        if (confirm(msg)) {
            this.loadingUiService.publishBlockMessage();
            let billsaveobs = null;
            if (this.formbill.bil_id > 0) {
                billsaveobs = this.billeteraService.actualizar(this.formbill);
            } else {
                billsaveobs = this.billeteraService.crear(this.formbill);
            }
            billsaveobs.subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.isShowNewBill = false;
                    this.loadBilleteras();
                    this.isFormBillSubmit = false;
                }
            });
        }
        // });
    }

    ctacontabhaserror() {
        return this.formbill.ic_id.value === 0;
    }

    fieldHasError(field) {
        let haserror = false;
        if (this.formbill[field].required) {
            haserror = this.formbill[field].value.toString().trim().length === 0;
        }
        return haserror;
    }

    evalPattern(field, pattern) {
        const re = new RegExp(pattern);
        return !re.test(this.formbill[field].value);
    }

    showDetBill(bill) {
        this.titleFormBill = 'Datos de la billetera';
        this.selBillHasMoves = false;
        this.billeteraService.getForm().subscribe(res => {
            if (res.status === 200) {
                this.formbill = res.form;
                this.cajasdisp = res.form.cajas;
            }
            this.isLoadingFormBill = false;
            this.formbill.bil_id = bill.bil_id;
            this.formbill.bil_code.value = bill.bil_code;
            this.formbill.bil_nombre.value = bill.bil_nombre;
            this.formbill.bil_saldoini.value = bill.bil_saldoini;
            this.formbill.bil_obs.value = bill.bil_obs;
            this.formbill.ic_nombre = bill.ic_nombre;
            this.isShowNewBill = true;
        });

        this.billeteraService.hasMoves(bill.bil_id).subscribe(resb => {
            if (resb.status === 200) {
                this.selBillHasMoves = resb.hasmoves;
            }
        });
    }

    doDeleteBill() {
        // this.swalService.fireDialog('¿Confirma que desea anular esta billetera?').then(confirm => {
        if (confirm('¿Confirma que desea anular esta billetera?')) {
            this.billeteraService.anular(this.formbill.bil_id).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadBilleteras();
                    this.isShowNewBill = false;
                }
            });
        }
        // });
    }

    verDetalles(rowData) {
        this.codmovsel = rowData.bmo_id;
        this.isShowDetalleMov = true;
    }

    loadMovimientos() {
        this.isLoadingMovs = true;
        let desde = '';
        let hasta = '';
        let tipo = 0;
        let cuenta = 0;
        let cuentabill = 0;

        if (this.formfiltros?.desde) {
            desde = this.fechasService.formatDate(this.formfiltros.desde);
        }
        if (this.formfiltros?.hasta) {
            hasta = this.fechasService.formatDate(this.formfiltros.hasta);
        }
        if (this.formfiltros?.tipo) {
            tipo = this.formfiltros.tipo;
        }
        if (this.formfiltros?.cuenta) {
            cuenta = this.formfiltros.cuenta;
        }
        if (this.formfiltros?.cuentabill) {
            cuentabill = this.formfiltros.cuentabill;
        }

        this.billmovService.listargrid(desde, hasta, tipo, cuenta, cuentabill).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
            }
            this.isLoadingMovs = false;
        });
    }

    goToForm(tipo: number, $event: MouseEvent) {
        $event.preventDefault();
        this.router.navigate(['vtickets', 'form', tipo]);
    }

    toggleShowFilter() {
        this.isShowFilter = !this.isShowFilter;
        if (this.isShowFilter) {
            this.loadFormFiltros();
        }
    }

    cancelFiltro() {
        this.isShowFilter = false;
        this.formfiltros = {};
        this.loadMovimientos();
    }

    loadFormFiltros() {
        this.formfiltros = {};
        this.loadingUiService.publishBlockMessage();
        this.billmovService.getFormFiltros().subscribe(res => {
            if (res.status === 200) {
                this.formfiltros = res.formfiltro;
                this.tipos = res.tiposmovs;
            }
        });
    }

    loadCuentas() {
        const tiposel = this.formfiltros.tipo;
        this.cuentas = [];
        if (tiposel > 0) {
            this.loadingUiService.publishBlockMessage();
            this.billmovService.getCuentasBytTipo(tiposel).subscribe(res => {
                if (res.status === 200) {
                    this.cuentas = res.cuentas;
                }
            });
        }
    }

    onDesdeChange($event: any) {

    }

    onHastaChange($event: any) {

    }

    onTipoFechaSel() {

    }

    onFiltroTipoSel($event: any) {
        this.cuentas = [];
        if (this.formfiltros?.tipo > 0) {
            this.billmovService.getCuentasBytTipo(this.formfiltros.tipo).subscribe(res => {
                if (res.status === 200) {
                    this.cuentas = res.cuentas;
                }
            });
        } else {
            this.formfiltros.cuenta = 0;
        }
    }

    onFiltroCuentaSel($event: any) {

    }

    closeModalDet($event: any) {
        this.isShowDetalleMov = false;
    }

    onAnulaView($event: any) {
        this.isShowDetalleMov = false;
        this.loadMovimientos();
        this.loadBilleteras();
    }

    onConfirmaView($event: any) {
        this.isShowDetalleMov = false;
        this.loadMovimientos();
        this.loadBilleteras();
    }

    showMovsBill(bill: any) {
        this.cancelFiltro();
        this.formfiltros.cuentabill = bill.ic_id;
        this.loadMovimientos();
    }
}
