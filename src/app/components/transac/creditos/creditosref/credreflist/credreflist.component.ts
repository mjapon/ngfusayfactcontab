import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CreditoService} from '../../../../../services/credito.service';

@Component({
    selector: 'app-credreflist',
    templateUrl: './credreflist.component.html'
})
export class CredreflistComponent implements OnInit, OnChanges {

    creditosList: Array<any> = [];
    loadingCreditos: boolean;
    totalescred: any;
    credsel: any;
    isShowDetCred = false;
    isShowCreaCred = false;
    tipospagos = [];
    tipopago = 1; // 0-todos, 1-con saldo pendiente, 2-pagados en su totalidad
    rows = 5;
    page = 0;

    // 1- Ventas, 2-Compras
    @Input() clase: number;
    @Input() codref: number;
    @Output() evDeudasChange = new EventEmitter<any>();

    constructor(private creditoService: CreditoService) {
        this.tipospagos = this.creditoService.getTiposPagos();
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.codref;
        if (chng.currentValue) {
            this.loadCreditos();
        }
    }

    loadCreditos() {
        this.loadingCreditos = true;
        this.creditoService.listarCreditos(this.codref, this.clase, this.tipopago).subscribe(resc => {
            this.loadingCreditos = false;
            if (resc.status === 200) {
                this.creditosList = resc.creds;
                this.totalescred = resc.totales;
            }
        });
    }

    showFormCrea() {
        this.isShowCreaCred = true;
    }

    showDetallesCredito(fila: any) {
        this.credsel = fila;
        this.isShowDetCred = true;
    }

    onDeudasChange($event: any) {
        this.evDeudasChange.emit($event);
    }

    hideDetCredito() {
        this.isShowDetCred = false;
        this.loadCreditos();
    }

    onCancelaCreaCred() {
        this.isShowCreaCred = false;
        this.loadCreditos();
    }

    protected readonly Math = Math;
}
