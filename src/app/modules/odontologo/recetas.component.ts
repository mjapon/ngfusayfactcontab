import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RecetaService} from '../../services/receta.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {PersonaService} from '../../services/persona.service';
import {SwalService} from '../../services/swal.service';
import {DomService} from '../../services/dom.service';

@Component({
    selector: 'app-recetas',
    template: `
        <div>
            <div *ngIf="showForm" class="mb-3">
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <div class="card border-success">
                            <div class="card-header">
                                <span class="fw-bold">
                                    {{form.rec_id > 0 ? 'Editar receta' : 'Crear receta'}}
                                </span>
                            </div>
                            <div class="card-body">
                                <div class="d-flex flex-column" *ngIf="form.rec_id===0"><span>Recetado por:</span>
                                    <div class="p-fluid">
                                        <p-dropdown [options]="medicos" [showClear]="true"
                                                    placeholder="Seleccione el/la profesional a cargo" filter="true"
                                                    (onChange)="onMedicoChange($event)" optionLabel="nomapel"
                                                    optionValue="per_id" [(ngModel)]="form.med_id"></p-dropdown>
                                    </div>
                                </div>
                                <div class="mt-2 d-flex flex-column"><span>Receta:</span>
                                    <div class="p-fluid">
                                        <textarea class="form-control" [(ngModel)]="form.rec_receta"
                                                  rows="8" id="recetaTA">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="mt-2 d-flex flex-column"><span>Indicaciones:</span>
                                    <div class="p-fluid">
                                        <textarea class="form-control" [(ngModel)]="form.rec_indicaciones"
                                                  rows="8">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="mt-2 d-flex flex-column"><span>Recomendaciones:</span>
                                    <div class="p-fluid">
                                        <textarea class="form-control" [(ngModel)]="form.rec_recomdciones"
                                                  rows="3">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="d-flex justify-content-around">
                                    <button class="btn btn-outline-primary" (click)="guardar()"><i
                                            class="fa-solid fa-floppy-disk"></i> Guardar
                                    </button>
                                    <button class="btn btn-outline-dark" (click)="cancelar()"><i
                                            class="fa-solid fa-xmark"></i> Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="row">
                    <div class="col-md-10">
                        <div class="card">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" *ngFor="let receta of recetas">
                                    <div>
                                        <span class="text-muted">{{receta.rec_fechacrea}}</span></div>
                                    <div class="row">
                                        <div class="col-md-6 d-flex flex-column"><span class="text-muted">Receta:</span>
                                            <p style="white-space: pre-line">{{receta.rec_receta}}</p>
                                        </div>
                                        <div class="col-md-6 d-flex flex-column"><span
                                                class="text-muted">Indicaciones:</span>
                                            <p style="white-space: pre-line">{{receta.rec_indicaciones}}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-10">
                                            <div class="d-flex flex-column" *ngIf="receta.rec_recomdciones">
                                                <span class="text-muted">Recomendaciones:</span>
                                                <p>{{receta.rec_recomdciones}}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-2 d-flex flex-column justify-content-end">
                                            <div class="d-flex flex-row-reverse">
                                                <button class="ms-2 btn btn-outline-dark btn-sm"
                                                        (click)="imprimir(receta)"
                                                        title="Imprimir">
                                                    <i class="fa fa-print"></i>
                                                </button>
                                                <button class="ms-2 btn btn-outline-dark btn-sm"
                                                        (click)="anular(receta)"
                                                        title="Anular ">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                                <button class="ms-2 btn btn-outline-dark btn-sm"
                                                        (click)="editar(receta)"
                                                        title="Editar ">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="card-body" *ngIf="recetas.length===0">
                                <div class="pt-5 pb-5">
                                    <h4 class="text-muted">No hay registros</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2" *ngIf="!showForm">
                        <button class="btn btn-outline-primary" (click)="loadForm()">Crear <i
                                class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
        </div>      `
})
export class RecetasComponent implements OnInit, OnChanges {
    @Input() codPaciente: number;

    recetas: Array<any>;
    form: any;
    medicos: Array<any>;
    showForm: boolean;

    constructor(private recetaServ: RecetaService,
                private personServ: PersonaService,
                private domService: DomService,
                private swalServ: SwalService,
                private loadingServ: LoadingUiService) {

    }

    ngOnInit(): void {
        this.recetas = [];
        this.medicos = [];
        this.form = {};
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pacchange = changes.codPaciente;
        const codcurrentvalue = pacchange.currentValue;
        if (codcurrentvalue !== null) {
            this.loadRecetas();
        }
    }

    loadRecetas() {
        this.loadingServ.publishBlockMessage();
        this.recetaServ.listar(this.codPaciente).subscribe(res => {
            if (res.status === 200) {
                this.recetas = res.items;
            }
        });
    }

    loadForm() {
        this.showForm = true;
        this.recetaServ.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.form.pac_id = this.codPaciente;
                this.domService.setFocusTm('recetaTA', 100);
            }
        });
        this.personServ.listarMedicos(2).subscribe(resm => {
            if (resm.status === 200) {
                this.medicos = resm.medicos;
                if (this.medicos.length > 0) {
                    this.form.med_id = this.medicos[0].per_id;
                }
            }
        });
    }

    guardar() {
        if (this.form.rec_receta.trim().length === 0) {
            this.swalServ.fireToastError('Por favor ingrese la receta');
        } else if (this.form.rec_indicaciones.trim().length === 0) {
            this.swalServ.fireToastError('Por favor ingrese las indicaciones de la receta');
        } else {
            this.recetaServ.guardar(this.form).subscribe(res => {
                if (res.status === 200) {
                    this.swalServ.fireToastSuccess(res.msg);
                    this.loadRecetas();
                    this.showForm = false;
                    this.imprimir({rec_id: res.rec_id});
                }
            });
        }
    }

    anular(row) {
        this.swalServ.fireDialog('¿Seguro que desea anular esta receta?').then(confirm => {
                if (confirm.value) {
                    this.recetaServ.anular(row).subscribe(res => {
                        if (res.status === 200) {
                            this.swalServ.fireToastSuccess(res.msg);
                            this.loadRecetas();
                        }
                    });
                }
            }
        );
    }

    editar(row) {
        this.loadingServ.publishBlockMessage();
        this.personServ.listarMedicos(2).subscribe(resm => {
            if (resm.status === 200) {
                this.medicos = resm.medicos;
                this.form = row;
                this.showForm = true;
            }
        });
    }


    cancelar() {
        this.showForm = false;
    }

    onMedicoChange($event: any) {

    }

    imprimir(receta: any) {
        this.recetaServ.imprimir(receta.rec_id);
    }
}
