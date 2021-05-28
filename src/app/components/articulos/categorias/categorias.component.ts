import {Component, OnInit} from '@angular/core';
import {CategoriasService} from '../../../services/categorias.service';
import {SwalService} from '../../../services/swal.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {ModelocontabService} from '../../../services/modelocontab.service';
import {CtesService} from '../../../services/ctes.service';

@Component({
    selector: 'app-categorias',
    template: `
        <div>
            <div *ngIf="isloading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isloading">
                <div class="row">
                    <div class="col-md-8">
                        <h4>Categorías</h4>
                    </div>
                    <div class="col-md d-flex flex-row-reverse">
                        <button class="btn btn-outline-primary" (click)="showModalCrear()">Crear <i
                                class="fa fa-plus-circle"></i></button>
                    </div>
                </div>
                <div class="table-responsive mt-1">
                    <table class="table table-bordered table-sm">
                        <thead>
                        <tr>
                            <th scope="col">Código</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Modelo Contable</th>
                            <th>
                                Acción
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let fila of categorias" class="hand">
                            <td>
                                {{fila.catic_id}}
                            </td>
                            <td>
                                {{fila.catic_nombre}}
                            </td>
                            <td>
                                {{fila.caja}}
                            </td>
                            <td>
                                <div *ngIf="fila.catic_id>1">
                                    <button class="btn btn-sm btn-outline-secondary" title="Anular esta categoría"
                                            (click)="anular(fila)"><i class="fa fa-trash"></i></button>
                                    <button class="btn btn-sm btn-outline-secondary" title="Editar esta categoría"
                                            (click)="editar(fila)"><i class="fa fa-edit"></i></button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div *ngIf="isModalVisible">
                <p-dialog header="Datos de la categoría" [modal]="true" [style]="{width: '70vw'}"
                          [closeOnEscape]="true"
                          [autoZIndex]="false"
                          [(visible)]="isModalVisible">
                    <div *ngIf="isformloading">
                        <app-loading></app-loading>
                    </div>
                    <div *ngIf="!isformloading">
                        <div class="row mt-2 mb-4">
                            <div class="col-md-4">
                                <span class="fw-light"> Modelo Contable: </span>
                            </div>
                            <div class="col-md">
                                <p-dropdown [options]="modscontabs" id="icdp_modcontab"
                                            [(ngModel)]="formcat.catic_mc"
                                            optionLabel="mc_nombre" [filter]="false"
                                            optionValue="mc_id" inputId="icdp_modcontab"></p-dropdown>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <span class="fw-light"> Nombre: </span>
                            </div>
                            <div class="col-md">
                                <input type="text" class="form-control" [(ngModel)]="formcat.catic_nombre">
                            </div>
                        </div>

                        <div class="mt-5 text-center">
                            <button class="btn btn-outline-primary" (click)="doSave()"><i class="fa fa-save"></i>
                                Guardar
                            </button>
                            <button class="ms-3 btn btn-outline-secondary" (click)="cancelSave()"><i
                                    class="fa fa-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </p-dialog>
            </div>
        </div>
    `
})
export class CategoriasComponent implements OnInit {
    categorias: Array<any>;
    isloading: boolean;
    isModalVisible: boolean;
    formcat: any;
    modscontabs: Array<any> = [];
    isformloading: boolean;

    constructor(private categoriaService: CategoriasService,
                private swalService: SwalService,
                private ctes: CtesService,
                private modcontabService: ModelocontabService,
                private loadingService: LoadingUiService) {
        this.categorias = [];
        this.formcat = {};
    }

    ngOnInit(): void {
        this.categorias = [];
        this.isModalVisible = false;
        this.isloading = false;
        this.loadCategorias();
        this.loadModelosContables();
    }

    loadModelosContables() {
        this.modcontabService.listar().subscribe(res => {
            if (res.status === 200) {
                this.modscontabs = res.items;
            }
        });
    }

    loadCategorias() {
        this.isloading = true;
        this.categoriaService.listar().subscribe(res => {
            if (res.status === 200) {
                this.categorias = res.items;
            }
            this.isloading = false;
        });
    }

    showModalCrear() {
        this.loadingService.publishBlockMessage();
        this.categoriaService.getFormCrea().subscribe(res => {
            if (res.status === 200) {
                this.formcat = res.form;
                if (this.modscontabs.length > 0) {
                    this.formcat.catic_caja = this.modscontabs[0].mc_id;
                }
                this.isModalVisible = true;
            }
        });
    }

    doSave() {
        if (this.formcat.catic_nombre.trim().length === 0) {
            this.swalService.fireToastError(this.ctes.msgEnterCatName);
            return;
        }
        if (this.formcat.catic_mc === 0) {
            this.swalService.fireToastError(this.ctes.msgMustSelectModContab);
            return;
        }
        if (this.formcat.catic_id > 0) {
            this.categoriaService.actualizar(this.formcat).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.isModalVisible = false;
                    this.loadCategorias();
                }
            });
        } else {
            this.loadingService.publishBlockMessage();
            this.categoriaService.crear(this.formcat).subscribe(res => {
                this.isModalVisible = false;
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadCategorias();
                }
                this.isformloading = false;
            });
        }
    }

    cancelSave() {
        this.isModalVisible = false;
    }

    anular(fila: any) {
        this.swalService.fireDialog(this.ctes.msgSureWishRemoveCat).then(confirm => {
            if (confirm.value) {
                this.categoriaService.anular(fila.catic_id).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadCategorias();
                    }
                });
            }
        });
    }

    editar(fila: any) {
        this.formcat = fila;
        this.isModalVisible = true;
    }
}
