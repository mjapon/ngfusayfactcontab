import { Component, OnInit } from "@angular/core";
import { ContratoaguaService } from "src/app/services/agua/contratoagua.service";
import { CtesService } from "src/app/services/ctes.service";
import { DomService } from "src/app/services/dom.service";
import { BaseComponent } from "../../shared/base.component";

@Component({
    selector: 'app-agua-main',
    templateUrl: './agua-main.component.html'
})
export class AguaMainComponent extends BaseComponent implements OnInit {
    gridcontratos: any = { data: [], cols: [] };
    filtro: string = "";
    previustimer: any = 0;
    currentRowOver = -1;
    filasel: any = {};
    isShowDetails: boolean = false;

    constructor(private contraguaServ: ContratoaguaService,
        private domService: DomService,
        private ctesService: CtesService) {
        super();
    }

    setRowOver(rowNumber: number) {
        this.currentRowOver = rowNumber;
    }

    ngOnInit(): void {
        this.clear();
        this.loadContratos();
    }

    clear() {
        this.gridcontratos = { data: [], cols: [] };
        this.filtro = "";
        this.currentRowOver = -1;
    }

    loadContratos() {
        this.currentRowOver = -1;
        this.turnOnLoading();
        this.contraguaServ.listar(this.filtro).subscribe(res => {
            this.turnOffLoading();
            this.gridcontratos = res.gridcontratos;
            this.domService.setFocusTm(this.ctesService.filtropag);
        });
    }

    doFilter() {
        this.previustimer = this.domService.delayKeyup(
            (context) => {
                context.loadContratos();
            }, 500, this.previustimer, this
        );
    }


    onrowdblclick(fila: any) {
        this.filasel = fila;
        this.isShowDetails = true;
    }

    onClosedDetails() {
        this.isShowDetails = false;
        this.domService.setFocusTm('filtropag', 500)
    }
}