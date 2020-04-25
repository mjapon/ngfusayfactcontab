import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {ArticuloService} from "../../../services/articulo.service";
import {SwalService} from "../../../services/swal.service";
import {DomService} from "../../../services/dom.service";

@Component({
    selector: '[app-articulo-item-batch]',
    templateUrl: './articulo-item-batch.component.html',
    styleUrls: ['./articulo-item-batch.component.css']
})
export class ArticuloItemBatchComponent implements OnInit {

    @Input() rowNumber: number;
    @Input() rowFormGroup: any;
    @Input() defaultTipo: any;
    @Input() defaultCat: any;
    @Input() defaultProv: any;
    @Input() secId: number;

    submited: boolean;

    numbersPattern: string = '^[0-9]*\\.*[0-9]*$';

    ivas: SelectItem[];
    //@Input() rowFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private artService: ArticuloService,
                private swalService: SwalService,
                private domService: DomService) {
        console.log('Valor de rowForm es:');
        console.log(this.rowFormGroup);
        this.ivas = [
            {label: 'Si', value: true},
            {label: 'No', value: false}
        ];


        this.buildForm();
    }

    ngOnInit() {
    }

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


}
