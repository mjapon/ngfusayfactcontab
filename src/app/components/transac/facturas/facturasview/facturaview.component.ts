import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';

@Component({
    selector: 'app-facturaview',
    templateUrl: './facturaview.component.html'
})
export class FacturaviewComponent implements OnInit, OnChanges {
    doc: any;
    showAnim: boolean;
    isShowImprimir = false;

    @Input() trncod: number;
    @Output() evFacturaLoaded = new EventEmitter<any>();
    @Output() evBtnClosed = new EventEmitter<any>();

    @Input() showBtns = true;

    constructor(private tasientoService: AsientoService) {
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
}
