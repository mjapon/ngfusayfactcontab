import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OdatencionesService} from '../../services/odatenciones.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {SwalService} from '../../services/swal.service';
import {DomService} from '../../services/dom.service';
import { Dialog } from 'primeng/dialog';
import { CitasMedicasService } from 'src/app/services/citas-medicas.service';

@Component({
    selector: 'app-odatenciones',
    styles: [`
        .texto {
            white-space: pre-wrap;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 2.8em; /* Fallback for browsers that don't support -webkit-line-clamp */
        }
        .col-5 {
            width: 5%;
        }
        .col-15 {
            width: 15%;
        }
        .col-30 {
            width: 30%;
        }
        .col-40 {
            width: 40%;
        }
        .col-auto {
            width: auto;}
        .texto-completo {
            white-space: pre-wrap;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-row {
            margin-bottom: 1rem;
        }
        .edit-textarea {
            width: 100%;
            min-height: 120px;
            margin-top: 0.5rem;
        }
    `],
    template: `
        <div>
            <div *ngIf="codPaciente>0" class="mt-3">
                <div class="d-flex">
                    <h5 *ngIf="anteriones.length>0" class="me-5"><i class="fa fa-history"></i>
                        Atenciones Realizadas <span
                                class="badge badge-pill badge-primary">{{ anteriones.length }}</span>
                    </h5>
                    <button class="btn btn-outline-primary" (click)="showFormCrear()"> Crear <i
                            class="fa-solid fa-plus"></i></button>
                </div>
                <h5 class="text-muted" *ngIf="anteriones.length===0">
                    No registra atenciones
                </h5>

                <!-- Table section -->
                <div class="mt-4 border shadow shadow-sm">
                    <p-table [value]="anteriones" [tableStyle]="{ 'min-width': '50rem' }"
                             [paginator]="true"
                             [rows]="5"
                             *ngIf="anteriones.length>0">
                        <ng-template pTemplate="header">
                            <tr>
                                <th style="width: 5%">Nro</th>
                                <th style="width: 15%">Día</th>
                                <th style="width: 30%">Motivo</th>
                                <th style="width: 40%">Procedimientos</th>
                                <th style="width: 10%"></th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-row>
                            <tr (dblclick)="ver(row)">
                                <td>{{ row.ate_nro }}</td>
                                <td>{{ row.ate_fechacrea }}</td>
                                <td>
                                    <div class="texto">{{ row.ate_diagnostico }}</div>
                                </td>
                                <td>
                                    <div class="texto">{{ row.ate_procedimiento }}</div>
                                </td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-outline-primary" title="Ver"
                                                (click)="ver(row)">
                                            <i class="fa fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-primary" title="Editar"
                                                (click)="editar(row)">
                                            <i class="fa fa-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-primary" title="Anular"
                                                (click)="anular(row)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
            <div *ngIf="!(codPaciente>0)">
                <h4 class="text-muted"> Favor registre primero los datos del paciente </h4>
            </div>

            <!-- Create new record dialog -->
            <p-dialog
                header="Registrar nueva atención"
                [(visible)]="showform"
                [modal]="true"
                [style]="{width: '50vw'}"
                [draggable]="false"
                [resizable]="false">
                <div class="p-1">
                    <div class="row dato-fila">
                        <div class="col-12">
                            <div class="detail-label">Motivo:</div>
                            <textarea
                                class="form-control edit-textarea"
                                id="newMotivoAten"
                                appCharacterCount
                                [(ngModel)]="form.ate_diagnostico"
                                maxlength="2000">
                            </textarea>
                        </div>
                    </div>
                    <div class="row dato-fila mt-3">
                        <div class="col-12">
                            <div class="detail-label">Procedimiento realizado:</div>
                            <textarea
                                class="form-control edit-textarea"
                                appCharacterCount
                                [(ngModel)]="form.ate_procedimiento"
                                maxlength="2000">
                            </textarea>
                        </div>
                    </div>

                    <div class="row dato-fila mt-3">
                        <div class="col-12">
                            <div class="detail-label">Diagnóstico:</div>
                        </div>
                        <div class="col-12">
                            <p-dropdown [options]="ciedataArray"
                                        [(ngModel)]="form.cta_id"
                                        [virtualScroll]="true"
                                        [virtualScrollItemSize]="50"
                                        appendTo="body"
                                        placeholder="Seleccione o busque la enfermedad diagnosticada"
                                        [showClear]="true"
                                        [style]="{width:'100%', overflow:'visible'}"
                                        filter="true"
                                        optionLabel="ciekeyval"
                                        optionValue="cie_id"
                                        styleClass="p-fluid"></p-dropdown>
                        </div>
                    </div>

                </div>
                <ng-template pTemplate="footer">
                    <div class="d-flex gap-2 justify-content-end">
                        <button class="btn btn-outline-primary" (click)="guardar()">
                            <i class="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                        <button class="btn btn-outline-secondary" (click)="cancelar()">
                            <i class="fa-solid fa-xmark"></i> Cancelar
                        </button>
                    </div>
                </ng-template>
            </p-dialog>

            <!-- Add the dialog component -->
            <p-dialog
                header="Detalles de la atención"
                [(visible)]="displayModal"
                [modal]="true"
                [style]="{width: '50vw'}"
                [draggable]="false"
                [resizable]="false">
                <div *ngIf="selectedAtencion">
                    <div class="detail-row">
                        <div class="detail-label">Fecha:</div>
                        <div>{{selectedAtencion.ate_fechacrea}}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Motivo:</div>
                        <div class="texto-completo">{{selectedAtencion.ate_diagnostico}}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Procedimiento:</div>
                        <div class="texto-completo">{{selectedAtencion.ate_procedimiento}}</div>
                    </div>
                    <div class="detail-row" *ngIf="selectedAtencion.cta_id">
                        <div class="detail-label">Diagnóstico:</div>
                        <div class="texto-completo">{{selectedAtencion.cie_key}}-{{selectedAtencion.cie_valor}}</div>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <button class="btn btn-outline-secondary" (click)="displayModal = false">
                        <i class="fa fa-times"></i> Cerrar
                    </button>
                </ng-template>
            </p-dialog>

            <!-- Add the edit dialog -->
            <p-dialog
                header="Editar Atención"
                [(visible)]="displayEditModal"
                [modal]="true"
                [style]="{width: '50vw'}"
                [draggable]="false"
                [resizable]="false">
                <div *ngIf="editingAtencion">
                    <div class="detail-row">
                        <div class="detail-label">Fecha:</div>
                        <div>{{editingAtencion.ate_fechacrea}}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Motivo:</div>
                        <textarea
                            class="form-control edit-textarea"
                            [(ngModel)]="editingAtencion.ate_diagnostico"
                            appCharacterCount
                            maxlength="2000">
                        </textarea>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Procedimiento:</div>
                        <textarea
                            class="form-control edit-textarea"
                            [(ngModel)]="editingAtencion.ate_procedimiento"
                            appCharacterCount
                            maxlength="2000">
                        </textarea>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <div class="d-flex gap-2 justify-content-end">
                        <button class="btn btn-outline-primary" (click)="guardarEdicion()">
                            <i class="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                        <button class="btn btn-outline-secondary" (click)="cancelarEdicion()">
                            <i class="fa fa-times"></i> Cancelar
                        </button>
                    </div>
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class OdatencionesComponent implements OnInit, OnChanges {
    @Input() codPaciente: number;
    anteriones: Array<any>;
    form: any;
    showform: boolean;
    displayModal = false;
    selectedAtencion: any = null;
    displayEditModal = false;
    editingAtencion: any = null;
    originalAtencion: any = null;
    ciedataArray: Array<any>;

    constructor(private atencionesServ: OdatencionesService,
                private loadinUiService: LoadingUiService,
                private domService: DomService,
                private citasMedicasServ: CitasMedicasService,
                private swalService: SwalService) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const pacchange = changes.codPaciente;
        const codcurrentvalue = pacchange.currentValue;
        if (codcurrentvalue !== null) {
            this.loadAnteriores();
        }
    }

    ngOnInit(): void {
        this.clearForm();
        this.anteriones = [];
        this.auxLoadCiedata();
    }

    auxLoadCiedata() {
        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            if (rescie.status === 200) {
                this.ciedataArray = rescie.cie10data;
            }
        });
    }

    clearForm() {
        this.form = {};
        this.showform = false;
    }

    showFormCrear() {
        this.loadForm();
        this.showform = true;
        setTimeout(() => {
            this.domService.setFocusTm('newMotivoAten', 300);
        }, 100);
    }

    loadForm() {
        this.loadinUiService.publishBlockMessage();
        this.atencionesServ.getForm(this.codPaciente).subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
            }
        });
    }

    loadAnteriores() {
        this.loadinUiService.publishBlockMessage();
        this.atencionesServ.getHistoria(this.codPaciente).subscribe(res => {
            if (res.status === 200) {
                this.anteriones = res.historia;
            }
        });
    }

    guardar() {
        if (!this.form.ate_procedimiento || this.form.ate_procedimiento.trim().length === 0) {
            this.swalService.fireError('Debe ingresar el procedimiento realizado');
            return;
        } else {
            this.loadinUiService.publishBlockMessage();
            this.atencionesServ.crear(this.form).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadAnteriores();
                    this.clearForm();
                }
            });
        }
    }

    ver(atencion: any) {
        this.selectedAtencion = atencion;
        this.displayModal = true;
    }

    editar(atencion: any) {
        this.originalAtencion = atencion;
        this.editingAtencion = { ...atencion };
        this.displayEditModal = true;
    }

    guardarEdicion() {
        if (!this.editingAtencion.ate_procedimiento || this.editingAtencion.ate_procedimiento.trim().length === 0) {
            this.swalService.fireError('Debe ingresar el procedimiento realizado');
            return;
        }

        this.loadinUiService.publishBlockMessage();

        this.atencionesServ.actualizar(this.editingAtencion).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.loadAnteriores();
                this.cancelarEdicion();
            }
        });

    }

    cancelarEdicion() {
        this.editingAtencion = null;
        this.originalAtencion = null;
        this.displayEditModal = false;
    }

    anular(atencion: any) {
        const msg = '¿Confirma que desea anular esta atención?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.loadinUiService.publishBlockMessage();
                this.atencionesServ.anular(atencion.ate_id).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadAnteriores();
                    }
                });
            }
        });
    }

    cancelar() {
        this.clearForm();
    }
}
