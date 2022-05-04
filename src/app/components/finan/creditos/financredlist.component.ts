import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DomService } from "src/app/services/dom.service";
import { FinanCreditosService } from "src/app/services/finan/finacreditos.service";
import { BaseComponent } from "../../shared/base.component";
import { CtesFinanService } from "../ctesfina.service";

@Component({
    selector: 'app-financredlist',
    templateUrl: "./financredlist.component.html"
})
export class FinanCredListComponent extends BaseComponent implements OnInit {

    gridCreditos: any = {};
    filtro = '';
    previustimer: any = 0;
    currentRowOver = -1;
    estados: any = [];
    estadosel: any = {};

    constructor(private credService: FinanCreditosService,
        private router: Router,
        private ctesFinanceService: CtesFinanService,
        private domService: DomService) {
        super();
    }

    ngOnInit() {
        this.loadForm();
        this.loadCreditos();
    }

    onestadochange(event) {
        this.loadCreditos();
    }

    loadForm() {
        this.credService.getFormLista().subscribe(res => {
            if (this.isResultOk(res)) {
                this.estados = res.estados;
                this.estadosel = this.estados[0];
            }
        });
    }

    setRowOver(rowNumber: number) {
        this.currentRowOver = rowNumber;
    }

    loadCreditos() {
        this.turnOnLoading();
        let codestado = 0;
        if (this.estadosel.est_id) {
            codestado = this.estadosel.est_id;
        }
        this.credService.getGrid(this.filtro, codestado).subscribe(res => {
            if (this.isResultOk(res)) {
                this.gridCreditos = res.grid;
                console.log('Valor de gridcreditos es:');
                console.log(this.gridCreditos);
            }
            this.turnOffLoading();
        });
    }

    gotoCrear() {
        this.router.navigate([this.ctesFinanceService.rutaCreaCred]);

    }

    showDetalles(filaCredito) {
        this.router.navigate([this.ctesFinanceService.rutaDetCredSm, filaCredito.cre_id]);
    }

    onrowdblclick(filaCredito) {
        this.showDetalles(filaCredito);
    }

    doFilter() {
        this.previustimer = this.domService.delayKeyup(
            (context) => {
                context.loadCreditos();
            }, 500, this.previustimer, this
        );
    }

}