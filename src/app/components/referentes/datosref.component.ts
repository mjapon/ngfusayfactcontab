import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LoadingUiService} from '../../services/loading-ui.service';
import {PersonaService} from '../../services/persona.service';
import {SwalService} from '../../services/swal.service';
import {FechasService} from '../../services/fechas.service';
import {DomService} from '../../services/dom.service';
import {ArrayutilService} from '../../services/arrayutil.service';
import {CatalogosService} from '../../services/catalogos.service';
import {LugarService} from '../../services/lugar.service';
import {forkJoin} from 'rxjs';
import {CtesService} from '../../services/ctes.service';

@Component({
    selector: 'app-datosref',
    styles: [
            `.dato-fila {
            margin: 15px 5px;
        }

        .datopac {
            background: #e2e2e2;
            border-radius: 5px;
            padding-left: 10px;
        }
        `],
    template: `
        <div>
            <div *ngIf="!editando" class="ms-2">
                <div class="row">
                    <div class="col-md-4 d-flex flex-column">
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Ci/RUC/Pasaporte:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_ciruc}}
                            </span>
                        </div>

                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Nombres:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_nombres}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Apellidos:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_apellidos}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2" *ngIf="!isProveedorPacFull()">
                            <span class="text-muted">
                                Fecha de nacimiento:
                            </span>
                            <span class="datopac" *ngIf="datosPacienteFull.per_fechanac">
                                {{datosPacienteFull.per_fechanac}} - <small> {{datosPacienteFull.per_edad.years}}
                                año(s), {{datosPacienteFull.per_edad.months}}
                                mes(es), {{datosPacienteFull.per_edad.days}}
                                dia(s)</small>
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2" *ngIf="!isProveedorPacFull()">
                            <span class="text-muted">
                                Sexo:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.genero}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2" *ngIf="datosmedicos && !isProveedorPacFull()">
                            <span class="text-muted">
                                Tipo de sangre:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.tiposangre}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2" *ngIf="!isProveedorPacFull()">
                            <span class="text-muted">
                                Estado Civil:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.estadocivil}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2" *ngIf="!datosmedicos">
                            <span class="text-muted">
                                Tipo:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.tiporef}}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex flex-column">
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Lugar de residencia:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.residencia}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Dirección:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_direccion}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2" *ngIf="!isProveedorPacFull()">
                            <span class="text-muted">
                                Profesión/Ocupación:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.profesion}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Correo Electrónico:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_email}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Teléfono Convencional:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_telf}}
                            </span>
                        </div>
                        <div class="d-flex flex-column mt-2">
                            <span class="text-muted">
                                Celular:
                            </span>
                            <span class="datopac">
                                {{datosPacienteFull.per_movil}}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="mt-3">
                            <button class="btn btn-outline-secondary" (click)="editar()">
                                <i class="fa fa-edit"></i> Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div *ngIf="editando">
                <div class="row">
                    <div class="col-md">
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span class="required">*</span><span>Ci/RUC/Pasaporte:</span>
                            </div>
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" class="form-control"
                                           [(ngModel)]="paciente.per_ciruc"
                                           (blur)="verificaPacienteRegistrado()" autocomplete="false"
                                           (keydown.enter)="buscarPaciente(false, 'perNombresInput')"
                                           id="perCirucInput">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button"
                                                (click)="buscarPaciente(false, 'perNombresInput')"
                                                title="Presiona este botón para buscar el paciente por numero de cédula, ruc o pasaporte ">
                                            <span class="fa fa-search"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row dato-fila" *ngIf="!datosmedicos">
                            <div class="col-12">
                                <span>Tipo:</span>
                            </div>
                            <div class="col-12">
                                <p-dropdown [options]="tiposRefList" optionLabel="lval_nombre"
                                            placeholder="Seleccione el tipo de referente"
                                            [showClear]="false"
                                            [(ngModel)]="paciente.per_tipo"></p-dropdown>
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span class="required">*</span><span>Nombres:</span>
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control"
                                       [(ngModel)]="paciente.per_nombres" id="perNombresInput"
                                       autocomplete="false">
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Apellidos:</span>
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control"
                                       [(ngModel)]="paciente.per_apellidos"
                                       autocomplete="false">
                            </div>
                        </div>
                        <div class="row dato-fila" *ngIf="!isProveedor()">
                            <div class="col-12">
                                <span>Fecha de nacimiento (dd/mm/aaaa):</span>
                            </div>
                            <div class="col-12">
                                <p-calendar id="per_fechanac"
                                            [(ngModel)]="paciente.per_fechanac"
                                            [showIcon]="true"
                                            inputId="per_fechanac"
                                            [monthNavigator]="true" [yearNavigator]="true"
                                            [maxDate]="currentDate"
                                            (onSelect)="calcularEdad()"
                                            yearRange="1900:2100"
                                            dateFormat="dd/mm/yy"></p-calendar>
                                <span> {{paciente.per_edad.years}} año(s) </span>
                            </div>
                        </div>
                        <div class="row dato-fila" *ngIf="!isProveedor()">
                            <div class="col-12">
                                <span class="required">*</span><span>Sexo:</span>
                            </div>
                            <div class="col-12">
                                <p-radioButton name="sexo" *ngFor="let it of generosList"
                                               value="{{it.lval_valor}}"
                                               label="{{it.lval_nombre}}"
                                               [(ngModel)]="paciente.per_genero"></p-radioButton>
                            </div>
                        </div>
                        <div class="row dato-fila" *ngIf="!isProveedor()">
                            <div class="col-12">
                                <span>Estado Civil:</span>
                            </div>
                            <div class="col-12">
                                <p-dropdown [options]="estadoCivilList" optionLabel="lval_nombre"
                                            placeholder="Seleccione el estado civil"
                                            [showClear]="true"
                                            [(ngModel)]="paciente.per_estadocivil"></p-dropdown>
                            </div>
                        </div>
                        <div class="row dato-fila" *ngIf="datosmedicos">
                            <div class="col-12">
                                <span>Tipo de sangre :</span>
                            </div>
                            <div class="col-12">
                                <p-dropdown [options]="tipoSangreList" optionLabel="lval_nombre"
                                            placeholder="Seleccione el tipo de sangre"
                                            [showClear]="true"
                                            [(ngModel)]="paciente.per_tiposangre"></p-dropdown>
                            </div>
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Lugar de residencia:</span>
                            </div>
                            <div class="col-12">
                                <p-dropdown [options]="lugares" id="catic_id"
                                            [(ngModel)]="paciente.per_lugresidencia"
                                            [virtualScroll]="true"
                                            placeholder="Seleccione el lugar de residencia"
                                            [showClear]="true"
                                            [style]="{width:'100%', overflow:'visible'}"
                                            [filterMatchMode]="'startsWith'"
                                            filter="true"
                                            itemSize="50"
                                            optionLabel="lug_nombre"
                                            inputId="per_lugresidencia"></p-dropdown>
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Dirección:</span>
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control"
                                       [(ngModel)]="paciente.per_direccion"
                                       autocomplete="false" maxlength="80">
                            </div>
                        </div>
                        <div class="row dato-fila" *ngIf="!isProveedor()">
                            <div class="col-12">
                                <span>Profesión/Ocupación:</span>
                            </div>
                            <div class="col-12">
                                <p-dropdown [options]="ocupaciones" id="per_ocupacion"
                                            [(ngModel)]="paciente.per_ocupacion"
                                            [virtualScroll]="true"
                                            placeholder="Seleccione la profesión/ocupación"
                                            [showClear]="true"
                                            [style]="{width:'100%', overflow:'visible'}"
                                            [filterMatchMode]="'contains'"
                                            filter="true"
                                            itemSize="50"
                                            optionLabel="lval_nombre"
                                            inputId="per_ocupacion"></p-dropdown>
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Correo Electrónico:</span>
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control"
                                       [(ngModel)]="paciente.per_email"
                                       autocomplete="false">
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Teléfono Convencial:</span>
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control"
                                       [(ngModel)]="paciente.per_telf"
                                       [autocomplete]="false">
                            </div>
                        </div>
                        <div class="row dato-fila">
                            <div class="col-12">
                                <span>Celular:</span>
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control" [autocomplete]="false"
                                       [(ngModel)]="paciente.per_movil">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-1 d-flex justify-content-center">
                    <button class="btn btn-outline-primary" (click)="guardaDatosPaciente()">
                        <i class="fa fa-save"></i> Guardar
                    </button>
                    <button class="ms-4 btn btn-outline-primary" (click)="cancelarRegistro()"
                            *ngIf="codPaciente===0 || editando">
                        <i class="fa fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
        </div>
    `
})
export class DatosrefComponent implements OnInit, OnChanges {

    @Input() codPaciente: number;
    @Input() datosmedicos = true;

    @Output() pacienteLoaded = new EventEmitter<any>();
    @Output() pacienteSaved = new EventEmitter<any>();
    @Output() creacionCancelada = new EventEmitter<any>();
    @Output() datosIncompletosEv = new EventEmitter<any>();
    paciente: any;
    datosPacienteFull: any;
    estadoCivilList: Array<any>;
    tipoSangreList: Array<any>;
    generosList: Array<any>;
    lugares: Array<any>;
    ocupaciones: Array<any>;
    tiposRefList: Array<any>;
    currentDate = new Date();

    datosIncompletos: boolean;
    editando: boolean;

    constructor(private loadingUiService: LoadingUiService, private personaService: PersonaService,
                private swalService: SwalService, private fechasService: FechasService, private domService: DomService,
                private arrayUtil: ArrayutilService, private catalogosServ: CatalogosService, private ctes: CtesService,
                private lugarService: LugarService) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const pacchange = changes.codPaciente;
        const codcurrentvalue = pacchange.currentValue;
        if (codcurrentvalue !== null) {
            this.loadFormOrData();
        }
    }

    ngOnInit(): void {
        this.datosPacienteFull = {per_edad: {}};
        this.datosIncompletos = false;
        this.paciente = {per_edad: {}};
    }

    isProveedor() {
        return this.paciente ? (this.paciente.per_tipo ? this.paciente.per_tipo.lval_valor === '3' : false) : false;
    }

    isProveedorPacFull() {
        return this.datosPacienteFull ? (this.datosPacienteFull.per_tipo ? this.datosPacienteFull.per_tipo === 3 : false) : false;
    }

    editar() {
        this.editando = true;
        this.loadListasAndSetupForm();
    }

    loadFormOrData() {
        this.editando = false;
        if (this.codPaciente === 0) {
            this.editando = true;
            this.loadListasAndSetupForm();
        } else {
            this.buscarPacientePorCod();
        }
    }

    verificaPacienteRegistrado() {
        if (this.paciente.per_id === 0) {
            this.buscarPaciente(false, this.ctes.perNombresInput);
        }
    }

    logicaDatosIncompletos(showMessage) {
        this.domService.setFocusTm(this.ctes.perNombresInput, 600);
        if (showMessage) {
            this.swalService.fireToastWarn(this.ctes.msgDataIncompleteRef);
        }
    }

    isPersonDataIncomplete(personaDb: any) {
        return !personaDb.per_fechanac || personaDb.per_fechanac.trim().length === 0;
    }

    loadDataPerson(persona: any) {
        this.personaService.loadDataToform(this.paciente, persona);
        if (this.paciente.per_genero) {
            this.paciente.per_genero = persona.per_genero.toString();
        }

        this.paciente.per_estadocivil = null;
        if (persona.per_estadocivil) {
            this.paciente.per_estadocivil = this.arrayUtil.getFirstResult(
                this.estadoCivilList, el => {
                    return el.lval_id === persona.per_estadocivil;
                }
            );
        }

        if (persona.per_tiposangre) {
            this.paciente.per_tiposangre = this.arrayUtil.getFirstResult(
                this.tipoSangreList, el => {
                    return el.lval_id === persona.per_tiposangre;
                }
            );
        }
        if (persona.per_tipo) {
            this.paciente.per_tipo = this.arrayUtil.getFirstResult(
                this.tiposRefList, el => {
                    return parseInt(el.lval_valor, 10) === persona.per_tipo;
                }
            );
        }

        this.paciente.per_lugresidencia = null;
        if (persona.per_lugresidencia) {
            this.paciente.per_lugresidencia = this.arrayUtil.getFirstResult(
                this.lugares, el => {
                    return el.lug_id === persona.per_lugresidencia;
                }
            );
        }

        this.paciente.per_ocupacion = null;
        if (persona.per_ocupacion) {
            this.paciente.per_ocupacion = this.arrayUtil.getFirstResult(
                this.ocupaciones, el => {
                    return el.lval_id === persona.per_ocupacion;
                }
            );
        }
    }

    buscarPacientePorCod() {
        this.datosIncompletos = false;
        this.loadingUiService.publishBlockMessage();
        this.personaService.buscarPorCodfull(this.codPaciente).subscribe(res => {
            if (res.status === 200) {
                this.datosPacienteFull = res.persona;
                this.pacienteLoaded.emit(res.persona);
                if (res.persona.per_tipo !== 3) {
                    this.datosIncompletos = this.isPersonDataIncomplete(res.persona);
                }
                if (this.datosIncompletos && this.datosmedicos) {
                    this.datosIncompletosEv.emit(res.persona);
                    this.logicaDatosIncompletos(true);
                    this.editando = true;
                    this.loadListasAndSetupForm();
                }
            }
        });
    }

    loadListasAndSetupForm() {
        this.loadingUiService.publishBlockMessage();
        const genObs = this.catalogosServ.getCatalogos(1);
        const estCivilObs = this.catalogosServ.getCatalogos(2);
        const ocupObs = this.catalogosServ.getCatalogos(3);
        const tipsangObs = this.catalogosServ.getCatalogos(4);
        const tiposRefObs = this.catalogosServ.getCatalogos(5);
        const lugObs = this.lugarService.listarTodos();
        const formObs = this.personaService.getForm();

        forkJoin([genObs, estCivilObs, ocupObs, tipsangObs, lugObs, tiposRefObs, formObs]).subscribe(res => {
            if (res[0].status === 200) {
                this.generosList = res[0].items;
            }
            if (res[1].status === 200) {
                this.estadoCivilList = res[1].items;
            }
            if (res[2].status === 200) {
                this.ocupaciones = res[2].items;
            }
            if (res[3].status === 200) {
                this.tipoSangreList = res[3].items;
            }
            if (res[4].status === 200) {
                this.lugares = res[4].items;
            }
            if (res[5].status === 200) {
                this.tiposRefList = res[5].items;
            }
            if (res[6].status === 200) {
                this.paciente = res[6].form;
                this.domService.setFocusTm(this.ctes.perCirucInput, 100);
            }
            if (this.datosPacienteFull.per_id) {
                this.loadDataPerson(this.datosPacienteFull);
            } else {
                this.loadDataPerson(this.paciente);
                this.editando = true;
            }
        });
    }

    buscarPaciente(showMessage, focusInput) {
        const per_ciruc = this.paciente.per_ciruc;
        this.datosIncompletos = false;
        if (per_ciruc && per_ciruc.trim().length > 0) {
            this.loadingUiService.publishBlockMessage();
            this.personaService.buscarPorCifull(per_ciruc).subscribe(res => {
                    if (res.status === 200) {
                        if (showMessage) {
                            this.swalService.fireToastInfo(this.ctes.msgRefRegistered);
                        }
                        this.loadDataPerson(res.persona);
                        this.datosPacienteFull = res.persona;
                        this.pacienteLoaded.emit(res.persona);
                    } else {
                        this.domService.setFocusTm(focusInput, 600);
                        if (showMessage) {
                            this.swalService.fireToastWarn(this.ctes.msgNewRefEnterDataFil);
                        }
                        this.paciente.per_ciruc = per_ciruc;
                    }
                }
            );
        }
    }

    guardaDatosPaciente() {
        const perId = this.paciente.per_id;
        const formPaciente = this.paciente;
        const estadoCivil = formPaciente.per_estadocivil;
        const residencia = formPaciente.per_lugresidencia;
        const genero = formPaciente.per_genero;
        const tiposangre = formPaciente.per_tiposangre;
        const tiporef = formPaciente.per_tipo;

        if (!genero && !this.isProveedor()) {
            this.swalService.fireToastError(this.ctes.msgMustSelectGenRef);
            return;
        }

        if (this.datosmedicos && !estadoCivil && !this.isProveedor()) {
            this.swalService.fireToastError(this.ctes.msgMustSelectEstCivRef);
            return;
        }

        if (this.datosmedicos && !formPaciente.per_fechanac && !this.isProveedor()) {
            this.swalService.fireToastError(this.ctes.msgMustEnterFechaNac);
            return;
        }

        const perEstadocivil = estadoCivil ? estadoCivil.lval_id : 0;
        const perGenero = genero;
        const perLugresidencia = residencia ? residencia.lug_id : 0;

        const formToPost: any = {};
        for (const prop of Object.keys(formPaciente)) {
            formToPost[prop] = formPaciente[prop];
        }
        formToPost.per_estadocivil = perEstadocivil;
        formToPost.per_genero = perGenero;
        formToPost.per_lugresidencia = perLugresidencia;

        if (formPaciente.per_fechanac) {
            formToPost.per_fechanacp = this.fechasService.formatDate(formPaciente.per_fechanac);
        }

        formToPost.per_tiposangre = tiposangre ? tiposangre.lval_id : 0;
        formToPost.per_tipo = tiporef ? tiporef.lval_valor : 1;

        this.loadingUiService.publishBlockMessage();
        this.personaService.actualizar(perId, formToPost).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.domService.setFocusTm(this.ctes.motivoConsultaTextArea, 600);
                if (res.per_id) {
                    this.paciente.per_id = res.per_id;
                }
                this.pacienteSaved.emit(this.paciente.per_id);
                this.editando = false;
                this.codPaciente = this.paciente.per_id;
                this.buscarPacientePorCod();
            }
        });
    }

    calcularEdad() {
        this.personaService.setPerEdad(this.paciente);
    }

    cancelarRegistro() {
        if (this.editando && this.codPaciente > 0) {
            this.editando = false;
        } else {
            this.creacionCancelada.emit('');
        }
    }
}
