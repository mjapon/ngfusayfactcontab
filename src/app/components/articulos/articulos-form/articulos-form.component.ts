import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ArticuloService} from '../../../services/articulo.service';
import {ReferenteService} from '../../../services/referente.service';
import {CategoriasService} from '../../../services/categorias.service';
import {TipoCajaService} from '../../../services/tipocaja.service';
import {UnidadesService} from '../../../services/unidades.service';
import {MessageService, SelectItem} from 'primeng/api';
import {SwalService} from '../../../services/swal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {DateFormatPipe} from '../../../pipes/date-format.pipe';
import {DomService} from '../../../services/dom.service';
import {PersonaService} from '../../../services/persona.service';
import {FechasService} from '../../../services/fechas.service';
import {parse} from 'date-fns';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ArticulostockService} from '../../../services/articulostock.service';

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
    tipoArtSel: SelectItem;
    tipoIvaSel: SelectItem;

    defaultCat: any;
    defaultProv: any;

    es: any;
    artId: number;
    artFromDb: any;
    editing: boolean;
    artCodAutomatic: boolean;
    isShowAsistPre: boolean;
    numbersPattern: string = '^[0-9]*\\.*[0-9]*$';

    minimumDate = new Date();

    constructor(
        private fb: FormBuilder,
        private artService: ArticuloService,
        private artStockService: ArticulostockService,
        private refsService: ReferenteService,
        private catsService: CategoriasService,
        private tipoCajaService: TipoCajaService,
        private unidadesService: UnidadesService,
        private swalService: SwalService,
        private arrayUtil: ArrayutilService,
        private localStrgServ: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private dateFormatPipe: DateFormatPipe,
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
    }

    get f() {
        return this.artForm.controls;
    }

    ngOnInit() {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: this.fechasService.getDayNames(),
            dayNamesShort: this.fechasService.getDayNamesShort(),
            dayNamesMin: this.fechasService.getDayNamesMin(),
            monthNames: this.fechasService.getMonthNames(),
            monthNamesShort: this.fechasService.getMonthNamesShort(),
            today: 'Hoy',
            clear: 'Borrar'
        };

        this.artFromDb = {};
        this.editing = false;
        this.proveedores = new Array<any>();
        this.artCodAutomatic = false;

        this.route.paramMap.subscribe(params => {
            this.buildDefForm();
            this.artId = parseInt(params.get('art_id'), 10);
            this.editing = this.artId > 0;
            setTimeout(() => {
                this.domService.setFocus('codbarraInput');
            }, 100);
            this.loadArrays();
        });

    }

    getCatDefault(): any {
        return this.arrayUtil.getFirstResult(this.categorias, this.catIsDefault);
    }

    getProvDefault(): any {
        return this.arrayUtil.getFirstResult(this.proveedores, this.provIsDefault);
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
        let tipo = this.tiposArt[0];
        let iva = this.ivas[0];

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
        const dbTipo = this.arrayUtil.getFirstResult(
            this.tiposArt,
            (el, idx, array) => {
                return el.value === tip;
            }
        );

        const iv = form.icdp_grabaiva;
        const dbIva = this.arrayUtil.getFirstResult(this.ivas, (el, idx, array) => {
            return el.value === iv;
        });

        if (dbcat != null) {
            cat = dbcat;
        }
        if (dbprov != null) {
            prov = dbprov;
        }
        if (dbTipo != null) {
            tipo = dbTipo;
        }
        if (dbIva != null) {
            iva = dbIva;
        }

        const icdp_fechacaducidad = form.icdp_fechacaducidad;
        let artFeccaduParsed = null;
        if (form.icdp_fechacaducidad && form.icdp_fechacaducidad.length > 0) {
            artFeccaduParsed = parse(icdp_fechacaducidad, 'dd/MM/yyyy', new Date());
        }

        let globalAsistPorcIncrem = this.localStrgServ.getItem('globalAsistPorcIncrePrecioCompra');
        let asist_pre_porc = 0.0;
        if (globalAsistPorcIncrem) {
            asist_pre_porc = Number(globalAsistPorcIncrem);
        }

        this.artForm = this.fb.group({
            ic_code: [form.ic_code, Validators.required],
            icdp_fechacaducidad: [artFeccaduParsed],
            icdp_grabaiva: [iva, Validators.required],
            ic_nombre: [form.ic_nombre, Validators.required],
            ic_nota: [form.ic_nota],
            icdp_precioventa: [form.icdp_precioventa, Validators.required],
            icdp_preciocompra: [form.icdp_preciocompra, Validators.required],
            icdp_preciocompra_iva: [form.icdp_preciocompra_iva, Validators.required],
            tipic_id: [tipo, Validators.required],
            catic_id: [cat, Validators.required],
            icdp_proveedor: [prov, Validators.required],
            icdp_modcontab: [form.icdp_modcontab],
            icdp_precioventamin: [form.icdp_precioventamin],
            asist_pre_porc: [asist_pre_porc],
            asist_pre_util: [0.0],
            asist_pre_prevsug: [0.0]
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

        this.tipoArtSel = tipo;
        this.tipoIvaSel = iva;
    }

    buildDefForm() {
        let tipoSel = this.tiposArt[0];
        let ivaSel = this.ivas[0];

        let globalAsistPorcIncrem = this.localStrgServ.getItem('globalAsistPorcIncrePrecioCompra');
        let asist_pre_porc = 0.0;
        if (globalAsistPorcIncrem) {
            asist_pre_porc = Number(globalAsistPorcIncrem);
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
            catic_id: [-1, Validators.required],
            icdp_proveedor: [-2, Validators.required],
            icdp_modcontab: [0],
            icdp_precioventamin: [0.0],
            asist_pre_porc: [asist_pre_porc],
            asist_pre_util: [0.0],
            asist_pre_prevsug: [0.0]
        });

        this.artForm.controls.icdp_preciocompra_iva.disable();
        this.artForm.controls.asist_pre_util.disable();
        this.artForm.controls.asist_pre_prevsug.disable();

        this.tipoArtSel = tipoSel;
        this.tipoIvaSel = ivaSel;
    }

    getFormToPost() {
        const formvalue: any = this.artForm.getRawValue();
        const formToPost: any = {};
        for (const prop of Object.keys(formvalue)) {
            formToPost[prop] = formvalue[prop];
        }
        const provsel = formToPost.icdp_proveedor;
        const catsel = formToPost.catic_id;
        const tipoiva = formToPost.icdp_grabaiva;
        const tipic_id = formToPost.tipic_id;
        const fechaCaducidad = this.dateFormatPipe.transform(formToPost.icdp_fechacaducidad);
        formToPost.prov_id = provsel.per_id;
        formToPost.catic_id = catsel.catic_id;
        formToPost.tipic_id = tipic_id.value;
        formToPost.ic_id = this.artId;
        formToPost.icdp_fechacaducidad = fechaCaducidad;
        formToPost.codbar_auto = this.artCodAutomatic;
        formToPost.icdp_grabaiva = tipoiva.value;
        formToPost.icdp_proveedor = provsel.per_id;
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
        let msg = 'Confirma la creación del articulo/servicio';
        if (this.editing) {
            msg = 'Confirma la actualización de este articulo/servicio';
        }
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                const formtoPost = this.getFormToPost();
                this.artService.guardarArticulo(formtoPost).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.router.navigate(['mercaderia']);
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
        let ic_code = this.artForm.controls.ic_code.value;
        if (ic_code && ic_code.trim().length > 0) {
            this.artService.existeCodbar(ic_code).subscribe(res => {
                if (res.existe) {
                    this.swalService.fireWarning('Ya existe un producto o servicio registrado (' + res.nombreart + ') con el código:' +
                        ic_code + ', favor ingrese otro');
                    this.domService.setFocus('codbarraInput');
                } else {
                    this.domService.setFocus('nombreInput');
                }
            });
        }
    }

    onEnterNombre($event) {
        let ic_nombre = this.artForm.controls.ic_nombre.value;
        let tipic_id = this.artForm.controls.tipic_id.value;
        if (ic_nombre && ic_nombre.trim().length > 0) {
            if (tipic_id && tipic_id.value === 1) {
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
        if (tipoSel.value === 2) {
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
        return element.catic_id === -1;
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
}
