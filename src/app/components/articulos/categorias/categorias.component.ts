import {Component, OnInit} from '@angular/core';
import {CategoriasService} from '../../../services/categorias.service';
import {ArticuloService} from '../../../services/articulo.service';
import {SwalService} from '../../../services/swal.service';
import {LoadingUiService} from '../../../services/loading-ui.service';

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
                            <th scope="col">Caja</th>
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
                <p-dialog header="Datos de la categoría" [modal]="true" [style]="{width: '70vw'}" [baseZIndex]="10000"
                          [(visible)]="isModalVisible">
                    <div *ngIf="isformloading">
                        <app-loading></app-loading>
                    </div>
                    <div *ngIf="!isformloading">
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Nombre: </span>
                            </div>
                            <div class="col-md">
                                <input type="text" class="form-control" [(ngModel)]="formcat.catic_nombre">
                            </div>
                        </div>

                        <div class="row mt-2 mb-4">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Caja: </span>
                            </div>
                            <div class="col-md">
                                <p-dropdown [options]="tiposcajas" optionLabel="ic_nombre"
                                            optionValue="ic_id"
                                            placeholder="Seleccione el tipo de caja"
                                            [(ngModel)]="formcat.catic_caja"></p-dropdown>
                            </div>
                        </div>

                        <div class="mt-5 text-center">
                            <button class="btn btn-outline-primary" (click)="doSave()"><i class="fa fa-save"></i>
                                Guardar
                            </button>
                            <button class="ml-3 btn btn-outline-secondary" (click)="cancelSave()"><i
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

    tiposcajas: Array<any>;
    categorias: Array<any>;
    isloading: boolean;
    isModalVisible: boolean;
    formcat: any;

    isformloading: boolean;

    constructor(private categoriaService: CategoriasService,
                private swalService: SwalService,
                private loadingService: LoadingUiService,
                private articuloService: ArticuloService) {
        this.categorias = [];
        this.formcat = {};
    }

    ngOnInit(): void {
        this.categorias = [];
        this.isModalVisible = false;
        this.isloading = false;
        this.loadCategorias();
        this.loadTiposCajas();
    }

    loadTiposCajas() {
        this.articuloService.listarTiposCajas().subscribe(res => {
            if (res.status === 200) {
                this.tiposcajas = res.tiposcajas;
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
                if (this.tiposcajas.length > 0) {
                    this.formcat.catic_caja = this.tiposcajas[0].ic_id;
                }
                this.isModalVisible = true;
            }
        });
    }

    doSave() {
        if (this.formcat.catic_nombre.trim().length === 0) {
            this.swalService.fireToastError('Ingrese el nombre de la categoría');
            return;
        }
        if (this.formcat.catic_caja === 0) {
            this.swalService.fireToastError('Debe seleccionar el tipo de caja');
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
        this.swalService.fireDialog('¿Seguro que desea anular esta categoría?').then(confirm => {
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
