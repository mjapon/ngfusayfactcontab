import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {ArrayutilService} from '../../../services/arrayutil.service';
import {CategoriasService} from '../../../services/categorias.service';
import {PersonaService} from '../../../services/persona.service';
import {SeccionService} from '../../../services/seccion.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-articulos-batch',
    templateUrl: './articulos-batch.component.html',
    styleUrls: ['./articulos-batch.component.css']
})
export class ArticulosBatchComponent implements OnInit {

    tiposArt: SelectItem[];
    categorias: Array<any> = [];
    proveedores: Array<any> = [];
    secciones: Array<any> = [];
    filas: Array<any> = [];
    tipoArtSelected: SelectItem;
    categSelected: any;
    proveedorSelected: any;
    secSelected: any;
    numbersPattern: string = '^[0-9]*\\.*[0-9]*$';

    constructor(private arrayUtil: ArrayutilService,
                private fb: FormBuilder,
                private catsService: CategoriasService,
                private personaService: PersonaService,
                private secService: SeccionService,
                private router: Router) {

        this.tiposArt = [
            {label: 'Bien', value: 1},
            {label: 'Servicio', value: 2}
        ];

        this.tipoArtSelected = this.tiposArt[0];

        this.personaService.listarProveedores().subscribe(resProv => {
            if (resProv.status === 200) {
                this.proveedores = resProv.items;
                this.proveedorSelected = this.getProvDefault();
            }
            this.catsService.listar().subscribe(resCat => {
                if (resCat.status === 200) {
                    this.categorias = resCat.items;
                    this.categSelected = this.getCatDefault();
                }

                this.secService.listar().subscribe(resSec => {
                    if (resSec.status === 200) {
                        this.secciones = resSec.items;
                        this.secSelected = this.getSecDefault();
                    }
                });
            });
        });

        this.filas = new Array<any>();
        this.filas.push(this.getNewForm());
        this.filas.push(this.getNewForm());
    }

    getNewForm(): FormGroup {
        let rowFormGroup = this.fb.group({
            ic_code: [' ', Validators.required],
            icdp_grabaiva: [{}, Validators.required],
            ic_nombre: ['', Validators.required],
            ic_nota: [''],
            icdp_precioventa: [0.0, Validators.compose([Validators.required, Validators.pattern(this.numbersPattern)])],
            icdp_preciocompra: [0.0, Validators.compose([Validators.required, Validators.pattern(this.numbersPattern)])],
            icdp_preciocompra_iva: [0.0, Validators.required],
            tipic_id: [{}, Validators.required],
            catic_id: [{}, Validators.required],
            icdp_proveedor: [{}, Validators.required],
            icdp_modcontab: [0],
            icdp_precioventamin: [0.0],
            sec_forstock: 1,
            sec_stock: 0
        });
        return rowFormGroup;
    }

    ngOnInit() {

    }

    /*
  get f() {
    return this.rowFormGroup.controls;
  }

  buildForm() {
    let tipo = this.defaultTipo;
    let iva = this.ivas[0];

    this.rowFormGroup = this.fb.group({
      ic_code: [' ', Validators.required],
      icdp_grabaiva: [iva, Validators.required],
      ic_nombre: ['', Validators.required],
      ic_nota: [''],
      icdp_precioventa: [0.0, Validators.compose([Validators.required, Validators.pattern(this.numbersPattern)])],
      icdp_preciocompra: [0.0, Validators.compose([Validators.required, Validators.pattern(this.numbersPattern)])],
      icdp_preciocompra_iva: [0.0, Validators.required],
      tipic_id: [tipo, Validators.required],
      catic_id: [this.defaultCat, Validators.required],
      icdp_proveedor: [this.defaultProv, Validators.required],
      icdp_modcontab: [0],
      icdp_precioventamin: [0.0],
      sec_forstock: this.secId,
      sec_stock: 0
    });
  }

  getInputId(inputId: string) {
    return this.rowNumber + '_' + inputId;
  }

  onEnterCodBarra($event) {
    let ic_code = this.rowFormGroup.controls.ic_code.value;
    if (ic_code && ic_code.trim().length > 0) {
      this.artService.existeCodbar(ic_code).subscribe(res => {
        if (res.existe) {
          this.swalService.fireWarning('Ya existe un producto o servicio registrado (' + res.nombreart + ') con el código:' +
              ic_code + ', favor ingrese otro');
          this.domService.setFocus(this.getInputId('codbarraInput'));
        } else {
          this.domService.setFocus(this.getInputId('nombreInput'));
        }
      });
    }
  }

  onKeyupPrecioCompra($event) {
    this.calculaPrecioCompraConIva();
  }

  getPrecioConIva(precio: number) {
    let precioConIva = 0.0;
    if (precio) {
      if (this.rowFormGroup.controls.icdp_grabaiva.value.value) {
        precioConIva = Number(precio) * Number('1.12');
      } else {
        precioConIva = Number(precio);
      }
    }
    return precioConIva.toFixed(2);
  }

  calculaPrecioCompraConIva() {
    const precioConIva = this.getPrecioConIva(this.rowFormGroup.controls.icdp_preciocompra.value);
    this.rowFormGroup.controls.icdp_preciocompra_iva.setValue(precioConIva.toString());
  }

  onEnterNombre($event) {
    let ic_nombre = this.rowFormGroup.controls.ic_nombre.value;
    let tipic_id = this.rowFormGroup.controls.tipic_id.value;
    if (ic_nombre && ic_nombre.trim().length > 0) {
      if (tipic_id && tipic_id.value === 1) {
        this.domService.setFocus(this.getInputId('precioCompraInput'));
      } else {
        this.domService.setFocus(this.getInputId('precioVentaInput'));
      }
    }
  }

  onEnterPrecioCompra($event) {
    this.domService.setFocus(this.getInputId('precioVentaInput'));
  }

  onEnterPrecioVenta($event) {
    this.domService.setFocus(this.getInputId('stockInput'));
  }

  onEnterStock($event) {
    this.domService.setFocus(this.getInputId('ic_nota'));
  }

  onEnterNota($event) {
    this.submited = true;
    if (this.rowFormGroup.invalid) {
      this.swalService.fireToastError('Existen datos inválidos, verifique la información ingresad');
      return;
    } else {
      alert('Se debe hacer submit del formulario');
    }
  }
  */

    provIsDefault(element, index, array) {
        return element.per_id === -2;
    }

    getProvDefault(): any {
        return this.arrayUtil.getFirstResult(this.proveedores, this.provIsDefault);
    }

    catIsDefault(element, index, array) {
        return element.catic_id === -1;
    }

    secIsDefault(element, index, array) {
        return element.sec_id === 1;
    }

    getCatDefault(): any {
        return this.arrayUtil.getFirstResult(this.categorias, this.catIsDefault);
    }

    getSecDefault(): any {
        return this.arrayUtil.getFirstResult(this.secciones, this.secIsDefault);
    }

    cancelar() {
        this.router.navigate(['mercaderia']);
    }


}
