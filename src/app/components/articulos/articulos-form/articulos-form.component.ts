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

    minimumDate = new Date();

    constructor(
        private fb: FormBuilder,
        private artService: ArticuloService,
        private refsService: ReferenteService,
        private catsService: CategoriasService,
        private tipoCajaService: TipoCajaService,
        private unidadesService: UnidadesService,
        private swalService: SwalService,
        private arrayUtil: ArrayutilService,
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

        this.artFromDb = null;
        this.editing = false;
        this.proveedores = new Array<any>();

        this.route.paramMap.subscribe(params => {
            this.buildDefForm();
            this.artId = parseInt(params.get('art_id'), 10);
            this.editing = this.artId > 0;
            this.domService.setFocus('codbarraInput');
            this.loadArrays();
        });
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

    getCatDefault(): any {
        return this.arrayUtil.getFirstResult(this.categorias, this.catIsDefault);
    }

    getProvDefault(): any {
        return this.arrayUtil.getFirstResult(this.proveedores, this.provIsDefault);
    }

    loadArrays() {
        this.personaService.listarProveedores().subscribe(res => {
            if (res.status === 200) {
                this.proveedores = res.items;
                this.defaultProv = this.getProvDefault();
            }
            this.catsService.listar().subscribe(res2 => {
                if (res2.status === 200) {
                    this.categorias = res2.items;
                    this.defaultCat = this.getCatDefault();
                }
                if (this.artId > 0) {
                    this.artService.getByCod(this.artId).subscribe(response1 => {
                        if (response1.status === 200) {
                            this.artFromDb = response1.art;
                            console.log("valor de artFromDb es :");
                            console.log(this.artFromDb);
                            //this.buildForm(this.artFromDb);
                        }
                    });
                } else {
                    this.artService.getForm().subscribe((response2: any) => {
                        let form: any;
                        if (response2.status === 200) {
                            console.log("Valor de response2 form es:");
                            console.log(response2.form);
                            //form = response2.form;
                            //this.buildForm(form);
                        }
                    });
                }
            });
        });
    }

    buildForm(form: any) {
        let prov = this.defaultProv;
        let cat = this.defaultCat;
        if (this.editing) {
            const provid = form.icm_proveedor;
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
            if (dbcat != null) {
                cat = dbcat;
            }
            if (dbprov != null) {
                prov = dbprov;
            }
        }

        const icdp_fechacaducidad = form.icdp_fechacaducidad;
        let artFeccaduParsed = null;
        if (form.icdp_fechacaducidad && form.icdp_fechacaducidad.length > 0) {
            artFeccaduParsed = parse(icdp_fechacaducidad, 'dd/MM/yyyy HH:mm', new Date());
        }
        this.artForm = this.fb.group({
            ic_code: [form.ic_code, Validators.required],
            icdp_fechacaducidad: [artFeccaduParsed],
            icdp_grabaiva: [form.ic_grabaiva, Validators.required],
            ic_nombre: [form.ic_nombre, Validators.required],
            ic_nota: [form.ic_nota],
            icdp_precioventa: [form.icpre_precioventa, Validators.required],
            icdp_preciocompra: [form.icpre_preciocompra, Validators.required],
            tipic_id: [form.tipic_id, Validators.required],
            catic_id: [cat, Validators.required],
            icdp_proveedor: [prov, Validators.required]
        });
    }

    buildDefForm() {

        let tipoSel = this.tiposArt[0];
        let ivaSel = this.ivas[0];

        this.artForm = this.fb.group({
            ic_code: ['', Validators.required],
            icdp_fechacaducidad: [null],
            icdp_grabaiva: [ivaSel, Validators.required],
            ic_nombre: ['', Validators.required],
            ic_nota: [''],
            icdp_precioventa: [0.0, Validators.required],
            icdp_preciocompra: [0.0, Validators.required],
            tipic_id: [tipoSel, Validators.required],
            catic_id: [-1, Validators.required],
            icdp_proveedor: [-2, Validators.required]
        });

        this.tipoArtSel = tipoSel;
        this.tipoIvaSel = ivaSel;
    }

    getFormToPost() {
        const formvalue: any = this.artForm.value;
        const formToPost: any = {};
        for (const prop of Object.keys(formvalue)) {
            formToPost[prop] = formvalue[prop];
        }

        const provsel = formToPost.icm_proveedor;
        const catsel = formToPost.catic_id;

        const fechaTrans = this.dateFormatPipe.transform(formToPost.icm_fechacaducidad);
        formToPost.prov_id = provsel.per_id;
        formToPost.catic_id = catsel.catic_id;
        formToPost.ic_id = this.artId;
        formvalue.icm_fechacaducidad = fechaTrans;

        return formToPost;
    }

    procesaForm() {
        this.getFormToPost();
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
                        this.swalService.fireSuccess(res.msg);
                        this.router.navigate(['mercaderia']);
                    }
                });
            }
        });
    }

    cancelar() {
        this.router.navigate(['mercaderia']);
    }
}
