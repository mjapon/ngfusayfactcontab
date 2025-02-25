import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OdatencionesService} from '../../services/odatenciones.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {SwalService} from '../../services/swal.service';
import {DomService} from '../../services/dom.service';

@Component({
    selector: 'app-odatenciones',
    styles: [`
        .texto {
            white-space: pre-wrap;
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
    `],
    template: `
        <div>
            <div *ngIf="codPaciente>0" class="mt-3">
                <div class="d-flex" *ngIf="!showform">
                    <h5 *ngIf="anteriones.length>0" class="me-5"><i class="fa fa-history"></i>
                        Atenciones Realizadas <span
                                class="badge badge-pill badge-primary">{{ anteriones.length }}</span>
                    </h5>
                    <button *ngIf="!showform" class="btn btn-outline-primary" (click)="showFormCrear()"> Crear <i
                            class="fa-solid fa-plus"></i></button>
                </div>
                <h5 class="text-muted" *ngIf="anteriones.length===0 &&!showform">
                    No registra atenciones
                </h5>

                <div *ngIf="showform" class="border mt-3">
                    <div class="ps-5 pe-5 pt-2 pb-2">
                        <h4 class="mt-2 mb-2 text-muted">Registrar nueva atención</h4>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Motivo:</span>
                            </div>
                            <div class="col-12">
                        <textarea class="form-control" id="newMotivoAten" appCharacterCount
                                  [(ngModel)]="form.ate_diagnostico" maxlength="2000">
                        </textarea>
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Procedimiento realizado:</span>
                            </div>
                            <div class="col-12">
                        <textarea class="form-control" appCharacterCount
                                  [(ngModel)]="form.ate_procedimiento" maxlength="2000">
                        </textarea>
                            </div>
                        </div>
                        <div class="mt-3 d-flex justify-content-center">
                            <button class="btn btn-outline-primary" (click)="guardar()"><i
                                    class="fa-solid fa-floppy-disk"></i>
                                Guardar
                            </button>
                            <button class="ms-3 btn btn-outline-dark" (click)="cancelar()"><i
                                    class="fa-solid fa-xmark"></i>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-4 border shadow shadow-sm">
                    <table class="table table-hover table-striped" *ngIf="anteriones.length>0">
                        <thead>
                        <tr>
                            <th scope="col" class="col-5 quitaPaddingTB">Nro</th>
                            <th scope="col" class="col-15 quitaPaddingTB">Día</th>
                            <th scope="col" class="col-30 quitaPaddingTB">Motivo</th>
                            <th scope="col" class="col-40 quitaPaddingTB">Procedimientos</th>
                            <th scope="col" class="col-auto quitaPaddingTB">

                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let row of anteriones">
                            <td>
                                {{ row.ate_nro }}
                            </td>
                            <td>
                                {{ row.ate_fechacrea }}
                            </td>
                            <td>
                                <div class="texto">
                                    {{ row.ate_diagnostico }}
                                </div>
                            </td>
                            <td>
                                <div class="texto">
                                    {{ row.ate_procedimiento }}
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" title="Anular"><i
                                        class="fa fa-trash" (click)="anular(row)"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div *ngIf="!(codPaciente>0)">
                <h4 class="text-muted"> Favor registre primero los datos del paciente </h4>
            </div>
        </div>
    `
})
export class OdatencionesComponent implements OnInit, OnChanges {
    @Input() codPaciente: number;
    anteriones: Array<any>;
    form: any;
    showform: boolean;

    constructor(private atencionesServ: OdatencionesService,
                private loadinUiService: LoadingUiService,
                private domService: DomService,
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
    }

    clearForm() {
        this.form = {};
        this.showform = false;
    }

    showFormCrear() {
        this.loadForm();
        this.showform = true;
        this.domService.setFocusTm('newMotivoAten', 300);
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
