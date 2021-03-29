import {Component, OnInit} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {FechasService} from '../../../../services/fechas.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {TreeNode} from 'primeng/api';
import {ReportscontaService} from '../../../../services/reportsconta.service';
import {SwalService} from '../../../../services/swal.service';

@Component({
    selector: 'app-balancegeneral',
    template: `
        <div>
            <h2>Balance general</h2>
            <div class="row mt-3 mb-3">
                <div class="col-md-8">
                    <app-rangofechas [form]="form"
                                     (evDesdeChange)="onDesdeChange($event)"
                                     (evHastaChange)="onHastaChange($event)"
                                     (evFilterSel)="onTipoFiltroChange()">
                    </app-rangofechas>
                </div>
                <div class="col-md-4 d-flex flex-column justify-content-end">
                    <div class="d-flex">
                        <div class="btn-group btn-block">
                            <button class="btn btn-outline-primary" (click)="loadBalance()">
                                <i class="fa fa-play-circle"></i>
                                Generar
                            </button>
                            <button class="btn btn-outline-primary" [disabled]="!(datosbalance.length>0)"
                                    title="Exportar a pdf" (click)="exportPdf()">
                                <i class="fa fa-file-pdf"></i>
                            </button>
                            <button class="btn btn-outline-primary" [disabled]="!(datosbalance.length>0)"
                                    title="Exportar a excel" (click)="exportExcel()">
                                <i class="fa fa-file-excel"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div class="mt-2 border" *ngIf="datosbalance.length>0">

                <div class="text-center mt-2 mb-2">
                    <h5>BALANCE GENERAL</h5>
                    <h6> {{form.desdestr}} - {{form.hastastr}} </h6>
                </div>

                <p-treeTable [value]="datosbalancetree" [(selection)]="selectedTreeRow" selectionMode="single"
                             (dblclick)="togglexpand($event)">
                    <ng-template pTemplate="header">
                        <tr>
                            <th scope="col" width="10%">Código</th>
                            <th scope="col" width="55%">Nombre</th>
                            <th scope="col" width="35%">
                                <div class="d-flex flex-row-reverse w-100">
                                    <span>Saldo</span>
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                        <tr class="hand" [ttSelectableRow]="rowNode">
                            <td class="quitaPadding">
                                <span [style]="getfuente(rowNode.node)"
                                      class="ml-3"> {{rowNode.node.dbdata.ic_code}} </span>
                            </td>
                            <td class="quitaPadding">
                                <span [style]="getfuente(rowNode.node)"> {{rowNode.node.dbdata.ic_nombre}} </span>
                            </td>
                            <td class="quitaPadding d-flex flex-row-reverse">
                                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                                <span [style]="getestilo(rowNode.node)"> $ {{rowNode.node.total| number: '.2'}} </span>
                            </td>
                        </tr>
                    </ng-template>
                </p-treeTable>
            </div>

            <div class="mt-2" *ngIf="datosbalance.length>0">
                <div class="row">
                    <div class="col-md-10">
                        <div class="mt-2 mb-2">
                            <h5>Ecuación Contable</h5>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <tbody>
                                <tr>
                                    <td>
                                        <span class="font-weight-bold">ACTIVOS:</span>
                                    </td>
                                    <td>
                                        <span class="font-weight-bold"> {{parents['1'].total| number: '.2'}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="font-weight-bold">PASIVOS:</span>
                                    </td>
                                    <td>
                                        <span class="font-weight-bold">{{getabs(parents['2'].total)| number: '.2'}} </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="font-weight-bold">PATRIMONIO:</span>
                                    </td>
                                    <td>
                                        <span class="font-weight-bold">{{ getabs(parents['3'].total) | number: '.2'}} </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="font-weight-bold">RESULTADO DEL EJERCICIO:</span>
                                    </td>
                                    <td>
                                        <span class="font-weight-bold">{{ getabs(resultadoejercicio)  | number: '.2'}} </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="font-weight-bold">ACTIVO = PASIVO + PATRIMONIO:</span>
                                    </td>
                                    <td>
                                        <span class="font-weight-bold">{{parents['1'].total| number: '.2'}}
                                            = {{getabs(parents['2'].total)| number: '.2'}}
                                            + {{getabs(parents['3'].total)| number: '.2'}}
                                            + {{getabs(resultadoejercicio)| number: '.2'}}
                                            ({{(getabs(parents['2'].total) + getabs(parents['3'].total) + getabs(resultadoejercicio))| number: '.2'}}
                                            )
                                             </span>
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    `
})
export class BalancegeneralComponent implements OnInit {
    datosbalance: any;
    parents: any;
    form: any;
    parentres: any;
    resultadoejercicio = 0.0;
    selectedTreeRow: TreeNode;
    datosbalancetree: TreeNode[];

    constructor(private asientoService: AsientoService,
                private loadingUiServ: LoadingUiService,
                private fechasService: FechasService,
                private swalService: SwalService,
                private reportsContaServ: ReportscontaService) {
    }

    ngOnInit(): void {
        this.datosbalance = [];
        this.form = {desde: null, hasta: null, desdestr: '', hastastr: ''};
    }

    loadBalance() {
        if (!(this.form.desde && this.form.hasta)) {
            this.swalService.fireToastError('Verifique las fechas');
            return;
        }

        const desdestr = this.fechasService.formatDate(this.form.desde);
        const hastastr = this.fechasService.formatDate(this.form.hasta);
        this.loadingUiServ.publishBlockMessage();
        this.asientoService.getBalanceGeneral(desdestr, hastastr).subscribe(res => {
            if (res.status === 200) {
                this.datosbalance = res.balance;
                this.parents = res.parents;
                this.parentres = res.parentres;
                this.resultadoejercicio = this.getabs(this.parentres['5'].total) - this.getabs(this.parentres['4'].total);
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

    getnombrearchivo() {
        const fechaactual = this.fechasService.formatDate(new Date());
        return `balancegeneral_${fechaactual}`;
    }

    exportPdf() {
        this.swalService.fireToastInfo('En construcción');
        // this.reportsContaServ.exportPdf(this.datosbalance, this.form, this.getnombrearchivo(), 'BALANCE GENERAL');
    }

    exportExcel() {
        this.swalService.fireToastInfo('En construcción');
        // this.reportsContaServ.exportExcel(this.datosbalance, this.getnombrearchivo());
    }

}
