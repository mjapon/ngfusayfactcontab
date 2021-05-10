import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';

@Component({
    selector: 'app-facturaview',
    templateUrl: './facturaview.component.html'
})
export class FacturaviewComponent implements OnInit, OnChanges {
    doc: any;
    showAnim: boolean;
    isShowImprimir = false;
    isLoading = false;

    @Input() trncod: number;
    @Input() isPermEdit = false;
    @Input() isPermAnul = false;
    @Output() evFacturaLoaded = new EventEmitter<any>();
    @Output() evBtnClosed = new EventEmitter<any>();
    @Output() evAnulado = new EventEmitter<any>();
    @Output() evEditar = new EventEmitter<any>();

    @Input() showBtns = true;

    constructor(private tasientoService: AsientoService,
                private swalService: SwalService) {
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
            if (res.status === 200) {
                this.doc = res.doc;
                this.evFacturaLoaded.emit(this.doc);
                this.isShowImprimir = this.doc.tasiento.tra_codigo === 1 || this.doc.tasiento.tra_codigo === 2;
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
        const msg = '¿Seguro que desea anular esta factura?';
        if (confirm(msg)) {
            this.isLoading = true;
            this.tasientoService.anular(this.trncod, '').subscribe(res => {
                this.isLoading = false;
                if (res.status === 200) {
                    this.swalService.fireToastSuccess(res.msg);
                    this.evAnulado.emit('');
                    this.evBtnClosed.emit();
                }
            });
        }
    }

    editar() {
        const msg = '¿Seguro que desea editar este comprobante?';
        if (confirm(msg)) {
            this.evEditar.emit(this.trncod);
        }
    }
}
