import {Component, OnInit} from '@angular/core';
import {ArticuloService} from '../../../services/articulo.service';
import {CategoriasService} from '../../../services/categorias.service';
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
import {forkJoin} from 'rxjs';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {ModelocontabService} from '../../../services/modelocontab.service';
import {CtesService} from '../../../services/ctes.service';


@Component({
    selector: 'app-articulos-form',
    templateUrl: './articulos-form.component.html'
})
export class ArticulosFormComponent implements OnInit {
    artForm: any;
    submited: boolean;

    categorias: Array<any> = [];
    proveedores: Array<any> = [];
    modscontabs: Array<any> = [];
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
    numbersPattern = '';

    minimumDate = new Date();
    nombreNuevaCatg: string;
    activeTabIndex: number;
    nuevoBarcode: string;
    aplicaDental: boolean;
    secciones: Array<any>;
    impuestos: any;
    isLoading: boolean;
    isModalCatVisible: any;
    isModalEditBC = false;
    formcat: any;

    constructor(
        private artService: ArticuloService,
        private artStockService: ArticulostockService,
        private catsService: CategoriasService,
        private swalService: SwalService,
        private arrayUtil: ArrayutilService,
        private localStrgServ: LocalStorageService,
        private loadingService: LoadingUiService,
        private ctes: CtesService,
        private router: Router,
        private route: ActivatedRoute,
        private fechasService: FechasService,
        private messageService: MessageService,
        private domService: DomService,
        private personaService: PersonaService,
        private modcontabService: ModelocontabService
    ) {
        this.numbersPattern = this.ctes.numbersPattern;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.isModalCatVisible = false;
        this.artFromDb = {};
        this.tiposArt = this.artService.getTiposArt();
        this.ivas = this.artService.getIvas();
        this.artCodAutomatic = false;
        this.isShowAsistPre = false;
        this.activeTabIndex = 0;
        this.nuevoBarcode = '';
        this.aplicaDental = false;
        this.isLoading = true;
    }

    ngOnInit() {
        this.submited = false;
        this.nombreNuevaCatg = '';
        this.artFromDb = {};
        this.editing = false;
        this.proveedores = new Array<any>();
        this.artCodAutomatic = false;

        this.route.paramMap.subscribe(params => {
            this.buildDefForm();
            this.artId = parseInt(params.get(this.ctes.art_id), 10);
            this.editing = this.artId > 0;
            this.loadArrays();
            if (this.localStrgServ.getItem(this.ctes.insertStock)) {
                setTimeout(() => {
                    this.activeTabIndex = 1;
                }, 500);
                this.domService.setFocusTm(`${this.ctes.stock}_0`, 600);
            }
        });
        this.loadModelosContables();
    }

    loadModelosContables() {
        this.modcontabService.listar().subscribe(res => {
            if (res.status === 200) {
                this.modscontabs = res.items;
            }
        });
    }

    fieldHasError(field) {
        let haserror = false;
        if (this.artForm[field].required) {
            haserror = this.artForm[field].value.toString().trim().length === 0;
        }
        return haserror;
    }

    evalPattern(field, pattern) {
        const re = new RegExp(pattern);
        return !re.test(this.artForm[field].value);
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
        this.isLoading = true;
        const provObs = this.personaService.listarProveedores();
        const catsObs = this.catsService.listar();
        const stockObs = this.artStockService.getForm(this.artId);
        const impObs = this.artService.getImpuestos();
        let artObs;
        if (this.artId > 0) {
            artObs = this.artService.getByCod(this.artId);
        } else {
            artObs = this.artService.getForm();
        }


        forkJoin([provObs, catsObs, stockObs, artObs, impObs]).subscribe(res => {
            const res0: any = res[0];
            const res1: any = res[1];
            const res2: any = res[2];
            const res3: any = res[3];
            const res4: any = res[4];

            if (res0.status === 200) {
                this.proveedores = res0.items;
                this.defaultProv = this.getProvDefault();
            }
            if (res1.status === 200) {
                this.categorias = res1.items;
                this.defaultCat = this.getCatDefault();
            }

            if (res2.status === 200) {
                this.stock = res2.form_secs;
            }

            if (res3.status === 200) {
                if (this.artId > 0) {
                    this.artFromDb = res3.datosprod;
                    this.secciones = res3.secciones;
                    this.buildForm(this.artFromDb);
                } else {
                    this.aplicaDental = res3.form.aplicadental;
                    this.secciones = res3.form.secciones;
                    this.buildForm(res3.form);
                    if (this.localStrgServ.getItem(this.ctes.mercformdef_cat)) {
                        try {
                            this.artForm.catic_id.value = JSON.parse(this.localStrgServ.getItem(this.ctes.mercformdef_cat));
                        } catch (e) {
                        }
                        this.localStrgServ.removeItem(this.ctes.mercformdef_cat);
                    }
                    if (this.localStrgServ.getItem(this.ctes.mercformdef_prov)) {
                        this.artForm.icdp_proveedor.value = this.localStrgServ.getItem(this.ctes.mercformdef_prov);
                        this.localStrgServ.removeItem(this.ctes.mercformdef_prov);
                    }
                    this.domService.setFocusTm(this.ctes.codbarraInput);
                }
            }

            if (res4.status === 200) {
                this.impuestos = res4.impuestos;
            }
            this.isLoading = false;
        });
    }

    buildForm(form: any) {
        let prov = this.defaultProv;
        let cat = this.defaultCat;

        const provid = form.icdp_proveedor;
        const catid = form.catic_id;
        const dbcat = this.arrayUtil.getFirstResult(
            this.categorias,
            (el) => {
                return el.catic_id === catid;
            }
        );

        const dbprov = this.arrayUtil.getFirstResult(
            this.proveedores,
            (el) => {
                return el.per_id === provid;
            }
        );

        if (dbcat != null) {
            cat = dbcat;
        }
        if (dbprov != null) {
            prov = dbprov;
        }

        const icdp_fechacaducidad = form.icdp_fechacaducidad;
        let artFeccaduParsed = null;
        if (form.icdp_fechacaducidad && form.icdp_fechacaducidad.length > 0) {
            artFeccaduParsed = parse(icdp_fechacaducidad, this.ctes.fmtfecha, new Date());
        }

        const globalAsistPorcIncrem = this.localStrgServ.getItem(this.ctes.globalAsistPorcIncrePrecioCompra);
        let asistPrePorc = 0.0;
        if (globalAsistPorcIncrem) {
            asistPrePorc = Number(globalAsistPorcIncrem);
        }

        this.artForm = {
            ic_code: {value: form.ic_code, required: true},
            icdp_fechacaducidad: {value: artFeccaduParsed},
            icdp_grabaiva: {value: form.icdp_grabaiva, required: true},
            ic_nombre: {value: form.ic_nombre, required: true},
            ic_nota: {value: form.ic_nota},
            icdp_precioventa: {value: form.icdp_precioventa, required: true},
            icdp_preciocompra: {value: form.icdp_preciocompra, required: true},
            icdp_preciocompra_iva: {value: form.icdp_preciocompra_iva, required: true},
            tipic_id: {value: form.tipic_id, required: true},
            catic_id: {value: cat, required: true},
            icdp_proveedor: {value: prov.per_id, required: true},
            icdp_modcontab: {value: form.icdp_modcontab},
            icdp_precioventamin: {value: form.icdp_precioventamin},
            asist_pre_porc: {value: asistPrePorc},
            asist_pre_util: {value: 0.0},
            asist_pre_prevsug: {value: 0.0},
            ic_dental: {value: form.ic_dental},
            seccionesf: {value: []}
        };

        this.secciones.forEach(e => {
            this.artForm.seccionesf.value.push({
                value: this.secciones.length === 1 ? true : e.marca,
                sec_id: e.sec_id,
                seccion: e
            });
        });

        this.artForm.icdp_preciocompra_iva.disabled = true;
        this.artForm.asist_pre_util.disabled = true;
        this.artForm.asist_pre_prevsug.disabled = true;

        if (this.editing) {
            setTimeout(() => {
                this.artForm.ic_code.disabled = true;
                this.artForm.tipic_id.disabled = true;
            }, 100);
        } else {
            // Si solo hay una seccion, se la marca por defecto
            if (this.artForm.seccionesf.value.length === 1) {
                this.artForm.seccionesf.value[0].value = true;
            }
        }
    }

    buildDefForm() {
        const tipoSel = this.tiposArt[0].value;
        const ivaSel = this.ivas[1].value;

        const globalAsistPorcIncrem = this.localStrgServ.getItem(this.ctes.globalAsistPorcIncrePrecioCompra);
        let asistPrePorc = 0.0;
        if (globalAsistPorcIncrem) {
            asistPrePorc = Number(globalAsistPorcIncrem);
        }

        this.artForm = {
            ic_code: {value: '', required: true},
            icdp_fechacaducidad: {value: null},
            icdp_grabaiva: {value: ivaSel, required: true},
            ic_nombre: {value: '', required: true},
            ic_nota: {value: ''},
            icdp_precioventa: {value: 0.0, required: true},
            icdp_preciocompra: {value: 0.0, required: true},
            icdp_preciocompra_iva: {value: 0.0},
            tipic_id: {value: tipoSel, required: true},
            catic_id: {value: 1, required: true},
            icdp_proveedor: {value: -2, required: true},
            icdp_modcontab: {value: 0},
            icdp_precioventamin: {value: 0.0},
            asist_pre_porc: {value: asistPrePorc},
            asist_pre_util: {value: 0.0},
            asist_pre_prevsug: {value: 0.0},
            ic_dental: {value: false},
            seccionesf: {value: []}
        };

        this.artForm.icdp_preciocompra_iva.disabled = true;
        this.artForm.asist_pre_util.disabled = true;
        this.artForm.asist_pre_prevsug.disabled = true;
    }

    getFormToPost() {
        const formvalue: any = this.artForm;
        const formToPost: any = {};
        for (const prop of Object.keys(formvalue)) {
            formToPost[prop] = formvalue[prop].value;
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
        this.loadingService.publishBlockMessage();
        this.artStockService.guardar(this.stock).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                if (this.localStrgServ.getItem(this.ctes.insertStock)) {
                    this.localStrgServ.removeItem(this.ctes.insertStock);
                    this.router.navigate([this.ctes.mercaderiaForm, 0]);
                } else {
                    this.cancelar();
                }
            }
        });
    }

    procesaForm() {
        this.submited = true;
        let invalid = false;
        for (const prop of Object.keys(this.artForm)) {
            if (this.artForm[prop].required) {
                invalid = this.artForm[prop].value.toString().trim().length === 0;
                if (invalid) {
                    break;
                }
            }
        }
        if (invalid) {
            this.swalService.fireToastWarn(this.ctes.msgDatosIncorr);
            return;
        }

        const secmarca = this.artForm.seccionesf.value.filter(itsec => itsec.value);
        if (secmarca.length === 0) {
            this.swalService.fireToastError(this.ctes.msgMustSelectSeccion);
            return;
        }

        this.swalService.fireDialog(this.ctes.msgConfirmSave).then(confirm => {
            if (confirm.value) {
                const formtoPost = this.getFormToPost();
                this.loadingService.publishBlockMessage();
                this.artService.guardarArticulo(formtoPost).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        if (formtoPost.tipic_id === 1 && !this.editing) {
                            this.localStrgServ.setItem(this.ctes.insertStock, this.ctes.true);
                            this.localStrgServ.setItem(this.ctes.mercformdef_cat, JSON.stringify(this.artForm.catic_id.value));
                            this.localStrgServ.setItem(this.ctes.mercformdef_prov, this.artForm.icdp_proveedor.value);
                        }
                        if (this.editing) {
                            this.router.navigate([this.ctes.mercaderia]);
                        } else {
                            if (formtoPost.tipic_id === 1) {
                                this.router.navigate([this.ctes.mercaderiaForm, res.ic_id]);
                            } else {
                                this.localStrgServ.setItem(this.ctes.mercformdef_cat, JSON.stringify(this.artForm.catic_id.value));
                                this.ngOnInit();
                            }
                        }
                    }
                });
            }
        });
    }

    generarCodigoBarra() {
        if (this.artCodAutomatic) {
            this.artForm.ic_code.value = '';
            this.artForm.ic_code.disabled = false;
            this.domService.setFocus(this.ctes.codbarraInput);
        } else {
            this.artService.getNextCodbar().subscribe(res => {
                if (res.status === 200) {
                    this.artForm.ic_code.value = res.codbar.toString();
                    this.domService.setFocus(this.ctes.nombreInput);
                    this.artForm.ic_code.disabled = true;
                }
            });
        }
        this.artCodAutomatic = !this.artCodAutomatic;
    }

    cancelar() {
        this.router.navigate([this.ctes.mercaderia]);
    }

    checkExisteCodBarra() {
        const icCode = this.artForm.ic_code.value || '';
        if (icCode && icCode.length > 0) {
            this.artService.existeCodbar(icCode).subscribe(res => {
                if (res.existe) {
                    this.swalService.fireError(`Ya existe un producto o servicio registrado (${res.nombreart}) con el código: ${icCode}, favor ingrese otro`);
                } else {
                    this.domService.setFocus(this.ctes.nombreInput);
                }
            });
        }
    }

    onEnterCodBarra() {
        this.domService.setFocusTm(this.ctes.nombreInput);
    }

    onEnterNombre() {
        const icNombre = this.artForm.ic_nombre.value;
        const tipicId = this.artForm.tipic_id.value;
        if (icNombre && icNombre.trim().length > 0) {
            if (tipicId && tipicId === 1) {
                this.domService.setFocus(this.ctes.precioCompraInput);
            } else {
                this.domService.setFocus(this.ctes.precioVentaInput);
            }
        }
    }

    onEnterPrecioVenta() {
        this.domService.setFocus(this.ctes.ic_nota);
    }

    onEnterPrecioVentaMin() {
        this.domService.setFocus(this.ctes.ic_nota);
    }

    onEnterPrecioCompra() {
        this.domService.setFocus(this.ctes.precioVentaInput);
    }

    calculaPrecioCompraConIva() {
        const precioConIva = this.getPrecioConIva(this.artForm.icdp_preciocompra.value);
        this.artForm.icdp_preciocompra_iva.value = precioConIva.toString();
    }

    onKeyupPrecioCompra() {
        this.calculaPrecioCompraConIva();
        this.calculaPrecioVenta();
    }

    calculaPrecioVenta() {
        let porcenIncr = 0.0;
        const porcenIncrValue = this.artForm.asist_pre_porc.value;
        if (porcenIncrValue) {
            porcenIncr = Number(porcenIncrValue);
        }
        let precioCompraIva = 0.0;
        const preCompraIvaValue = this.artForm.icdp_preciocompra_iva.value;
        if (preCompraIvaValue) {
            precioCompraIva = Number(preCompraIvaValue);
        }
        const utilidad = (precioCompraIva * porcenIncr) / Number(100.0);
        const utilidadFixed = utilidad.toFixed(2);
        const precioVentaSug = precioCompraIva + utilidad;
        const precioVentaSugFixed = precioVentaSug.toFixed(2);
        this.artForm.asist_pre_util.value = utilidadFixed;
        this.artForm.asist_pre_prevsug.value = precioVentaSugFixed;
        this.localStrgServ.setItem(this.ctes.globalAsistPorcIncrePrecioCompra, porcenIncr.toString());
    }

    getPrecioConIva(precio: number) {
        let precioConIva = 0.0;
        if (precio) {
            if (this.artForm.icdp_grabaiva.value) {
                precioConIva = Number(precio) * Number(1.0 + this.impuestos.iva);
            } else {
                precioConIva = Number(precio);
            }
        }
        return precioConIva.toFixed(2);
    }

    onTipoArtChange() {
        const tipoSel = this.artForm.tipic_id.value;
        if (tipoSel === 2) {
            this.artForm.icdp_preciocompra.value = 0.0;
            this.artForm.icdp_proveedor.value = -2;
        }
        this.artForm.icdp_modcontab.value = tipoSel;
    }

    onTipoIvaChange() {
        this.calculaPrecioCompraConIva();
        this.calculaPrecioVenta();
    }

    toggleAsistentePrecios() {
        this.isShowAsistPre = !this.isShowAsistPre;
        if (this.isShowAsistPre) {
            this.calculaPrecioVenta();
            this.domService.setFocusTm(this.ctes.porcIncAsistPre);
        } else {
            this.domService.setFocus(this.ctes.precioVentaInput);
        }
    }

    catIsDefault(element) {
        return element.catic_id === 1;
    }

    provIsDefault(element) {
        return element.per_id === -2;
    }

    onKeyupPorcentajeIncr() {
        this.calculaPrecioVenta();
    }

    showModalCreaCateg() {
        this.loadingService.publishBlockMessage();
        this.catsService.getFormCrea().subscribe(res => {
            if (res.status === 200) {
                this.formcat = res.form;
                if (this.modscontabs.length > 0) {
                    this.formcat.catic_caja = this.modscontabs[0].mc_id;
                }
                this.isModalCatVisible = true;
            }
        });
    }

    marcarTexto($event: any) {
        $event.target.select();
    }

    showModalEditBarcode() {
        this.isModalEditBC = true;
    }

    guardaNuevoBarcode() {
        if (this.nuevoBarcode.trim().length > 0) {
            this.artService.actualizaBarcode(this.artId, this.nuevoBarcode.trim()).subscribe(res => {
                if (res.status === 200) {
                    this.isModalEditBC = false;
                    this.swalService.fireToastSuccess(res.msg);
                    this.artForm.ic_code.value = this.nuevoBarcode.trim();
                }
            });
        } else {
            this.swalService.fireWarning(this.ctes.msgMustEnterCodBarra);
        }
    }

    doSaveCat() {
        if (this.formcat.catic_nombre.trim().length === 0) {
            this.swalService.fireToastError(this.ctes.msgEnterCatName);
            return;
        }
        if (this.formcat.catic_mc === 0) {
            this.swalService.fireToastError(this.ctes.msgMustSelectModContab);
            return;
        }
        if (this.formcat.catic_id > 0) {
            this.catsService.actualizar(this.formcat).subscribe(res => {
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.isModalCatVisible = false;
                    this.loadCategorias();
                }
            });
        } else {
            this.loadingService.publishBlockMessage();
            this.catsService.crear(this.formcat).subscribe(res => {
                this.isModalCatVisible = false;
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.loadCategorias();
                }
            });
        }
    }

    cancelSaveCat() {
        this.isModalCatVisible = false;
    }

    oncatselchange($event: any) {
        if ($event.value.catic_mc) {
            this.artForm.icdp_modcontab.value = $event.value.catic_mc;
        }
    }
}
