import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';
import {CtesService} from '../../../../services/ctes.service';
import {BaseComponent} from '../../../shared/base.component';

@Component({
    selector: 'app-facturaview',
    templateUrl: './facturaview.component.html'
})
export class FacturaviewComponent extends BaseComponent implements OnInit, OnChanges {
    doc: any;
    showAnim: boolean;
    isShowImprimir = false;
    isLoading = false;
    isShowChangeSec = false;
    isCompele = false;

    @Input() trncod: number;
    @Input() isPermEdit = false;
    @Input() isPermAnul = false;
    @Input() isPermChangeSec = false;
    @Output() evFacturaLoaded = new EventEmitter<any>();
    @Output() evBtnClosed = new EventEmitter<any>();
    @Output() evAnulado = new EventEmitter<any>();
    @Output() evEditar = new EventEmitter<any>();

    @Input() showBtns = true;

    constructor(private tasientoService: AsientoService,
                private ctes: CtesService,
                private swalService: SwalService) {
        super();
    }

    ngOnInit(): void {
        this.doc = {};
        this.showAnim = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const trncodChange = changes.trncod;
        if (trncodChange.currentValue && trncodChange.currentValue > 0) {
            this.loadDatosFactura();
        }
    }

    loadDatosFactura() {
        this.showAnim = true;
        this.tasientoService.getDoc(this.trncod).subscribe(res => {
            this.showAnim = false;
            if (this.isResultOk(res)) {
                this.doc = res.doc;
                this.evFacturaLoaded.emit(this.doc);
                this.isShowImprimir = this.doc.tasiento.tra_codigo === 1 || this.doc.tasiento.tra_codigo === 2;
                this.isCompele = this.doc.isCompele||false;
            }
        });
    }

    onCloseClick() {
        this.evBtnClosed.emit();
    }

    imprimir() {
        this.tasientoService.imprimirFactura(this.trncod);
    }

    anular() {
        if (confirm(this.ctes.msgSureWishAnulRecord)) {
            this.isLoading = true;
            this.tasientoService.anular(this.trncod, '').subscribe(res => {
                this.isLoading = false;
                if (this.isResultOk(res)) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.evAnulado.emit('');
                    this.evBtnClosed.emit();
                }
            });
        }
    }

    editar() {
        if (confirm(this.ctes.msgSureWishEditRecord)) {
            this.evEditar.emit(this.trncod);
        }
    }

    changeSec() {
        this.isShowChangeSec = true;
    }

    onChangeSecDoed() {
        this.evAnulado.emit();
        this.onCloseClick();
    }

}

