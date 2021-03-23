import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BilleteramovService} from '../../../services/billeteramov.service';
import {LoadingUiService} from '../../../services/loading-ui.service';
import {RxdocsService} from '../../../services/rxdocs.service';
import {SwalService} from '../../../services/swal.service';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
    selector: 'app-ingegrview',
    templateUrl: './ingegrview.component.html'
})
export class IngegrviewComponent implements OnInit, OnChanges {

    @Input() codmov: number;
    @Output() evCerrarBtn = new EventEmitter<any>();
    @Output() evConfirma = new EventEmitter<any>();
    @Output() evAnula = new EventEmitter<any>();

    isLoading = true;
    adjisimage = false;
    urlimgadj = '';
    datosmov: any = {};
    datosasiento: any = {};
    filasdebe: Array<any> = [];
    filashaber: Array<any> = [];

    constructor(private billMovService: BilleteramovService,
                private loadingUiService: LoadingUiService,
                private rxDocsServ: RxdocsService,
                private swalService: SwalService) {
        registerLocaleData(es);
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const codmovchange = changes.codmov;
        const currentvalue = codmovchange.currentValue;
        if (currentvalue) {
            this.loadDatosMov();
        }
    }

    loadDatosMov() {
        this.isLoading = true;
        this.adjisimage = false;
        this.urlimgadj = '';
        this.billMovService.getDatosMov(this.codmov).subscribe(res => {
            if (res.status === 200) {
                this.datosmov = res.datosmov.datosmov;
                this.datosasiento = res.datosmov.asiento;
                this.computeDatosAsiento();
                const mimeType = this.datosmov.rxd_ext;
                if (mimeType) {
                    const regimg = /image/;
                    this.adjisimage = regimg.test(mimeType);
                    this.urlimgadj = this.rxDocsServ.getDownloadUrlNode(this.datosmov);
                }
            }
            this.isLoading = false;
        });
    }

    computeDatosAsiento() {
        this.filasdebe = this.datosasiento?.detalles.filter(row => row.dt_debito === 1);
        this.filashaber = this.datosasiento?.detalles.filter(row => row.dt_debito === -1);
    }

    onCerraBtn() {
        this.evCerrarBtn.emit('');
    }

    onAnularBtn() {
        if (this.datosmov.bmo_estado === 0) {
            this.swalService.fireDialog('¿Confirma que desea anular este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.billMovService.anular(this.codmov).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.evAnula.emit('');
                            }
                        });
                    }
                }
            );
        } else {
            this.swalService.fireToastError('No es posible');
        }
    }

    onConfirmarBtn() {
        if (this.datosmov.bmo_estado === 0) {
            this.swalService.fireDialog('¿Confirmar este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.billMovService.confirmar(this.codmov).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.evConfirma.emit('');
                            }
                        });
                    }
                }
            );
        } else {
            this.swalService.fireToastError('No es posible');
        }
    }

    showAdjunto() {
        const url = this.rxDocsServ.getDownloadUrlNode(this.datosmov);
        window.open(url, '_blank', 'toolbar=yes,scrollb ars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }
}
