import {Component, OnInit, ViewChild} from '@angular/core';
import {ParamsService} from '../../../services/shared/params.service';
import {BaseComponent} from '../../../components/shared/base.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MenuItem, SharedModule} from 'primeng/api';
import {Table, TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {CtesService} from '../../../services/ctes.service';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SwalService} from '../../../services/swal.service';
import {DomService} from '../../../services/dom.service';
import {ContextMenuModule} from 'primeng/contextmenu';
import {SeccionService} from '../../../services/seccion.service';
import {EstadosService} from '../../../services/shared/estados.service';
import {DropdownModule} from 'primeng/dropdown';
import {RegexUtilService} from '../../../services/shared/regex-util.service';

@Component({
    selector: 'app-parametros',
    standalone: true,
    imports: [
        NgForOf,
        SharedModule,
        TableModule,
        FormsModule,
        DialogModule,
        NgIf,
        RadioButtonModule,
        ContextMenuModule,
        DropdownModule,
        NgClass,
    ],
    templateUrl: './parametros.component.html',
    styleUrl: './parametros.component.scss'
})
export class ParametrosComponent extends BaseComponent implements OnInit {
    paremetersList: Array<any> = [];
    filtro = '';
    isShowModalEdit = false;
    isShowModalCreate = false;
    selectedParam: any = {};
    newParamForm: any = {};
    alfaNumericPattern: RegExp;

    menu: MenuItem[] = [];
    secciones = [];
    estados = [];
    selectedSection = 0;
    selectedSectionCreate = 0;

    selectedStatus: any;
    Math = Math;
    rows = 15;
    totalRecord = 0;

    page = 0;
    @ViewChild('table', {static: false}) private table: Table;

    constructor(private paramService: ParamsService,
                private domService: DomService,
                private estadosService: EstadosService,
                private seccionService: SeccionService,
                private regexUtilService: RegexUtilService,
                private swalService: SwalService,
                private ctesService: CtesService) {
        super();
        this.alfaNumericPattern = this.ctesService.AlfaNumericPattern;
    }

    ngOnInit() {
        this.estados = this.estadosService.getActivoInactivoTodos();
        this.selectedStatus = this.estados[0].value;
        this.loadSecciones();
        this.loadContextMenu();
        this.load();
        this.domService.setFocusTm('filtroInput', 500);
    }

    loadSecciones() {
        this.seccionService.listar().subscribe(res => {
            if (res.items) {
                this.secciones = this.seccionService.addTodos(res.items);
                this.selectedSection = this.secciones[0].sec_id;
            }
        });
    }

    loadContextMenu() {
        this.menu = [
            {label: 'Editar', icon: 'pi pi-fw pi-edit', command: () => this.showModalToEdit(this.selectedParam)},
        ];
    }

    load() {
        this.isLoading = true;
        if (this.table) {
            this.table.reset();
        }
        this.paramService.buscar(this.filtro, this.selectedStatus, this.selectedSection).subscribe(res => {
            this.isLoading = false;
            if (this.isResultOk(res)) {
                this.paremetersList = res.params;
                this.totalRecord = this.paremetersList.length;
            }
        });
    }

    showModalToEdit(rowData: any) {
        this.selectedParam = {...rowData};
        this.isShowModalEdit = true;
    }

    doCreate() {
        this.swalService.fireDialog(this.ctesService.MsgConfirmCreateReg).then(confirm => {
            if (confirm.value) {
                this.isLoading = true;
                this.newParamForm.seccion = this.selectedSectionCreate;
                this.paramService.crear(this.newParamForm).subscribe(res => {
                    this.isLoading = false;
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.load();
                        this.isShowModalCreate = false;
                    }
                });
            }
        });
    }

    doUpdate() {
        this.swalService.fireDialog(this.ctesService.MsgConfirmUpdateReg).then(confirm => {
            if (confirm.value) {
                this.isLoading = true;
                this.paramService.actualizar(this.selectedParam).subscribe(res => {
                    this.isLoading = false;
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.load();
                        this.isShowModalEdit = false;
                    }
                });
            }
        });
    }

    clear() {
        this.filtro = '';
        this.selectedSection = 0;
        this.selectedStatus = this.estados[0].value;
        this.load();
    }

    isValid() {
        return this.regexUtilService.isValidAlphaNumericWithSpaces(this.selectedParam.tprm_nombre);
    }

    isValidFormCreate() {
        return this.isValidField('descripcion', 2) &&
            this.isValidField('codigo', 1);
    }

    isValidField(field: string, validtype: number) {
        if (validtype === 1) {
            return this.regexUtilService.isValidAlphaUnderscore(this.newParamForm[field]);
        } else if (validtype === 2) {
            return this.regexUtilService.isValidAlphaNumericWithSpaces(this.newParamForm[field]);
        }
    }

    showCreate() {
        this.paramService.getForm().subscribe(res => {
            if (this.isResultOk(res)) {
                this.newParamForm = res.form;
                this.selectedSectionCreate = 0;
                this.isShowModalCreate = true;
            }
        });
    }
}
