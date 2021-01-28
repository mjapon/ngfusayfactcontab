import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {VentaticketService} from '../../../../services/ventaticket.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {SwalService} from '../../../../services/swal.service';
import {RxdocsService} from '../../../../services/rxdocs.service';

@Component({
    selector: 'app-vticketview',
    template: `
        <div>
            <div *ngIf="isLoading">
                <app-loading></app-loading>
            </div>
            <div *ngIf="!isLoading">
                <div class="row">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Fecha de registro: </span>
                            </div>
                            <div class="col-md-8">
                                <span class="font-weight-bold"> {{datosvticket.vt_fechareg}} </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Registrado por: </span>
                            </div>
                            <div class="col-md-8">
                                <span class="font-weight-bold"> {{datosvticket.refusercrea}} </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Fecha rubro: </span>
                            </div>
                            <div class="col-md-8">
                                <span class="font-weight-bold"> {{datosvticket.vt_fecha}} </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Rubro: </span>
                            </div>
                            <div class="col-md-8">
                                <span class="font-weight-bold"> {{datosvticket.ic_nombre}} </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Monto: </span>
                            </div>
                            <div class="col-md-8">
                                <span class="font-weight-bold"> $ {{datosvticket.vt_monto}} </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Estado: </span>
                            </div>
                            <div class="col-md-8">
                                <span class="font-weight-bold"> {{datosvticket.estadodesc}} </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <span class="font-weight-light"> Adjunto: </span>
                            </div>
                            <div class="col-md-8">
                                <div *ngIf="datosvticket.rxd_id>0">
                                    <span class="font-weight-bold"> <i
                                            class="fas fa-paperclip"></i> {{datosvticket.rxd_filename}} </span>
                                    <button class="btn btn-outline-secondary btn-sm ml-3" (click)="showAdjunto()"> Ver
                                    </button>
                                </div>
                                <span class="text-muted" *ngIf="!datosvticket.rxd_id>0"> Sin adjunto </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <span class="font-weight-light"> Observación: </span>
                            </div>
                            <div class="col-md-12">
                                <p style="white-space: pre-line"> {{datosvticket.vt_obs}} </p>
                            </div>
                        </div>

                    </div>
                </div>
                <!--
                <div class="row" *ngIf="adjisimage">
                    <div class="col">
                        <div style="width: 100%; height: 300px; overflow: auto">
                            <img [src]="urlimgadj" class="img-responsive"/>
                        </div>
                    </div>
                </div>
                -->
                <div class="row">
                    <div class="col">
                        <div class="mt-2 d-flex flex-row-reverse">
                            <button class="btn btn-outline-primary ml-1" (click)="onCerraBtn()"><i
                                    class="fa fa-times"></i>
                                Cerrar
                            </button>
                            <button class="btn btn-outline-primary ml-1" (click)="onConfirmarBtn()"
                                    *ngIf="datosvticket.vt_estado===0">
                                <i class="fa fa-check"></i>
                                Confirmar
                            </button>
                            <button class="btn btn-outline-primary" (click)="onAnularBtn()"
                                    *ngIf="datosvticket.vt_estado===0">
                                <i class="fa fa-trash"></i>
                                Anular
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class VticketviewComponent implements OnInit, OnChanges {
    @Input() vtickecod: number;
    datosvticket: any;
    isLoading = true;
    @Output() evCerrarBtn = new EventEmitter<any>();
    @Output() evConfirma = new EventEmitter<any>();
    @Output() evAnula = new EventEmitter<any>();

    adjisimage = false;
    urlimgadj = '';

    constructor(private vtService: VentaticketService,
                private loadingUiService: LoadingUiService,
                private rxDocsServ: RxdocsService,
                private swalService: SwalService) {

    }

    ngOnInit(): void {
        this.datosvticket = {};
    }

    ngOnChanges(changes: SimpleChanges): void {
        const vticketcodchange = changes.vtickecod;
        const currentvalue = vticketcodchange.currentValue;
        if (currentvalue) {
            this.loadDatosTicket();
        }
    }

    loadDatosTicket() {
        this.isLoading = true;
        this.adjisimage = false;
        this.urlimgadj = '';
        this.vtService.getDetalles(this.vtickecod).subscribe(res => {
            if (res.status === 200) {
                this.datosvticket = res.detalles;
                const mimeType = this.datosvticket.rxd_ext;
                if (mimeType) {
                    const regimg = /image/;
                    this.adjisimage = regimg.test(mimeType);
                    this.urlimgadj = this.rxDocsServ.getDownloadUrlNode(this.datosvticket);
                }
            }
            this.isLoading = false;
        });
    }

    onCerraBtn() {
        this.evCerrarBtn.emit('');
    }

    onAnularBtn() {
        if (this.datosvticket.vt_estado === 0) {
            this.swalService.fireDialog('¿Confirma que desea anular este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.vtService.anular(this.datosvticket.vt_id).subscribe(res => {
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
        if (this.datosvticket.vt_estado === 0) {
            this.swalService.fireDialog('¿Confirmar este registro?', '').then(confirm => {
                    if (confirm.value) {
                        this.loadingUiService.publishBlockMessage();
                        this.vtService.confirmar(this.datosvticket.vt_id).subscribe(res => {
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
        const url = this.rxDocsServ.getDownloadUrlNode(this.datosvticket);
        window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600');
    }

}
