import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ArticuloService} from '../../../services/articulo.service';
import {CategoriasService} from '../../../services/categorias.service';
import {TipoCajaService} from '../../../services/tipocaja.service';
import {UnidadesService} from '../../../services/unidades.service';
import {MessageService, SelectItem} from 'primeng/api';
import {SwalService} from '../../../services/swal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {DomService} from '../../../services/dom.service';
import {PersonaService} from '../../../services/persona.service';
import {FechasService} from '../../../services/fechas.service';
import {parse} from 'date-fns';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ArticulostockService} from '../../../services/articulostock.service';

declare var $: any;

@Component({
    selector: 'app-articulos-form',
    templateUrl: './articulos-form.component.html',
    styleUrls: ['./articulos-form.component.css']
})
export class ArticulosFormComponent implements OnInit {
    artForm: FormGroup;
    submited: boolean;

    categorias: Array<any> = [];
    proveedores: Array<any> = [];
    stock: Array<any> = [];

    tiposArt: SelectItem[];
    ivas: SelectItem[];

    defaultCat: any;
    defaultProv: any;

    artId: number;
    artFromDb: any;
    editing: boolean;
    artCodAutomatic: boolean;
    isShowAsistPre: boolean;
    numbersPattern = '^[0-9]*\\.*[0-9]*$';

    minimumDate = new Date();
    nombreNuevaCatg: string;
    activeTabIndex: number;
    nuevoBarcode: string;

    constructor(
        private fb: FormBuilder,
        private artService: ArticuloService,
        private artStockService: ArticulostockService,
        private catsService: CategoriasService,
        private tipoCajaService: TipoCajaService,
        private unidadesService: UnidadesService,
        private swalService: SwalService,
        private arrayUtil: ArrayutilService,
        private localStrgServ: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private fechasService: FechasService,
        private messageService: MessageService,
        private domService: DomService,
        private personaService: PersonaService
    ) {
        this.tiposArt = [
            {label: 'Bien', value: 1},
            {label: 'Servicio', value: 2}
        ];
        this.ivas = [
            {label: 'Si', value: true},
            {label: 'No', value: false}
        ];
        this.artCodAutomatic = false;
        this.isShowAsistPre = false;
        this.activeTabIndex = 0;
        this.nuevoBarcode = '';
    }

    get f() {
        return this.artForm.controls;
    }

    ngOnInit() {
        this.nombreNuevaCatg = '';
        this.artFromDb = {};
        this.editing = false;
        this.proveedores = new Array<any>();
        this.artCodAutomatic = false;

        this.route.paramMap.subscribe(params => {
            this.buildDefForm();
            this.artId = parseInt(params.get('art_id'), 10);
            this.editing = this.artId > 0;
            this.domService.setFocusTimeout('codbarraInput', 100);
            this.loadArrays();
            if (this.localStrgServ.getItem('insertStock')) {
                setTimeout(() => {
                    this.activeTabIndex = 1;
                    this.localStrgServ.removeItem('insertStock');
                }, 500);
            }
        });

        $('#modalCreaCateg').on('show.bs.modal', () => {
            setTimeout(() => {
                $('.auxNombreNuevaCatg').focus();
            }, 500);
        });

        $('#modalEditBarcode').on('show.bs.modal', () => {
            setTimeout(() => {
                $('.auxNuevoBarcode').focus();
            }, 500);
        });
    }

    getCatDefault(): any {
        return this.arrayUtil.getFirstResult(this.categorias, this.catIsDefault);
    }

    getProvDefault(): any {
        return this.arrayUtil.getFirstResult(this.proveedores, this.provIsDefault);
    }

    loadCategorias() {
        this.catsService.listar().subscribe(resCat => {
            if (resCat.status === 200) {
                this.categorias = resCat.items;
                this.defaultCat = this.getCatDefault();
            }
        });
    }

    loadArrays() {
        this.personaService.listarProveedores().subscribe(resProv => {
            if (resProv.status === 200) {
                this.proveedores = resProv.items;
                this.defaultProv = this.getProvDefault();
            }
            this.catsService.listar().subscribe(resCat => {
                if (resCat.status === 200) {
                    this.categorias = resCat.items;
                    this.defaultCat = this.getCatDefault();
                }
                if (this.artId > 0) {
                    this.artService.getByCod(this.artId).subscribe(resEditArt => {
                        if (resEditArt.status === 200) {
                            this.artFromDb = resEditArt.datosprod;
                            this.buildForm(this.artFromDb);
                        }
                    });
                    this.artStockService.getForm(this.artId).subscribe(resStock => {
                        if (resStock.status === 200) {
                            this.stock = resStock.form_secs;
                        }
                    });
                } else {
                    this.artService.getForm().subscribe((resNewArt: any) => {
                        if (resNewArt.status === 200) {
                            this.buildForm(resNewArt.form);
                        }
                    });
                }
            });
        });
    }

    buildForm(form: any) {
        let prov = this.defaultProv;
        let cat = this.defaultCat;

        const provid = form.icdp_proveedor;
        const catid = form.catic_id;
        const dbcat = this.arrayUtil.getFirstResult(
            this.categorias,
            (el, idx, array) => {
                return el.catic_id === catid;
            }
        );

        const dbprov = this.arrayUtil.getFirstResult(
            this.proveedores,
            (el, idx, array) => {
                return el.per_id === provid;
            }
        );

        const tip = form.tipic_id;

        if (dbcat != null) {
            cat = dbcat;
        }
        if (dbprov != null) {
            prov = dbprov;
        }

        const icdp_fechacaducidad = form.icdp_fechacaducidad;
        let artFeccaduParsed = null;
        if (form.icdp_fechacaducidad && form.icdp_fechacaducidad.length > 0) {
            artFeccaduParsed = parse(icdp_fechacaducidad, 'dd/MM/yyyy', new Date());
        }

        const globalAsistPorcIncrem = this.localStrgServ.getItem('globalAsistPorcIncrePrecioCompra');
        let asistPrePorc = 0.0;
        if (globalAsistPorcIncrem) {
            asistPrePorc = Number(globalAsistPorcIncrem);
        }

        this.artForm = this.fb.group({
            ic_code: [form.ic_code, Validators.required],
            icdp_fechacaducidad: [artFeccaduParsed],
            icdp_grabaiva: [form.icdp_grabaiva, Validators.required],
            ic_nombre: [form.ic_nombre, Validators.required],
            ic_nota: [form.ic_nota],
            icdp_precioventa: [form.icdp_precioventa, Validators.required],
            icdp_preciocompra: [form.icdp_preciocompra, Validators.required],
            icdp_preciocompra_iva: [form.icdp_preciocompra_iva, Validators.required],
            tipic_id: [form.tipic_id, Validators.required],
            catic_id: [cat, Validators.required],
            icdp_proveedor: [prov, Validators.required],
            icdp_modcontab: [form.icdp_modcontab],
            icdp_precioventamin: [form.icdp_precioventamin],
            asist_pre_porc: [asistPrePorc],
            asist_pre_util: [0.0],
            asist_pre_prevsug: [0.0],
            ic_dental: [form.ic_dental]
        });

        this.artForm.controls.icdp_preciocompra_iva.disable();
        this.artForm.controls.asist_pre_util.disable();
        this.artForm.controls.asist_pre_prevsug.disable();
        if (this.editing) {
            setTimeout(() => {
                this.artForm.controls.ic_code.disable();
                this.artForm.controls.tipic_id.disable();
            }, 100);
        }
    }

    buildDefForm() {
        const tipoSel = this.tiposArt[0].value;
        const ivaSel = this.ivas[1].value;

        const globalAsistPorcIncrem = this.localStrgServ.getItem('globalAsistPorcIncrePrecioCompra');
        let asistPrePorc = 0.0;
        if (globalAsistPorcIncrem) {
            asistPrePorc = Number(globalAsistPorcIncrem);
        }

        this.artForm = this.fb.group({
            ic_code: ['', Validators.required],
            icdp_fechacaducidad: [null],
            icdp_grabaiva: [ivaSel, Validators.required],
            ic_nombre: ['', Validators.required],
            ic_nota: [''],
            icdp_precioventa: [0.0, Validators.required],
            icdp_preciocompra: [0.0, Validators.required],
            icdp_preciocompra_iva: [0.0],
            tipic_id: [tipoSel, Validators.required],
            catic_id: [1, Validators.required],
            icdp_proveedor: [-2, Validators.required],
            icdp_modcontab: [0],
            icdp_precioventamin: [0.0],
            asist_pre_porc: [asistPrePorc],
            asist_pre_util: [0.0],
            asist_pre_prevsug: [0.0],
            ic_dental: [false]
        });
        this.artForm.controls.icdp_preciocompra_iva.disable();
        this.artForm.controls.asist_pre_util.disable();
        this.artForm.controls.asist_pre_prevsug.disable();
    }

    getFormToPost() {
        const formvalue: any = this.artForm.getRawValue();
        const formToPost: any = {};
        for (const prop of Object.keys(formvalue)) {
            formToPost[prop] = formvalue[prop];
        }
        const provsel = formToPost.icdp_proveedor;
        const catsel = formToPost.catic_id;
        let fechaCaducidad = '';
        if (formToPost.icdp_fechacaducidad) {
            fechaCaducidad = this.fechasService.formatDate(formToPost.icdp_fechacaducidad);
        }
        formToPost.prov_id = provsel.per_id;
        formToPost.catic_id = catsel;
        formToPost.ic_id = this.artId;
        formToPost.icdp_fechacaducidad = fechaCaducidad;
        formToPost.codbar_auto = this.artCodAutomatic;
        formToPost.icdp_proveedor = provsel;
        return formToPost;
    }

    guardarStock() {
        this.artStockService.guardar(this.stock).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.cancelar();
            }
        });
    }

    procesaForm() {
        this.submited = true;
        if (this.artForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Datos Incorrectos',
                detail: 'Verifique la información ingresada'
            });
            return;
        }
        let msg = 'Confirma la creación del artículo/servicio';
        if (this.editing) {
            msg = 'Confirma la actualización de este artículo/servicio';
        }
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                const formtoPost = this.getFormToPost();
                this.artService.guardarArticulo(formtoPost).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        if (formtoPost.tipic_id === 1 && !this.editing) {
                            this.localStrgServ.setItem('insertStock', 'true');
                            this.router.navigate(['mercaderiaForm', res.ic_id]);
                        } else {
                            this.router.navigate(['mercaderia']);
                        }
                    }
                });
            }
        });
    }

    generarCodigoBarra() {
        if (this.artCodAutomatic) {
            this.artForm.controls.ic_code.setValue('');
            this.artForm.controls.ic_code.enable();
            this.domService.setFocus('codbarraInput');
        } else {
            this.artService.getNextCodbar().subscribe(res => {
                if (res.status === 200) {
                    this.artForm.controls.ic_code.setValue(res.codbar);
                    this.domService.setFocus('nombreInput');
                    this.artForm.controls.ic_code.disable();
                }
            });
        }
        this.artCodAutomatic = !this.artCodAutomatic;
    }

    cancelar() {
        this.router.navigate(['mercaderia']);
    }

    onEnterCodBarra($event) {
        const icCode = this.artForm.controls.ic_code.value;
        if (icCode && icCode.trim().length > 0) {
            this.artService.existeCodbar(icCode).subscribe(res => {
                if (res.existe) {
                    this.swalService.fireWarning('Ya existe un producto o servicio registrado (' + res.nombreart + ') con el código:' +
                        icCode + ', favor ingrese otro');
                    this.domService.setFocus('codbarraInput');
                } else {
                    this.domService.setFocus('nombreInput');
                }
            });
        }
    }

    onEnterNombre($event) {
        const icNombre = this.artForm.controls.ic_nombre.value;
        const tipicId = this.artForm.controls.tipic_id.value;
        if (icNombre && icNombre.trim().length > 0) {
            if (tipicId && tipicId.value === 1) {
                this.domService.setFocus('precioCompraInput');
            } else {
                this.domService.setFocus('precioVentaInput');
            }
        }
    }

    onEnterPrecioVenta($event) {
        this.domService.setFocus('ic_nota');
    }

    onEnterPrecioCompra($event) {
        this.domService.setFocus('precioVentaInput');
    }

    calculaPrecioCompraConIva() {
        const precioConIva = this.getPrecioConIva(this.artForm.controls.icdp_preciocompra.value);
        this.artForm.controls.icdp_preciocompra_iva.setValue(precioConIva.toString());
    }

    onKeyupPrecioCompra($event) {
        this.calculaPrecioCompraConIva();
        this.calculaPrecioVenta();
    }

    calculaPrecioVenta() {
        let porcenIncr = 0.0;
        const porcenIncrValue = this.artForm.controls.asist_pre_porc.value;
        if (porcenIncrValue) {
            porcenIncr = Number(porcenIncrValue);
        }
        let precioCompraIva = 0.0;
        const preCompraIvaValue = this.artForm.controls.icdp_preciocompra_iva.value;
        if (preCompraIvaValue) {
            precioCompraIva = Number(preCompraIvaValue);
        }
        const utilidad = (precioCompraIva * porcenIncr) / Number('100.0');
        const utilidadFixed = utilidad.toFixed(2);
        const precioVentaSug = precioCompraIva + utilidad;
        const precioVentaSugFixed = precioVentaSug.toFixed(2);
        this.artForm.controls.asist_pre_util.setValue(utilidadFixed);
        this.artForm.controls.asist_pre_prevsug.setValue(precioVentaSugFixed);
        this.localStrgServ.setItem('globalAsistPorcIncrePrecioCompra', porcenIncr.toString());
    }

    getPrecioConIva(precio: number) {
        let precioConIva = 0.0;
        if (precio) {
            if (this.artForm.controls.icdp_grabaiva.value.value) {
                precioConIva = Number(precio) * Number('1.12');
            } else {
                precioConIva = Number(precio);
            }
        }
        return precioConIva.toFixed(2);
    }

    onTipoArtChange($event: any) {
        const tipoSel = this.artForm.controls.tipic_id.value;
        if (tipoSel === 2) {
            this.artForm.controls.icdp_preciocompra.setValue(0.0);
        }
    }

    onTipoIvaChange($event: any) {
        this.calculaPrecioCompraConIva();
        this.calculaPrecioVenta();
    }

    toggleAsistentePrecios() {
        this.isShowAsistPre = !this.isShowAsistPre;
        if (this.isShowAsistPre) {
            this.calculaPrecioVenta();
            setTimeout(() => {
                this.domService.setFocus('porcIncAsistPre');
            }, 200);

        } else {
            this.domService.setFocus('precioVentaInput');
        }
    }

    catIsDefault(element, index, array) {
        return element.catic_id === 1;
    }

    provIsDefault(element, index, array) {
        return element.per_id === -2;
    }

    tipCjIsDefault(element, index, array) {
        return element.tipcj_id === 1;
    }

    unidIsDefault(element, index, array) {
        return element.uni_id === -1;
    }

    onKeyupPorcentajeIncr($event: KeyboardEvent) {
        this.calculaPrecioVenta();
    }

    showModalCreaCateg() {
        $('#modalCreaCateg').modal();
    }

    showModalEditBarcode() {
        $('#modalEditBarcode').modal();
    }

    guardaCreaCatg() {
        if (this.nombreNuevaCatg.trim().length > 0) {
            this.catsService.crear(this.nombreNuevaCatg).subscribe(res => {
                if (res.status === 200) {
                    $('#modalCreaCateg').modal('hide');
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadCategorias();
                }
            });
        } else {
            this.swalService.fireWarning('Debe ingresar el nombre de la categoría');
        }
    }

    guardaNuevoBarcode() {
        if (this.nuevoBarcode.trim().length > 0) {
            this.artService.actualizaBarcode(this.artId, this.nuevoBarcode.trim()).subscribe(res => {
                if (res.status === 200) {
                    $('#modalEditBarcode').modal('hide');
                    this.swalService.fireToastSuccess(res.msg);
                    this.artForm.controls.ic_code.setValue(this.nuevoBarcode.trim());
                }
            });
        } else {
            this.swalService.fireWarning('Debe ingresar el nuevo código de barra');
        }
    }
}
