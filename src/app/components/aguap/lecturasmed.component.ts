import { Component, Input, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CobroaguaService } from "src/app/services/agua/cobroagua.service";
import { LoadingUiService } from "src/app/services/loading-ui.service";
import { LectomedaguaService } from "src/app/services/agua/lectomedagua.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../shared/base.component";
import { CtesAguapService } from "./utils/ctes-aguap.service";
import { AsientoService } from "src/app/services/asiento.service";

@Component({
    selector: 'app-lecturasmed',
    template: `
    <div>
        <div *ngIf="isLoading">
            <app-loading></app-loading>
        </div>
        <div *ngIf="!isLoading">
            <div class="d-flex justify-content-center">
                <div class="btn-group" role="group" aria-label="Small button group">
                    <button type="button" class="btn btn-outline-primary" (click)="loadGrid()" title="Actualizar"> <i class="fas fa-sync-alt"></i> </button> 
                    <button type="button" class="btn btn-outline-primary" (click)="showModalCrea()">Crear Lectura <span class="fa-solid fa-plus"></span></button> 
                    <button type="button" class="btn btn-outline-primary" (click)="showModalCobra()">Cobrar <span class="fa fa-money-bill"></span> </button> 
                </div>
            </div>
            <p-menu #menu [popup]="true" appendTo="body" [model]="items"></p-menu>
            <p-contextMenu #com [model]="items" appendTo="body"></p-contextMenu>
        

        <p-table [value]="gridLecturas.data" [paginator]="true" [rows]="50" selectionMode="single" [responsive]="true" 
        [(contextMenuSelection)]="selectedLecto" [contextMenu]="com"
        (onContextMenuSelect)="onContextMenu($event)">
            <ng-template pTemplate="header">
                <tr>
                    <th *ngFor="let item of gridLecturas.cols" [pSortableColumn]="item.field" [ngSwitch]="item.field"
                        [width]="item.width">
                        <span class="fontsizesm">{{item.label}}</span>
                        <p-sortIcon [field]="item.field"></p-sortIcon>
                    </th>
                    <th>

                    </th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-rowData>
                <tr [pSelectableRow]="rowData" styleClass="p-0" [pContextMenuRow]="rowData">
                    <td *ngFor="let item of gridLecturas.cols" [width]="item.width">
                        <span class="p-column-title">{{item.label}}</span>
                        <span class="fontsizesm">{{rowData[item.field]}}</span>
                    </td>
                    <td> 
                        <button class="btn btn-outline-primary" (click)="selectedLecto=rowData; setupStateItems(rowData); menu.toggle($event)"> <span class="fa fa-bars"></span> </button>                    
                    </td>
                </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage" let-columns>
                <tr>
                    <td [attr.colspan]="gridLecturas.cols?.length+1">
                        <span class="text-muted">No hay registros</span>
                    </td>
                </tr>
            </ng-template>
        </p-table>
        </div>

        <div *ngIf="isModalVisible">
            <p-dialog header="Registrar lectura de medidor" [modal]="true" [style]="{width: '70vw'}"
                        [closeOnEscape]="true"
                        [autoZIndex]="false"
                        [(visible)]="isModalVisible">

                    <app-crealectomedsm [mdgid]="numed"
                    (evSaved)="onLecturaSaved()"
                    (evClosed)="onCancelCreaLect()"></app-crealectomedsm>                    
            </p-dialog>
        </div>

        <div *ngIf="isModalPagosVisible">
            <p-dialog header="Registrar pago medidor" [modal]="true" [style]="{width: '95vw'}"
                        [closeOnEscape]="true"
                        [autoZIndex]="false"
                        [(visible)]="isModalPagosVisible">

                <div class="row" role="alert">
                    <div class="col-md-8">
                        <div class="table-responsive mt-2">
                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th>

                                    </th>
                                    <th scope="col">
                                        <div class="fontsizesm">Fecha Registro</div>
                                    </th>
                                    <th scope="col">
                                        <div class="fontsizesm">Año</div>
                                    </th>
                                    <th scope="col">
                                        <div class="fontsizesm">Mes</div>
                                    </th>
                                    <th scope="col">
                                        <div class="fontsizesm">Lectura</div>
                                    </th>
                                    <th scope="col">
                                        <div class="fontsizesm">Anterior</div>
                                    </th>
                                    <th scope="col">
                                        <div class="fontsizesm">Consumo</div>
                                    </th>                            
                                </tr>
                                </thead>
                                <tbody>
                                <ng-container *ngFor="let fila of lecturaspend">
                                    <tr [ngClass]="{'table-primary':fila.marcado}">
                                        <td class="hand" (click)="fila.marcado=!fila.marcado; updateLectoidsPagar();">
                                            <span class="far {{fila.marcado?'fa-check-square':'fa-square'}} "></span>                                    
                                        </td>
                                        <td>
                                            <div class="fontsizenr">{{fila.lmd_fechacrea}}</div>
                                        </td>
                                        <td>
                                            <div class="fontsizenr">{{fila.lmd_anio}}</div>
                                        </td>
                                        <td>
                                            <div class="fontsizenr">{{fila.mes_nombre}}</div>
                                        </td>
                                        <td>
                                            <div class="fontsizenr">{{fila.lmd_valor}} m<sup>3</sup></div>
                                        </td>
                                        <td>
                                            <div class="fontsizenr">{{fila.lmd_valorant}} m<sup>3</sup></div>
                                        </td>
                                        <td>
                                            <div class="fontsizenr">{{fila.lmd_consumo}} m<sup>3</sup></div>
                                        </td>                                
                                    </tr>
                                </ng-container>
                                </tbody>
                            </table>
                        </div>
                        <div class="alert alert-warning" role="alert">
                            {{msgpagospend}}
                        </div>

                        <div class="alert alert-info" *ngIf="datoscontrato.cna_teredad">
                            <span class="fa fa-info-circle"></span>
                            <span> Aplica descuento tercera edad </span>
                        </div>
                
                        <div class="alert alert-info" *ngIf="datoscontrato.cna_discapacidad">
                            <span class="fa fa-info-circle"></span>
                            <span> Aplica descuento discapacidad </span>
                        </div>

                    </div> 
                    <div class="col-md">
                        <app-facturagua [lectoids]="lectoidspagar" 
                        [codmed]="numed"
                            (evSaved) = "onFacturaSaved()" 
                            (evCancel)="onFacturaCancel()"></app-facturagua>
                        </div> 
                    </div>
            </p-dialog>
        </div>   
        
        <div *ngIf="isShowFact">
            <p-dialog header="Detalles del documento" [modal]="true" [style]="{width: '90vw'}" [baseZIndex]="10000"
                    [(visible)]="isShowFact">
                <app-facturaview [trncod]="selectedLecto.trn_codigo" (evBtnClosed)="closeDetFact()"></app-facturaview>
            </p-dialog>
        </div>

    </div>
    `,
    styles: [`
    :host ::ng-deep .lecto-pend {
        background-color: #ffa500 !important;
    }

    :host ::ng-deep .lecto-reg {
        background-color: #3cb371 !important;
    }
`]
})
export class LecturasmedComponent extends BaseComponent implements OnInit {
    @Input() numed: number = 0;
    gridLecturas: any = { data: [], cols: [] };
    isModalVisible = false;
    isModalPagosVisible = false;
    isShowFact = false;
    form: any = {};
    msgpagospend = '';
    items: MenuItem[];
    lecturaspend: Array<any> = [];
    selectedLecto: any;
    lectoidspagar: Array<any> = [];
    datoscontrato: any = {};

    datalecto: any = null;

    constructor(private lectoMedServ: LectomedaguaService,
        protected swalService: SwalService,
        private cobroAguaServ: CobroaguaService,
        private loadingServ: LoadingUiService,
        private asientoService: AsientoService,
        protected ctes: CtesAguapService) {
        super();
    }

    onContextMenu(ev: any) {
        this.setupStateItems(ev.data);
    }

    clearGrid() {
        this.gridLecturas = { data: [], cols: [] };
    }

    loadGrid() {
        this.turnOnLoading();
        this.lectoMedServ.listar(this.numed).subscribe(res => {
            this.turnOffLoading();
            if (this.isResultOk(res)) {
                this.gridLecturas = res.lecturas;
            }
        });
    }

    ngOnInit() {
        this.clearGrid();
        this.loadGrid();
        this.items = [
            { label: 'Anular Lectura', icon: 'pi pi-fw pi-trash', command: () => this.anulaLecto(this.selectedLecto) },
            { label: 'Imprimir factura', icon: 'pi pi-fw pi-print', command: () => this.imprimirFactura(this.selectedLecto) },
            { label: 'Anular Pago', icon: 'pi pi-fw pi-times-circle', command: () => this.anulaPago(this.selectedLecto) },
            { label: 'Ver factura', icon: 'pi pi-fw pi-eye', command: () => this.verFactura() }
        ];
    }

    setupStateItems(lecto) {
        this.items.forEach((item) => { item.disabled = false });

        if (lecto.trn_codigo === 0) {
            this.items[1].disabled = true;
            this.items[2].disabled = true;
            this.items[3].disabled = true;
        }
    }

    verFactura() {
        this.isShowFact = true;
    }

    anulaLecto(lecto: any) {
        this.swalService.fireDialog(this.ctes.msgSureWishAnulRecord).then(confirm => {
            if (confirm.value) {
                const formlectoremove = { lmd_id: lecto.lmd_id };
                this.lectoMedServ.anular(formlectoremove).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadGrid();
                    }
                });
            }
        });
    }

    loadLecturasPend() {
        this.msgpagospend = '';
        this.isModalPagosVisible = false;
        this.lectoidspagar = [];
        this.datoscontrato = {};

        this.lectoMedServ.getLecturasPend(this.numed).subscribe(resLecto => {
            if (this.isResultOk(resLecto)) {
                this.lecturaspend = resLecto.lectopends;
                this.lecturaspend.forEach(el => {
                    el.marcado = true;
                });
                this.datoscontrato = resLecto.contrato;
                if (resLecto.haspagospend) {
                    this.updateLectoidsPagar();
                    this.swalService.fireToastWarn(resLecto.msg);
                    this.msgpagospend = resLecto.msg;
                    this.isModalPagosVisible = true;
                }
                else {
                    this.swalService.fireToastSuccess(resLecto.msg);
                }
            }
        });
    }

    showModalCrea() {
        this.isModalVisible = true;
    }

    showModalCobra() {
        this.loadLecturasPend();
    }

    imprimirFactura(lecto: any) {
        if (lecto.trn_codigo) {
            this.cobroAguaServ.getDetallesPago(lecto.trn_codigo).subscribe(res => {
                if (this.isResultOk(res)) {
                    const params = res.datospago.pg_json_obj;
                    params.trncod = lecto.trn_codigo;
                    this.asientoService.imprimirComproAgua(params);
                }
            });
        }
        else {
            this.swalService.fireError('No hay cobro no se puede imprimir factura');
        }
    }

    anulaPago(lecto: any) {
        if (lecto.pg_id > 0) {
            this.swalService.fireDialog(this.ctes.msgSureWishAnulRecord).then(confirm => {
                if (confirm.value) {
                    this.loadingServ.publishBlockMessage();
                    this.cobroAguaServ.anular(lecto.pg_id).subscribe(res => {
                        if (this.isResultOk(res)) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadGrid();
                        }
                    });
                }
            });
        }
    }

    onLecturaSaved() {
        this.isModalVisible = false;
        this.loadGrid();
    }

    onCancelCreaLect() {
        this.isModalVisible = false;
    }

    updateLectoidsPagar() {
        this.lectoidspagar = [];
        const lecturaspagar = this.lecturaspend.filter(lecto => lecto.marcado);
        if (lecturaspagar.length === 0) {
            this.swalService.fireToastError('Debe seleccionar al menos una lectura para realizar el pago');
        }
        this.lectoidspagar = this.cobroAguaServ.getIds(lecturaspagar);
    }

    onFacturaSaved() {
        this.isModalPagosVisible = false;
        this.loadGrid();
    }

    onFacturaCancel() {
        this.isModalPagosVisible = false;
    }

    closeDetFact() {
        this.isShowFact = false;
    }

}
