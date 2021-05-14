import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OdatencionesService} from '../../services/odatenciones.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {SwalService} from '../../services/swal.service';
import {DomService} from '../../services/dom.service';

@Component({
    selector: 'app-odatenciones',
    template: `
        <div>
            <div *ngIf="codPaciente>0" class="mt-3">
                <div class="d-flex" *ngIf="!showform">
                    <h5 *ngIf="anteriones.length>0" class="me-5"><i class="fa fa-history"></i>
                        Atenciones Realizadas <span
                                class="badge badge-pill badge-primary">{{anteriones.length}}</span>
                    </h5>
                    <button *ngIf="!showform" class="btn btn-outline-primary" (click)="showFormCrear()"> Crear <i
                            class="fa fa-plus-circle"></i></button>
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
                        <textarea class="form-control" id="newMotivoAten"
                                  [(ngModel)]="form.ate_diagnostico" maxlength="2000">
                        </textarea>
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Procedimiento realizado:</span>
                            </div>
                            <div class="col-12">
                        <textarea class="form-control"
                                  [(ngModel)]="form.ate_procedimiento" maxlength="2000">
                        </textarea>
                            </div>
                        </div>
                        <div class="mt-3 d-flex justify-content-center">
                            <button class="btn btn-outline-primary" (click)="guardar()"><i class="fa fa-save"></i>
                                Guardar
                            </button>
                            <button class="ms-3 btn btn-outline-secondary" (click)="cancelar()"><i
                                    class="fa fa-times"></i>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="border mt-4">
                    <table class="table table-hover" *ngIf="anteriones.length>0">
                        <thead>
                        <tr>
                            <th scope="col" class="quitaPaddingTB">Nro</th>
                            <th scope="col" class="quitaPaddingTB">Día</th>
                            <th scope="col" class="quitaPaddingTB">Motivo</th>
                            <th scope="col" class="quitaPaddingTB">Procedimientos</th>
                            <th scope="col" class="quitaPaddingTB">

                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let row of anteriones">
                            <td width="5%">
                                {{row.ate_nro}}
                            </td>
                            <td width="15%">
                                {{row.ate_fechacrea}}
                            </td>
                            <td width="30%">
                                {{row.ate_diagnostico}}
                            </td>
                            <td width="40%">
                                {{row.ate_procedimiento}}
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
        this.domService.setFocusTimeout('newMotivoAten', 300);
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
