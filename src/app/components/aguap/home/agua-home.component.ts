import {Component, OnInit} from '@angular/core';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {UsertokenService} from '../../../services/usertoken.service';
import {BaseComponent} from '../../shared/base.component';

import {SwalService} from '../../../services/swal.service';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-contratos',
    templateUrl: './agua-home.html'
})
export class AguaHomeComponent extends BaseComponent implements OnInit {
    isLoading = false;
    hasRolViewPagMavil = false;
    hasRolCreaContra = false;
    hasRolAdmlecto = false;
    hasRolCobroAgua = false;
    hasRolListaContra = false;
    hasRolListaLecto = false;

    constructor(private contraAgua: ContratoaguaService,
                private userTokenServ: UsertokenService,
                private ctes: CtesAguapService,
                private swalService: SwalService,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        const pagmavilobs = this.userTokenServ.chkrol(this.ctes.agp_pagosmavil);
        const creacontraobs = this.userTokenServ.chkrol(this.ctes.agp_creacont);
        const admlectoobs = this.userTokenServ.chkrol(this.ctes.agp_admlecto);
        const cobroaguaobs = this.userTokenServ.chkrol(this.ctes.agp_cobroagua);
        const listacontraobs = this.userTokenServ.chkrol(this.ctes.agp_listacontra);
        const listalectoobs = this.userTokenServ.chkrol(this.ctes.agp_listalecto);

        forkJoin([pagmavilobs, creacontraobs, admlectoobs,
            cobroaguaobs, listacontraobs, listalectoobs]).subscribe(res => {
            const res0 = res[0];
            const res1 = res[1];
            const res2 = res[2];
            const res3 = res[3];
            const res4 = res[4];
            const res5 = res[5];
            if (this.isResultOk(res0)) {
                this.hasRolViewPagMavil = res0.hasperm;
            }
            if (this.isResultOk(res1)) {
                this.hasRolCreaContra = res1.hasperm;
            }
            if (this.isResultOk(res2)) {
                this.hasRolAdmlecto = res2.hasperm;
            }
            if (this.isResultOk(res3)) {
                this.hasRolCobroAgua = res3.hasperm;
            }
            if (this.isResultOk(res4)) {
                this.hasRolListaContra = res4.hasperm;
            }
            if (this.isResultOk(res5)) {
                this.hasRolListaLecto = res5.hasperm;
            }
        });

        /*
        this.userTokenServ.chkrol(this.ctes.agp_pagosmavil).subscribe(res => {
            if (this.isResultOk(res)) {
                this.hasRolViewPagMavil = res.hasperm;
            }
        });
         */
    }

    goToForm() {
        this.router.navigate([this.ctes.rutaContraForm]);
    }

    gotoLectoMed() {
        this.router.navigate([this.ctes.rutaLectoMedForm]);
    }

    gotoPagos() {
        this.router.navigate([this.ctes.rutaPagos]);
    }

    _getRuta(grid) {
        const base = this.ctes.rutaListadosBase;
        return `${base}${grid}`;
    }

    gotoListaContratos() {
        this.router.navigate([this._getRuta(this.ctes.agp_contratos)]);
    }

    gotoListaLecturas() {
        this.router.navigate([this._getRuta(this.ctes.agp_lecturas)]);
    }

    gotoRepPagoMavil() {
        this.router.navigate([this.ctes.rutaPagoMavil]);
    }
}
