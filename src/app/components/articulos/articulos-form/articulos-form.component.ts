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
import {parse} from 'date-fns';
import {DomService} from '../../../services/dom.service';

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
  tiposcaja: Array<any> = [];
  unidades: Array<any> = [];

  tiposArt: SelectItem[];
  ivas: SelectItem[];
  tipoArtSel: SelectItem;
  tipoIvaSel: SelectItem;

  defaultCat: any;
  defaultProv: any;
  defaultTipCaja: any;
  defaultUnidad: any;

  es: any;
  artId: number;
  artFromDb: any;
  editing: boolean;

  formic: any;
  formdatosprod: any;
  form: any;

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
    private messageService: MessageService,
    private domService: DomService
  ) {
    this.tiposArt = [
      {label: 'Bien', value: 'B'},
      {label: 'Servicio', value: 'S'}
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
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
      ],
      today: 'Hoy',
      clear: 'Borrar'
    };
    this.artFromDb = null;
    this.editing = false;

    this.route.paramMap.subscribe(params => {
      this.buildDefForm();
      this.artId = parseInt(params.get('art_id'), 10);
      this.editing = this.artId > 0;
      this.domService.setFocus('codbarraInput');
      this.loadArrays();
    });
  }

  catIsDefault(element, index, array) {
    return element.cat_id === -1;
  }

  provIsDefault(element, index, array) {
    return element.ref_id === -2;
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

  getTipCajaDefault(): any {
    return this.arrayUtil.getFirstResult(this.tiposcaja, this.tipCjIsDefault);
  }

  getUnidadDefault(): any {
    return this.arrayUtil.getFirstResult(this.unidades, this.unidIsDefault);
  }

  loadArrays() {
    this.refsService.listarProveedores().subscribe(res => {
      if (res.status === 200) {
        this.proveedores = res.items;
        this.defaultProv = this.getProvDefault();
      }

      this.catsService.listar().subscribe(res2 => {
        if (res2.status === 200) {
          this.categorias = res2.items;
          this.defaultCat = this.getCatDefault();
        }
        this.tipoCajaService.listarActivos().subscribe(res3 => {
          if (res3.status === 200) {
            this.tiposcaja = res3.items;
            this.defaultTipCaja = this.getTipCajaDefault();
          }
          this.unidadesService.listar().subscribe(res4 => {
            if (res4.status === 200) {
              this.unidades = res4.items;
              this.defaultUnidad = this.getUnidadDefault();
            }

            if (this.artId > 0) {
              this.artService.getByCod(this.artId).subscribe(response1 => {
                if (response1.status === 200) {
                  this.artFromDb = response1.art;
                  this.buildForm(this.artFromDb);
                }
              });
            } else {
              this.artService.getForm().subscribe((response2: any) => {
                let form: any;
                if (response2.status === 200) {
                  form = response2.form;
                  this.buildForm(form);
                }
              });
            }
          });
        });
      });
    });
  }

  buildForm(form: any) {

    /*
    let tipcaj = this.defaultTipCaja;
    let prov = this.defaultProv;
    let unid = this.defaultUnidad;
    let cat = this.defaultCat;
    if (this.editing) {
      const provid = form.prov_id;
      const cajaid = form.caja_id;
      const catid = form.cat_id;
      const uniid = form.unid_id;
      const dbcat = this.arrayUtil.getFirstResult(
        this.categorias,
        (el, idx, array) => {
          return el.cat_id === catid;
        }
      );
      const dbprov = this.arrayUtil.getFirstResult(
        this.proveedores,
        (el, idx, array) => {
          return el.ref_id === provid;
        }
      );
      const dbtipcaj = this.arrayUtil.getFirstResult(
        this.tiposcaja,
        (el, idx, array) => {
          return el.tipcj_id === cajaid;
        }
      );
      const dbunid = this.arrayUtil.getFirstResult(
        this.unidades,
        (el, idx, array) => {
          return el.uni_id === uniid;
        }
      );
      if (dbcat != null) {
        cat = dbcat;
      }
      if (dbprov != null) {
        prov = dbprov;
      }
      if (dbtipcaj != null) {
        tipcaj = dbtipcaj;
      }
      if (dbunid != null) {
        unid = dbunid;
      }
    }

    const art_feccadu = form.art_feccadu;
    let artFeccaduParsed = null;
    if (form.art_feccadu && form.art_feccadu.length > 0) {
      artFeccaduParsed = parse(art_feccadu, 'dd/MM/yyyy HH:mm', new Date());
    }
    this.artForm = this.fb.group({
      art_codbar: [form.art_codbar, Validators.required],
      art_feccadu: [artFeccaduParsed],
      art_inv: [form.art_inv],
      art_iva: [form.art_iva, Validators.required],
      art_nombre: [form.art_nombre, Validators.required],
      art_nota: [form.art_nota],
      art_precio: [form.art_precio, Validators.required],
      art_preciocompra: [form.art_preciocompra, Validators.required],
      art_preciomin: [form.art_preciomin],
      art_tipo: [form.art_tipo, Validators.required],
      caja_id: [tipcaj],
      cat_id: [cat, Validators.required],
      prov_id: [prov, Validators.required],
      unid_id: [unid, Validators.required]
    });
    */
  }

  buildDefForm() {
    this.artForm = this.fb.group({
      art_codbar: ['', Validators.required],
      art_feccadu: [null],
      art_inv: [0],
      art_iva: [false, Validators.required],
      art_nombre: ['', Validators.required],
      art_nota: [''],
      art_precio: [0.0, Validators.required],
      art_preciocompra: [0.0, Validators.required],
      art_preciomin: [0.0],
      art_tipo: ['B', Validators.required],
      caja_id: [1],
      cat_id: [-1, Validators.required],
      prov_id: [-2, Validators.required],
      unid_id: [-1, Validators.required]
    });

    this.form = this.fb.group({
      ic_nombre: '',
      ic_code: '',
      tipic_id: 1,
      ic_nota: '',
      catic_id: 1,
      dprod_grabaiva: true,
      dprod_grabaimpserv: false,
      dprod_preciocompra: 0.0,
      dprod_precioventa: 0.0,
      dprod_existencias: 0,
      dprod_proveedor: -2,
      dprod_modcontab: 0
    });
  }

  getFormToPost() {
    const formvalue: any = this.artForm.value;
    const formToPost: any = {};
    for (const prop of Object.keys(formvalue)) {
      formToPost[prop] = formvalue[prop];
    }

    const provsel = formToPost.prov_id;
    const cajasel = formToPost.caja_id;
    const catsel = formToPost.cat_id;
    const unidsel = formToPost.unid_id;

    const fechaTrans = this.dateFormatPipe.transform(formToPost.art_feccadu);
    formToPost.prov_id = provsel.ref_id;
    formToPost.caja_id = cajasel.tipcj_id;
    formToPost.cat_id = catsel.cat_id;
    formToPost.unid_id = unidsel.uni_id;
    formToPost.art_id = this.artId;
    formvalue.art_feccadu = fechaTrans;

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
