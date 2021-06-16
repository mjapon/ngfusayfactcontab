import {Component, OnInit} from '@angular/core';
import {ContratoaguaService} from '../../../services/agua/contratoagua.service';
import {Router} from '@angular/router';
import {CtesAguapService} from '../utils/ctes-aguap.service';
import {UsertokenService} from '../../../services/usertoken.service';
import {BaseComponent} from '../../shared/base.component';
// import {ChatService} from '../../../services/chat.service';
import {SwalService} from '../../../services/swal.service';

@Component({
    selector: 'app-contratos',
    templateUrl: './agua-home.html'
})
export class AguaHomeComponent extends BaseComponent implements OnInit {
    isLoading = false;
    hasRolViewPagMavil = false;

    constructor(private contraAgua: ContratoaguaService,
                private userTokenServ: UsertokenService,
                private ctes: CtesAguapService,
                // private chatService: ChatService,
                private swalService: SwalService,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.userTokenServ.chkrol(this.ctes.agp_pagosmavil).subscribe(res => {
            if (this.isResultOk(res)) {
                this.hasRolViewPagMavil = res.hasperm;
            }
        });
        /*
        this.chatService.getNewPixelMessage().subscribe((message: any) => {
            if (message) {
                this.swalService.fireToastSuccess(message);
                console.log('Mensaje desde el socket:', message);
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

    /*
    testSocket() {
        console.log('Se envia mensaje---');
        this.chatService.sendMessage('prueba de mensaje desde agua-home');
        console.log('Mensaje enviado');

    }
     */
}
