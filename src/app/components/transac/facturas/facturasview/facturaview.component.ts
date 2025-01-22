import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';
import {CtesService} from '../../../../services/ctes.service';
import {BaseComponent} from '../../../shared/base.component';
import {FacteComprobService} from 'src/app/services/facte/comprob.service';
import {CompeleService} from 'src/app/services/compele.service';

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
    facteleinfo: any = {};
    datosnotacred: any = {};

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
                private facteService: FacteComprobService,
                private ctes: CtesService,
                private compele: CompeleService,
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
                const traCodigoDoc = this.doc.tasiento.tra_codigo;
                this.isShowImprimir = traCodigoDoc === 1 || traCodigoDoc === 2 || traCodigoDoc === 14;
                this.isCompele = this.doc.isCompele || false;
                this.facteleinfo = this.doc.facteleinfo;
                if (res.notacred) {
                    this.datosnotacred = res.notacred;
                }
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

    imprimirRIDE() {
        this.facteService.genRIDEPDF(this.facteleinfo.tfe_claveacceso);
    }

    enviarSRI() {
        this.showAnim = true;
        this.swalService.fireToastInfo('Se envió comprobante al SRI, favor esperar respuesta');
        this.compele.enviar(this.trncod).subscribe(res => {
            this.showAnim = false;
            this.loadDatosFactura();
        });
    }

    isEnableEnviarSRI() {
        return this.facteleinfo.tfe_estado === 0 || this.facteleinfo.tfe_estado === 4;
    }

    isEnableAutorizarSRI() {
        return this.facteleinfo.tfe_estado === 5;
    }

    isEnableImprimeRIDE() {
        return this.facteleinfo.tfe_estado === 1;
    }

    autorizarSRI() {
        this.showAnim = true;
        this.compele.consultaEstadoAut(this.trncod).subscribe(res => {
            this.swalService.fireToastInfo('Se envió consulta al SRI, favor esperar');
            setTimeout(() => {
                this.showAnim = false;
                this.loadDatosFactura();
            }, 5000);
        });
    }

    getClassBadgeFactele() {
        let classbadge = 'bg-warning';
        let tfe_estado = this.facteleinfo.tfe_estado;
        if (tfe_estado === 1) {
            classbadge = 'bg-success';
        } else if (tfe_estado === 2) {
            classbadge = 'bg-danger';
        }
        return classbadge;
    }

    notaCredito() {
        if (confirm(this.ctes.msgConfirmNotaCred)) {
            this.showAnim = true;
            this.tasientoService.generarNotaCredito(this.trncod).subscribe(res => {
                if (res.trncodgen) {
                    this.swalService.fireToastSuccess('La nota de crédito fue emitida de forma exitosa');
                    this.loadDatosFactura();
                } else {
                    this.swalService.fireToastError('No se puedo emitir la nota de crédito');
                }
                this.showAnim = false;
            });
        }
    }
}

