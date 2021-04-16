import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {MenuItem, TreeNode} from 'primeng/api';
import {DomService} from '../../../services/dom.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {SwalService} from '../../../services/swal.service';

@Component({
    selector: 'app-planctaslist',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <p-contextMenu #cm [model]="itemsMenu"></p-contextMenu>
                <div class="row">
                    <div class="col-md-8">
                        <h4 class="ml-2">Plan de cuentas</h4>
                    </div>
                    <div class="col-md-4 d-flex flex-row-reverse">
                        <button class="btn btn-outline-primary" (click)="contractAll()" title="Contraer Todo">
                            <i class="fas fa-angle-double-up"></i>
                        </button>
                        <button class="btn btn-outline-primary mr-1" (click)="expandAll()" title="Expandir Todo">
                            <i class="fas fa-angle-double-down"></i>
                        </button>
                        <button class="btn btn-outline-primary mr-1" (click)="loadPlanCuentas()" title="Actualizar">
                            <i class="fas fa-sync"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-2">
                    <p-tree [value]="planctas" selectionMode="single" [(selection)]="selectedPlan"
                            (dblclick)="toggleExpand($event)"
                            (onNodeSelect)="onNodeSelect($event)" [contextMenu]="cm"></p-tree>
                </div>
            </div>

            <div *ngIf="isShowDet">
                <p-dialog header="Detalles de la cuenta contable" [style]="{width: '50vw'}" [autoZIndex]="false"
                          [modal]="true"
                          [closeOnEscape]="true"
                          [(visible)]="isShowDet">
                    <div *ngIf="isLoadingDet">
                        <app-loading></app-loading>
                    </div>
                    <div *ngIf="!isLoadingDet">
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-bold"> Código: </span>
                            </div>
                            <div class="col-md-8">
                                {{datosCtaContable.ic_code}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-bold"> Cuenta padre: </span>
                            </div>
                            <div class="col-md-8">
                                {{datosCtaContable.padre}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-bold"> Nombre: </span>
                            </div>
                            <div class="col-md-8">
                                {{datosCtaContable.ic_nombre}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-bold"> Clase: </span>
                            </div>
                            <div class="col-md-8">
                                {{datosCtaContable.ic_clasecc}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-bold"> Observacion: </span>
                            </div>
                            <div class="col-md-8">
                                <p style="white-space: pre-line">
                                    {{datosCtaContable.ic_nota}}
                                </p>
                            </div>
                        </div>
                        <div class="text-center pt-3">
                            <button class="btn btn-outline-secondary" (click)="cerrarVerDet()"><i
                                    class="fa fa-times"></i> Cerrar
                            </button>
                        </div>
                    </div>
                </p-dialog>
            </div>
            <div *ngIf="isShowCrearPlanCta">
                <p-dialog [header]="titlecreaedit" [style]="{width: '50vw'}" [autoZIndex]="false"
                          [modal]="true"
                          [closeOnEscape]="true"
                          [(visible)]="isShowCrearPlanCta">
                    <div *ngIf="isLoadingForm">
                        <app-loading></app-loading>
                    </div>
                    <div *ngIf="!isLoadingForm">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-4">
                                        <span class="font-weight-bold">Cuenta padre:</span>
                                    </div>
                                    <div class="col-md-8">
                                        <input type="text" class="form-control" disabled
                                               [(ngModel)]="selectedPlan.label" *ngIf="!editandoCta">
                                        <input type="text" class="form-control" disabled [(ngModel)]="formCrea.padre"
                                               *ngIf="editandoCta">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <span class="font-weight-bold"> Código: </span>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="d-flex" *ngIf="!editandoCta">
                                            <input type="text" class="form-control" disabled
                                                   [(ngModel)]="formCrea.ic_code_padre">
                                            <input type="text" class="form-control" [(ngModel)]="formCrea.sec">
                                        </div>
                                        <div *ngIf="editandoCta">
                                            <input type="text" class="form-control" disabled
                                                   [(ngModel)]="formCrea.ic_code">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <span class="font-weight-bold">Nombre:</span>
                                    </div>
                                    <div class="col-md-8">
                                        <input type="text" id="cta_ic_nombre" class="form-control"
                                               (keyup)="$event.target.value=$event.target.value.toUpperCase()"
                                               autocomplete="false"
                                               [(ngModel)]="formCrea.ic_nombre">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <span class="font-weight-bold">Clase:</span>
                                    </div>
                                    <div class="col-md-8">
                                        <input type="text" class="form-control" maxlength="2"
                                               [(ngModel)]="formCrea.ic_clasecc">
                                    </div>
                                </div>
                                <div class="row" *ngIf="editandoCta">
                                    <div class="col-md-4">
                                        <span class="font-weight-bold">Alias:</span>
                                    </div>
                                    <div class="col-md-8">
                                        <input type="text" class="form-control" maxlength="80"
                                               [(ngModel)]="formCrea.ic_alias">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <span class="font-weight-bold">Observación:</span>
                                    </div>
                                    <div class="col-md-8">
                                        <textarea class="form-control" id="obsInput" maxlength="800"
                                                  [(ngModel)]="formCrea.ic_nota" rows="5"></textarea>
                                    </div>
                                </div>
                                <div class="text-center pt-3">
                                    <button class="btn btn-outline-primary mr-2" (click)="guardarCta()"><i
                                            class="fa fa-save"></i> Guardar
                                    </button>
                                    <button class="btn btn-outline-secondary" (click)="cancelarCrearCta()"><i
                                            class="fa fa-times"></i> Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </p-dialog>
            </div>
        </div>
    `
})
export class PlanctaslistComponent implements OnInit {

    planctas: TreeNode[];
    isLoading = true;
    filtro: any;
    selectedPlan: TreeNode;
    itemsMenu: MenuItem[];
    isShowCrearPlanCta = false;
    isShowDet = false;
    formCrea: any = {};
    padreexp = 0;

    isLoadingForm = false;
    isLoadingDet = false;
    datosCtaContable: any = {};
    titlecreaedit: string;
    editandoCta = false;
    selectedPlanDbdata: any;

    constructor(private artService: ArticuloService,
                private domService: DomService,
                private swalService: SwalService,
                private loadingUiService: LoadingUiService) {

    }

    ngOnInit() {
        this.loadPlanCuentas();
        this.loadContextMenu();
    }

    loadPlanCuentas() {
        this.isLoading = true;
        this.artService.getRaizPlanCuentas(this.padreexp).subscribe(res => {
            this.isLoading = false;
            if (res.status === 200) {
                this.planctas = res.tree;
            }
        });
    }

    loadContextMenu() {
        this.itemsMenu = [
            {label: 'Crear subcuenta', icon: 'fa fa-plus', command: (event => this.creaSubCuenta(event))},
            {label: 'Anular', icon: 'fa fa-trash', command: (event => this.anularCuenta(event))},
            {label: 'Editar', icon: 'fa fa-edit', command: (event => this.editarCuenta(event))},
            {label: 'Ver', icon: 'fa fa-eye', command: (event => this.verCuenta(event))}
        ];
    }

    creaSubCuenta($event) {
        this.editandoCta = false;
        this.titlecreaedit = 'Crear cuenta contable';
        this.isShowCrearPlanCta = true;
        this.isLoadingForm = true;
        this.setCodCtaContableSel();
        this.loadingUiService.publishBlockMessage();
        this.artService.getFormPlanCuenta(this.padreexp).subscribe(res => {
            this.isLoadingForm = false;
            if (res.status === 200) {
                this.domService.setFocusTimeout('cta_ic_nombre', 100);
                this.formCrea = res.form;
            }
        });
    }

    setCodCtaContableSel() {
        this.selectedPlanDbdata = this.selectedPlan['dbdata'];
        this.padreexp = this.selectedPlanDbdata.ic_id;
    }

    anularCuenta($event) {
        this.setCodCtaContableSel();
        if (this.selectedPlanDbdata.ic_padre) {
            const nombreProd = this.selectedPlanDbdata.ic_nombre;
            const msg = `¿Seguro que desea eliminar ${nombreProd} ?`;
            this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.loadingUiService.publishBlockMessage();
                    this.artService.anularCtaContable(this.padreexp).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadPlanCuentas();
                        }
                    });
                }
            });
        } else {
            this.swalService.fireError('No es posible anular esta cuenta');
        }
    }

    editarCuenta($event) {
        this.setCodCtaContableSel();
        if (this.selectedPlanDbdata.ic_padre) {
            this.isShowCrearPlanCta = true;
            this.titlecreaedit = 'Editar cuenta contable';
            this.editandoCta = true;

            this.artService.getDetCtaContable(this.padreexp).subscribe(res => {
                this.isLoadingDet = false;
                if (res.status === 200) {
                    this.formCrea = res.datoscta;
                }
            });
        } else {
            this.swalService.fireError('No es posible editar esta cuenta');
        }
    }

    verCuenta($event) {
        this.isShowDet = true;
        this.isLoadingDet = true;
        this.setCodCtaContableSel();
        this.artService.getDetCtaContable(this.padreexp).subscribe(res => {
            this.isLoadingDet = false;
            if (res.status === 200) {
                this.datosCtaContable = res.datoscta;
            }
        });
    }

    onNodeSelect($event: any) {

    }

    cancelarCrearCta() {
        this.isShowCrearPlanCta = false;
    }

    cerrarVerDet() {
        this.isShowDet = false;
    }

    guardarCta() {
        this.loadingUiService.publishBlockMessage();
        this.artService.crearCtaContable(this.formCrea).subscribe(res => {
            this.loadingUiService.publishUnblockMessage();
            if (res.status === 200) {
                this.loadingUiService.publishUnblockMessage();
                this.swalService.fireToastSuccess(res.msg);
                this.isShowCrearPlanCta = false;
                this.loadPlanCuentas();
            }
        });
    }

    expandAll() {
        this.planctas.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    contractAll() {
        this.planctas.forEach(node => {
            this.expandRecursive(node, false);
        });
    }

    expandRecursive(node: TreeNode, isExpanded: boolean) {
        node.expanded = isExpanded;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpanded);
            });
        }
    }

    toggleExpand($event: MouseEvent) {
        if (this.selectedPlan) {
            this.selectedPlan.expanded = !this.selectedPlan.expanded;
        }
    }
}
