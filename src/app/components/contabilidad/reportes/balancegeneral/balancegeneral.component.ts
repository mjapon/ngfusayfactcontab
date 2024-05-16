import { Component, OnInit } from '@angular/core';
import { AsientoService } from '../../../../services/asiento.service';
import { FechasService } from '../../../../services/fechas.service';
import { LoadingUiService } from '../../../../services/loading-ui.service';
import { TreeNode } from 'primeng/api';
import { SwalService } from '../../../../services/swal.service';
import { PeriodoContableService } from 'src/app/services/contable/periodocontab.service';
import { ExcelUtilService } from 'src/app/services/utils/excelutil.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PrimeTreeUtil } from 'src/app/services/utils/treeutil.service';

@Component({
    selector: 'app-balancegeneral',
    templateUrl: './balancegeneral.component.html'
})
export class BalancegeneralComponent implements OnInit {
    datosbalance: any;
    parents: any;
    form: any;
    periodocontable: any;
    parentres: any;
    resultadoejercicio = 0.0;
    selectedTreeRow: TreeNode;
    datosbalancetree: TreeNode[];

    fechasLabel = { desde: '', hasta: '' };

    constructor(private asientoService: AsientoService,
        private loadingUiServ: LoadingUiService,
        private fechasService: FechasService,
        private excelUtilService: ExcelUtilService,
        private periodoContabService: PeriodoContableService,
        private primeTreeUtil: PrimeTreeUtil,
        private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.form = { desde: null, hasta: null, desdestr: '', hastastr: '' };
        this.datosbalance = [];
        this.loadPeriodoContable();

    }

    loadPeriodoContable() {
        this.periodoContabService.getCurrent().subscribe(res => {
            this.periodocontable = res.periodo;
            if (this.periodocontable) {
                this.form.desde = this.fechasService.parseString(this.periodocontable.pc_desde);
                this.form.hasta = new Date();
            }
        });
    }

    loadBalance() {
        if (!this.form.hasta) {
            this.swalService.fireToastError('Verifique las fechas');
            return;
        }

        const desdestr = this.fechasService.formatDate(this.form.desde);
        const hastastr = this.fechasService.formatDate(this.form.hasta);
        this.fechasLabel.desde = desdestr;
        this.fechasLabel.hasta = hastastr;

        this.loadingUiServ.publishBlockMessage();
        this.asientoService.getBalanceGeneral(desdestr, hastastr).subscribe(res => {
            if (res.status === 200) {
                this.datosbalance = res.balance;
                this.parents = res.total_grupos;
                this.resultadoejercicio = res.resultado_ejercicio;
                this.datosbalancetree = res.balancetree;
            }
        });
    }

    onTipoFiltroChange() {
        this.onDesdeChange(null);
        this.onHastaChange(null);
    }

    onDesdeChange($event: any) {
        this.form.desdestr = this.fechasService.formatDate(this.form.desde);
    }

    onHastaChange($event: any) {
        this.form.hastastr = this.fechasService.formatDate(this.form.hasta);
    }

    getestilo(fila: any) {
        const npuntos = fila.dbdata.ic_code.split('.').length;
        const mg = 50 * (npuntos - 1);
        let font = 1000 - (100 * npuntos);
        if (font < 200) {
            font = 200;
        }
        return `margin-right: ${mg}px; font-weight: ${font}`;
    }

    getfuente(fila: any) {
        const npuntos = fila.dbdata.ic_code.split('.').length;
        let font = 1000 - (100 * npuntos);
        if (font < 200) {
            font = 200;
        }
        return `font-weight: ${font}`;
    }

    getabs(valor) {
        return Math.abs(valor);
    }

    togglexpand($event: any) {
        if (this.selectedTreeRow) {
            this.selectedTreeRow.expanded = !this.selectedTreeRow.expanded;
        }
    }

    exportPdf() {
        this.loadingUiServ.publishBlockMessage();
        const balanceItems: Array<any> = [];
        if (this.datosbalancetree) {
            this.datosbalancetree.forEach(it => this.loadBalanceItems(it, balanceItems));
        }

        let desde = this.fechasService.formatDate(this.form.desde);
        let hasta = this.fechasService.formatDate(this.form.hasta);

        let periodo = `${desde} - ${hasta}`;
        let resumenitem = [];
        resumenitem.push({ label: 'ACTIVOS:', value: this.parents['1'] });
        resumenitem.push({ label: 'PASIVOS:', value: this.getabs(this.parents['2']) });
        resumenitem.push({ label: 'PATRIMONIO:', value: this.getabs(this.parents['3']) });
        resumenitem.push({ label: 'RESULTADO DEL EJERCICIO:', value: this.getabs(this.resultadoejercicio) });
        resumenitem.push({ label: 'ACTIVO = PASIVO + PATRIMONIO:', value: `${this.parents['1']} = ${this.getabs(this.parents['2'])} + ${this.getabs(this.parents['3'])} (${this.getabs(this.parents['2']) + this.getabs(this.parents['3'])}) ` });

        this.asientoService.genPdfBanlance(balanceItems, periodo, resumenitem, this.titulo).subscribe((res: ArrayBuffer) => {
            this.viewBalance(res);
        });
    }

    viewBalance(res) {
        this.asientoService.viewBlob(res, 'application/pdf');
    }

    loadBalanceItems(node: any, items: Array<any>) {
        this.primeTreeUtil.loadBalanceItems(node, items);        
    }

    exportExcel() {
        this.loadingUiServ.publishBlockMessage();
        const balanceItems: Array<any> = [];
        if (this.datosbalancetree) {
            this.datosbalancetree.forEach(it => this.loadBalanceItems(it, balanceItems));
        }

        let desde = this.fechasService.formatDate(this.form.desde);
        let hasta = this.fechasService.formatDate(this.form.hasta);

        let periodo = `${desde} - ${hasta}`;

        this.asientoService.genExcelBalanceGeneral(balanceItems, periodo, '').subscribe((res: Blob) => {
            this.excelUtilService.downloadExcelFile(res, this.titulo, true);
        });
    }

    titulo = 'BALANCE GENERAL';
}
