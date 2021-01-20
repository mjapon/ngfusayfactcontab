import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';

@Component({
    selector: 'app-facturaview',
    templateUrl: './facturaview.component.html'
})
export class FacturaviewComponent implements OnInit, OnChanges {

    @Input() trncod: number;
    doc: any;
    showAnim: boolean;

    @Output() evFacturaLoaded = new EventEmitter<any>();

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
            this.showAnim = false
            if (res.status === 200) {
                this.doc = res.doc;
                this.evFacturaLoaded.emit(this.doc);
            }
        });
    }
}
