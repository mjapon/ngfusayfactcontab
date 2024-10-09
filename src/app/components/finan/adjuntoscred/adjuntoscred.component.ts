import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CtesService } from 'src/app/services/ctes.service';
import { FinanCreditosService } from 'src/app/services/finan/finacreditos.service';
import { RxdocsService } from 'src/app/services/rxdocs.service';
import { SwalService } from 'src/app/services/swal.service';
import { BaseComponent } from '../../shared/base.component';

@Component({
    selector: 'app-finadjuntoscred',
    templateUrl: './adjuntoscred.component.html'
})
export class FinanAdjuntosCredComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() cred = 0;

    adjuntos: Array<any> = [];

    datafile: any;
    filepreview: any;
    base64data: any = null;
    adjisimage = false;
    isShowCrea = false;

    form: any = {};

    constructor(private swalService: SwalService,
                private credService: FinanCreditosService,
                private ctes: CtesService,
                private adjService: RxdocsService) {
        super();
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        const changeCred = changes.cred;
        if (changeCred.currentValue) {
            this.loadAdjuntos();
        }
    }

    loadAdjuntos(): void {
        this.credService.listarAdjuntos(this.cred).subscribe(res => {
            if (this.isResultOk(res)) {
                this.adjuntos = res.adjuntos;
            }
        });
    }

    showFormCrea() {
        this.form = {};
        this.credService.getFormAdjunto(this.cred).subscribe(res => {
            if (this.isResultOk(res)) {
                this.form = res.form;
                this.isShowCrea = true;
            }
        });
    }

    cancelar() {
        this.isShowCrea = false;
        this.form = {};
        this.clearFile();
    }

    guardar() {
        const msg = '¿Seguro que desea registrar el adjunto?';
        const filetopost = null;
        if (this.datafile && this.base64data) {
            this.form.adj_filename = this.datafile.name;
            this.form.archivo = this.base64data;
        }

        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.credService.guardarAdjunto(this.form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        console.log('Valor de res es', res);
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadAdjuntos();
                        this.isShowCrea = false;
                    }
                });
            }
        });
    }


    onFileChange(fileInput: any) {
        this.datafile = fileInput.target.files[0];
        this.adjisimage = false;
        if (this.datafile) {
            const length = (this.datafile.size / 1024) / 1024;
            if (length > 10) {
                this.clearFile();
                this.swalService.fireError(this.ctes.msgTamanioArchivo);
            } else {
                this.processFile();
            }
        } else {
            this.filepreview = null;
            this.base64data = null;
        }
    }

    clearFile() {
        this.filepreview = null;
        this.base64data = null;
    }

    processFile() {
        const mimeType = this.datafile.type;
        const rega = /image|pdf|document/;
        const regimg = /image/;
        this.adjisimage = regimg.test(mimeType);
        if (rega.test(mimeType)) {
            const reader = new FileReader();
            reader.readAsDataURL(this.datafile);
            reader.onload = (e) => {
                this.filepreview = reader.result;
                this.base64data = this.filepreview;
            };
        } else {
            this.clearFile();
            this.swalService.fireError(this.ctes.msgTipoArchivoNoAdm);
        }
    }


    descarga(fila) {
        const docadj = { pgc_adj: fila.adj_id, adj_filename: fila.adj_filename };
        this.adjService.openWindows(this.adjService.getDownloadAdjUrlNode(docadj));
    }


}
