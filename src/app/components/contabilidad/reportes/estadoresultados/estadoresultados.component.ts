import { Component, OnInit } from '@angular/core';
import { AsientoService } from '../../../../services/asiento.service';
import { FechasService } from '../../../../services/fechas.service';
import { LoadingUiService } from '../../../../services/loading-ui.service';
import { TreeNode } from 'primeng/api';
import { ReportscontaService } from '../../../../services/reportsconta.service';
import { SwalService } from '../../../../services/swal.service';
import { PrimeTreeUtil } from 'src/app/services/utils/treeutil.service';
import { PeriodoContableService } from 'src/app/services/contable/periodocontab.service';
import { ExcelUtilService } from 'src/app/services/utils/excelutil.service';

@Component({
    selector: 'app-estadoresultados',
    templateUrl: './estadoresultados.component.html'
})
export class EstadoresultadosComponent implements OnInit {
    datosbalance: any;
    parents: any;
    form: any;
    selectedTreeRow: TreeNode;
    datosbalancetree: TreeNode[];
    periodocontable: any;
    titulo = 'ESTADO DE RESULTADOS';

    constructor(private asientoService: AsientoService,
        private loadingUiServ: LoadingUiService,
        private fechasService: FechasService,
        private swalService: SwalService,
        private treeUtil: PrimeTreeUtil,        
        private excelUtilService: ExcelUtilService,
        private periodoContabServ: PeriodoContableService,
        private reportsContaServ: ReportscontaService) {
    }

    ngOnInit(): void {
        this.datosbalance = [];
        this.form = { desde: null, hasta: null, desdestr: '', hastastr: '' };
        this.loadPeriodoContable();
    }

    loadPeriodoContable() {
        this.periodoContabServ.getCurrent().subscribe(res => {
            this.periodocontable = res.periodo;
            console.log('Datos del periodo contable:', this.periodocontable);
            if (this.periodocontable){
                this.form.desde = this.fechasService.parseString(this.periodocontable.pc_desde);
                this.form.hasta = new Date();
            }

        });
    }

    loadBalance() {
        if (!(this.form.desde && this.form.hasta)) {
            this.swalService.fireToastError('Verifique las fechas');
            return;
        }

        const desdestr = this.fechasService.formatDate(this.form.desde);
        const hastastr = this.fechasService.formatDate(this.form.hasta);
        this.form.desdestr = desdestr;
        this.form.hastastr = hastastr;
        this.loadingUiServ.publishBlockMessage();
        this.asientoService.getEstadoResultados(desdestr, hastastr).subscribe(res => {
            if (res.status === 200) {
                this.datosbalance = res.reporte_list;
                this.parents = res.total_grupos;
                this.datosbalancetree = res.reporte_tree;

                this.treeUtil.expandAll(this.datosbalancetree);
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
        const mg = 50 * npuntos;
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
            this.treeUtil.toggleExpand(this.selectedTreeRow);
        }
    }

    getnombrearchivo() {
        const fechaactual = this.fechasService.formatDate(new Date());
        return `estadoresultados_${fechaactual}`;
    }

    exportPdf() {        
        this.loadingUiServ.publishBlockMessage();
        const balanceItems: Array<any> = [];
        if (this.datosbalancetree) {
            this.datosbalancetree.forEach(it => this.treeUtil.loadBalanceItems(it, balanceItems));
        }

        let desde = this.fechasService.formatDate(this.form.desde);
        let hasta = this.fechasService.formatDate(this.form.hasta);

        let periodo = `${desde} - ${hasta}`;
        let resumenitem = [];
        resumenitem.push({ label: 'INGRESOS:', value: this.getabs(this.parents['5']) });
        resumenitem.push({ label: 'GASTOS:', value: this.getabs(this.parents['4']) });        
        resumenitem.push({ label: 'UTILIDAD O PERDIDA:', value: `${this.getabs(this.parents['5'])} - ${this.getabs(this.parents['4'])}  = ${this.getabs(this.parents['5']) - this.getabs(this.parents['4'])} `});

        this.asientoService.genPdfBanlance(balanceItems, periodo, resumenitem, this.titulo).subscribe((res: ArrayBuffer) => {
            this.viewBalance(res);
        });

    }

    viewBalance(res) {
        this.asientoService.viewBlob(res, 'application/pdf');
    }

    exportExcel() {        
        this.loadingUiServ.publishBlockMessage();
        const balanceItems: Array<any> = [];
        if (this.datosbalancetree) {
            this.datosbalancetree.forEach(it => this.treeUtil.loadBalanceItems(it, balanceItems));
        }

        let desde = this.fechasService.formatDate(this.form.desde);
        let hasta = this.fechasService.formatDate(this.form.hasta);

        let periodo = `${desde} - ${hasta}`;

        this.asientoService.genExcelBalanceGeneral(balanceItems, periodo, this.titulo).subscribe((res: Blob) => {
            this.excelUtilService.downloadExcelFile(res, 'ESTADO_RESULTADOS', true);
        });

    }
}
