import {Component, OnInit} from '@angular/core';
import {BilleteraService} from '../../../services/billetera.service';
import {SwalService} from '../../../services/swal.service';
import {DomService} from '../../../services/dom.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {VentaticketService} from '../../../services/ventaticket.service';
import {Router} from '@angular/router';

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


    items: Array<any> = [];
    cols: Array<any> = [];
    total = 0.0;

    constructor(private billeteraService: BilleteraService,
                private vtService: VentaticketService,
                private domService: DomService,
                private router: Router,
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

        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
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
        });
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
            this.isShowNewBill = true;
        });
    }

    doDeleteBill() {
        this.swalService.fireDialog('¿Confirma que desea anular esta billetera?').then(confirm => {
            if (confirm.value) {
                this.billeteraService.anular(this.formbill.bil_id).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadBilleteras();
                        this.isShowNewBill = false;
                    }
                });
            }
        });
    }

    verDetalles(rowData) {

    }

    loadMovimientos() {
        this.vtService.listar(0, 0).subscribe(res => {
            this.cols = res.res.cols;
            this.items = res.res.data;
            this.total = res.suma;
        });
    }

    goToForm(tipo: number, $event: MouseEvent) {
        $event.preventDefault();
        this.router.navigate(['vtickets', 'form', tipo]);
    }
}
