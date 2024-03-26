import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsientoService} from '../../../../services/asiento.service';
import {SwalService} from '../../../../services/swal.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-asientoview',
    templateUrl: './asientoview.component.html',
    styles: [
        `
            .haberl {
                margin-left: 70px;
            }
        `]
})
export class AsientoviewComponent implements OnInit, OnChanges {

    @Input() trncod: number;
    @Output() evCerrar = new EventEmitter<any>();
    @Output() evAnulado = new EventEmitter<any>();

    isLoading = false;
    datosasi: any = {};
    totales: any = {};
    detalles = [];
    datosfactrel: any = {};

    @Input() showBtns = true;

    isShowDocRel = false;
    isFactura = false;
    trncodrel = 0;
    isShowChangeSec = false;

    constructor(private asientoService: AsientoService,
                private swalService: SwalService,
                private router: Router) {

    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const chng = changes.trncod;
        if (chng.currentValue) {
            this.loadDatosAsiento();
        }
    }

    loadDatosAsiento() {
        this.isLoading = true;
        this.asientoService.getDatosAsiContab(this.trncod).subscribe(res => {
            this.isLoading = false;
            this.datosasi = res.datoasi;
            this.totales = this.datosasi.totales;
            this.detalles = this.datosasi.detalles;
            this.datosfactrel = this.datosasi.factrel;
            if (this.datosfactrel) {
                this.trncodrel = this.datosfactrel.trn_codigo;
                this.isFactura = this.datosfactrel.isfact;
            }
        });
    }

    onCerraBtn() {
        this.evCerrar.emit('');
    }

    toggleShowDocRel() {
        this.isShowDocRel = !this.isShowDocRel;
    }

    hideDocRel() {
        this.isShowDocRel = false;
    }

    changeSec() {
        this.isShowChangeSec = true;
    }

    onChangeSecDoed() {
        this.isShowChangeSec = false;
        this.evAnulado.emit('');
    }

    onChangeSecHide() {
        this.isShowChangeSec = false;
        console.log('onChangeSecHide-->', this.isShowChangeSec);    
    }

    doCloneAction() {
        const msg = '¿Confirma que desea crear una copia de este asiento?';
        this.swalService.fireDialog(msg, '').then(confirm => {
            if (confirm.value) {
                this.router.navigate(['newasiento', this.trncod], {queryParams: {accion: 'clone'}});
            }
        });
    }

    doReverseAction() {
        const msg = '¿Confirma que desea crear un reverso de este asiento?';
        this.swalService.fireDialog(msg, '').then(confirm => {
            if (confirm.value) {
                this.router.navigate(['newasiento', this.trncod], {queryParams: {accion: 'revert'}});
            }
        });
    }
}
