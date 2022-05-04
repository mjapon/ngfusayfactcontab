import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FinanCreditosService } from "src/app/services/finan/finacreditos.service";
import { SwalService } from "src/app/services/swal.service";
import { BaseComponent } from "../../shared/base.component";
import { CtesFinanService } from "../ctesfina.service";


@Component({
    selector: 'app-finacredet',
    styles: [
        `
        .labelmj { 
            width: 130px;
            float: left;
        }
        .labelmj:after { content: ": " }

        .labelcred { 
            width: 160px;
            float: left;
        }
        .labelcred:after { content: ": " }

    `],
    templateUrl: './financreddet.component.html'
})
export class FinanCredDetComponent extends BaseComponent implements OnInit {

    datoscred: any = {};
    referente: any = {};
    tablamor: Array<any> = [];
    codcred: number = 0;
    currentTab = 1;

    constructor(private credService: FinanCreditosService,
        private router: Router,
        private ctesFinanServ: CtesFinanService,
        private swalService: SwalService,
        private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.codcred = parseInt(params.get('cred'));
            this.loadDatosCred();
        });
    }

    loadDatosCred() {
        this.credService.getDatosCredFull(this.codcred).subscribe(res => {
            if (this.isResultOk(res)) {
                this.datoscred = res.datoscred.credito;
                this.referente = res.datoscred.referente;
                this.tablamor = res.datoscred.tabla;
            }
        });
    }

    auxCambiaEstado(msgConfirm, newState) {
        this.swalService.fireDialog(msgConfirm).then(confirm => {
            if (confirm.value) {
                const form = this.credService.getFormCambioEstado(this.codcred, newState);
                this.credService.cambiarEstado(form).subscribe(res => {
                    if (this.isResultOk(res)) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadDatosCred();
                    }
                });
            }
        });
    }

    aprobar() {
        this.auxCambiaEstado('¿Seguro que desea aprobar este crédito?', 2);
    }

    anular() {
        this.auxCambiaEstado('¿Seguro que desea anular este crédito?', 4);
    }


    gotoList() {
        this.router.navigate([this.ctesFinanServ.rutaHome]);
    }

    imprimir() {
        this.credService.imprimirTablaAmor(this.datoscred.cre_id);
    }

    imprimirPagare() {
        this.credService.imprimirPagare(this.datoscred.cre_id);
    }

}