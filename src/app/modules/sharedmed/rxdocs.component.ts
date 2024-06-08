import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RxdocsService} from '../../services/rxdocs.service';
import {DomService} from '../../services/dom.service';
import {SwalService} from '../../services/swal.service';
import {LoadingUiService} from '../../services/loading-ui.service';
import {FautService} from '../../services/faut.service';
import {CitasMedicasService} from '../../services/citas-medicas.service';
import {CtesService} from '../../services/ctes.service';

@Component({
    selector: 'app-rxdocs',
    template: `
        <div>
            <div *ngIf="showForm" class="mb-3">
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <div class="card border-primary">
                            <div class="card-header">
                                <span class="fw-bold">
                                    {{form.rxd_id > 0 ? 'Editar documento' : 'Crear documento'}}
                                </span>
                            </div>
                            <div class="card-body">
                                <div class="mt-2 d-flex flex-column" *ngIf="form.rxd_id===0"><span>Archivo:</span>
                                    <input type="file" id="archivoinput"
                                           accept="image/*,application/pdf, application/msword,
                                                    application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                           class="form-control-file"
                                           (change)="onFileChange($event)"/>

                                </div>
                                <div class="d-flex flex-column mt-3"><span>Nombre:</span>
                                    <div class="p-fluid">
                                        <input type="text" class="form-control"
                                               [(ngModel)]="form.rxd_nombre" id="rxdNombresInput"
                                               autocomplete="false" maxlength="80">
                                    </div>
                                </div>
                                <div class="d-flex flex-column mt-3"><span>Comentario:</span>
                                    <div class="p-fluid">
                                        <textarea class="form-control" [(ngModel)]="form.rxd_nota"
                                                  rows="3" id="rxd_nota" maxlength="3000">
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
                        <div class="row row-cols-3 row-cols-md-3">
                            <div class="col mb-2" *ngFor="let doc of docs">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <div>
                                            <div [title]="doc.rxd_nombre" (click)="descargar(doc)" class="hand">
                                                <i class="far fa-3x" [ngClass]="doc.fa_icon"></i>
                                            </div>
                                            <div class="mt-2 d-flex flex-column justify-content-center">
                                                <h5 class="card-title">{{doc.rxd_nombre}}</h5>
                                                <small class="text-muted">{{doc.rxd_filename}}</small>
                                            </div>
                                            <p class="card-text mt-1">{{doc.rxd_nota}}</p>
                                        </div>
                                        <div>
                                            <div class="mt-2 d-flex justify-content-between">
                                                <p>
                                                    <small class="text-muted">{{doc.rxd_fechacrea}}</small>
                                                </p>
                                                <div>
                                                    <div class="d-flex justify-content-end">
                                                        <div class="d-flex">
                                                            <button class="ms-2 btn btn-sm btn-outline-primary"
                                                                    (click)="descargar(doc)">
                                                                <i class="fa fa-eye"></i>
                                                            </button>
                                                            <button class="ms-2 btn btn-sm btn-outline-primary btn-sm"
                                                                    (click)="editar(doc)"
                                                                    title="Editar ">
                                                                <i class="fa fa-edit"></i>
                                                            </button>
                                                            <button class="ms-2 btn btn-sm btn-outline-primary btn-sm"
                                                                    (click)="anular(doc)"
                                                                    title="Anular ">
                                                                <i class="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card" *ngIf="docs.length===0">
                            <div class="card-body">
                                <div class="pt-5 pb-5">
                                    <h4 class="text-muted">No hay registros</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2" *ngIf="!showForm">
                        <div class="d-grid mt-4 gap-2">
                            <button class="btn btn-outline-primary"
                                    title="Cargar un nuevo examen al sistema"
                                    (click)="loadForm()">Crear <i
                                    class="fa-solid fa-plus"></i></button>
                            <button *ngIf="tipo===1" class="btn btn-outline-dark" (click)="imprimirRecetario()"
                                    title="Imprimir recetario en blanco">Recetario <i
                                    class="fas fa-print"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class RxdocsComponent implements OnInit, OnChanges {
    @Input() codPaciente: number;
    @Input() tipo: number;
    docs: Array<any>;
    form: any;
    showForm: boolean;
    datafile: any;
    filepreview: any;
    base64data: any = null;

    constructor(private rxDocsServ: RxdocsService,
                private domService: DomService,
                private loadingServ: LoadingUiService,
                private fautService: FautService,
                private citasMedicasServ: CitasMedicasService,
                private ctes: CtesService,
                private swalService: SwalService) {
        this.docs = [];
    }

    ngOnInit(): void {
        this.form = {};
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pacchange = changes.codPaciente;
        const codcurrentvalue = pacchange.currentValue;
        if (codcurrentvalue !== null) {
            this.loadDocs();
        }
    }

    guardar() {
        if (this.form.rxd_id === 0 && !this.base64data) {
            this.swalService.fireToastError('Debe cargar el documento');
            return;
        }

        if (!this.form.rxd_nombre) {
            this.swalService.fireToastError('Ingrese el nombre del documento');
            return;
        }

        if (this.form.rxd_id === 0) {
            this.loadingServ.publishBlockMessage();
            this.form.rxd_filename = this.datafile.name;
            const theform = {
                form: this.form,
                archivo: this.base64data
            };
            this.rxDocsServ.crear(theform).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadDocs();
                    this.showForm = false;
                }
            });
        } else {
            this.loadingServ.publishBlockMessage();
            this.rxDocsServ.editar({form: this.form}).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadDocs();
                    this.showForm = false;
                }
            });
        }
    }

    cancelar() {
        this.showForm = false;
    }

    descargar(doc) {
        const url = this.rxDocsServ.getDownloadUrlNode(doc);
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    loadForm() {
        this.form = {};
        this.filepreview = null;
        this.base64data = null;
        this.showForm = true;
        this.rxDocsServ.getForm(this.codPaciente, this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.domService.setFocusTm('rxdNombresInput', 100);
            }
        });
    }

    loadDocs() {
        this.loadingServ.publishBlockMessage();
        if (this.codPaciente) {
            this.rxDocsServ.listar(this.codPaciente, this.tipo).subscribe(res => {
                if (res.status === 200) {
                    this.docs = res.docs;
                }
            });
        }
    }

    anular(doc: any) {
        const msg = '¿Seguro que desea eliminar este documento';
        this.swalService.fireDialog(msg).then(confirm => {
                if (confirm.value) {
                    this.loadingServ.publishBlockMessage();
                    this.rxDocsServ.eliminar(doc.rxd_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadDocs();
                        }
                    });
                }
            }
        );
    }

    editar(doc: any) {
        this.showForm = true;
        this.form = Object.assign({}, doc);
        this.domService.setFocusTm('rxdNombresInput', 100);
    }

    clearFile() {
        this.filepreview = null;
        this.base64data = null;
    }

    preview() {
        const mimeType = this.datafile.type;
        const rega = /image|pdf|document/;
        if (rega.test(mimeType)) {
            const reader = new FileReader();
            reader.readAsDataURL(this.datafile);
            reader.onload = (e) => {
                this.filepreview = reader.result;
                this.base64data = this.filepreview;
            };
        } else {
            this.clearFile();
            this.swalService.fireError('Este tipo de archivo no esta admitido');
        }
    }

    onFileChange(fileInput: any) {
        this.datafile = fileInput.target.files[0];
        if (this.datafile) {
            const length = (this.datafile.size / 1024) / 1024;
            if (length > 10) {
                this.clearFile();
                this.swalService.fireError('El tamaño del archivo es muy grande, elija otro (Tamaño máximo 10MB)');
            } else {
                this.preview();
            }
        }
    }

    imprimirRecetario() {
        this.citasMedicasServ.imprimirRecBlank();
    }

}
