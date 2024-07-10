import {Component, OnInit, ViewChild} from '@angular/core';
import {BilleteraService} from '../../../services/billetera.service';
import {SwalService} from '../../../services/swal.service';
import {DomService} from '../../../services/dom.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {Router} from '@angular/router';
import {BilleteramovService} from '../../../services/billeteramov.service';
import {FechasService} from '../../../services/fechas.service';
import {Table, TableLazyLoadEvent} from 'primeng/table';

@Component({
    selector: 'app-ingegr',
    templateUrl: './ingegr.component.html'
})
export class IngegrComponent implements OnInit {

    @ViewChild('movsTable', {static: false}) private dataTable: Table;

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
    saldotot = 0.0;
    isShowDetAsi = false;
    isShowFactura = false;
    filasel: any = {};
    users: Array<any> = [];
    rows = 12;
    page = 0;
    totalRecord: number;

    constructor(private billeteraService: BilleteraService,
                private billmovService: BilleteramovService,
                private domService: DomService,
                private router: Router,
                private fechasService: FechasService,
                private loadingUiService: LoadingUiService,
                private swalService: SwalService) {

    }

    ngOnInit(): void {
        this.isLoading = false;
        this.loadBilleteras();
    }

    loadBilleteras() {
        this.isLoading = true;
        this.billeteraService.listar().subscribe(res => {
            this.isLoading = false;
            if (res.status === 200) {
                this.billeteras = res.billeteras;
                this.saldotot = res.saldotot;
                if (this.billeteras && this.billeteras.length > 0) {
                    this.showMovsBill(this.billeteras[0]);
                }
            }
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
            this.domService.setFocusTm('bil_nombre', 500);
        });
    }

    cancelCreaBill() {
        this.isShowNewBill = false;
    }

    toggleAutogencode() {
        this.formbill.bil_autogencode = this.formbill.bil_autogencode === 1 ? 0 : 1;
        if (this.formbill.bil_autogencode === 0) {
            this.domService.setFocusTm('bil_code', 100);
        }
    }

    doSaveBill() {
        this.isFormBillSubmit = true;

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

        if (confirm(msg)) {
            this.loadingUiService.publishBlockMessage();
            let billsaveobs = null;
            if (this.formbill.bil_id > 0) {
                billsaveobs = this.billeteraService.actualizar(this.formbill);
            } else {
                billsaveobs = this.billeteraService.crear(this.formbill);
            }
            this.isShowNewBill = false;
            billsaveobs.subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadBilleteras();
                    this.isFormBillSubmit = false;
                }
            });
        }
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
        this.billeteraService.getFormSecs(bill.ic_id).subscribe(res => {
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
        if (confirm('¿Confirma que desea anular esta billetera?')) {
            this.billeteraService.anular(this.formbill.bil_id).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadBilleteras();
                    this.isShowNewBill = false;
                }
            });
        }
    }

    verDetalles(rowData) {
        this.filasel = rowData;
        const isinggas = this.filasel.bmo_id > 0;
        const isfactura = this.filasel.tra_codigo === 1 || this.filasel.tra_codigo === 2 || this.filasel.tra_codigo === 7;

        if (isinggas) {
            this.codmovsel = rowData.bmo_id;
            this.isShowDetalleMov = true;
        } else if (isfactura) {
            this.isShowFactura = true;
        } else {
            this.isShowDetAsi = true;
        }
    }

    loadMovimientos() {
        this.isLoadingMovs = true;
        this.dataTable.reset();
    }

    updateTable() {
        this.isLoadingMovs = true;
        let desde = '';
        let hasta = '';
        let tipo = 0;
        let cuenta = 0;
        let cuentabill = 0;
        let user = 0;

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
        if (this.formfiltros?.user) {
            user = this.formfiltros.user;
        }

        this.billmovService.listargrid(desde, hasta, tipo, cuenta, cuentabill, user, this.rows, this.page).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                if (res.grid.total) {
                    this.totalRecord = res.grid.total;
                }
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
                this.users = res.users;
            }
        });
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
        this.formfiltros.cuentabill = bill.ic_id;
        this.loadMovimientos();
    }

    hideDetAsi() {
        this.isShowDetAsi = false;
    }

    closeDetallesFact() {
        this.isShowFactura = false;
    }

    onUsuarioSel($event: any) {
        console.log('On usuario sel:', $event);
    }

    doLazyLoad($event: TableLazyLoadEvent) {
        this.page = $event.first;
        this.updateTable();
    }
}
