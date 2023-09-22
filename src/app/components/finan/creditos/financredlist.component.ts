import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DomService } from "src/app/services/dom.service";
import { FinanCreditosService } from "src/app/services/finan/finacreditos.service";
import { BaseComponent } from "../../shared/base.component";
import { CtesFinanService } from "../ctesfina.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
    selector: 'app-financredlist',
    templateUrl: "./financredlist.component.html",
    styleUrls: ['./financredlist.component.scss']
})
export class FinanCredListComponent extends BaseComponent implements OnInit {

    gridCreditos: any = {};
    filtro = '';
    previustimer: any = 0;
    currentRowOver = -1;
    estados: any = [];
    estadosel: any = {};

    estilos = {
        1:'otros',
        2:'aprobado',
        3:'otros',
        4:'anulado',
        5:'cancelado'
    };
    keyssfiltro = 'cred_filtro';

    constructor(private credService: FinanCreditosService,
        private router: Router,
        private ctesFinanceService: CtesFinanService,
        private localStorage: LocalStorageService,
        private domService: DomService) {
        super();
    }

    ngOnInit() {
        this.loadForm();
        //this.loadCreditos();
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
            let ssfiltro = this.localStorage.getItem(this.keyssfiltro);
            if (ssfiltro) {
                this.filtro = ssfiltro;                
            }
            this.loadCreditos();
        });
    }

    getStyle(row){
        return this.estilos[row.cre_estado];
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
        if (this.filtro){
            this.localStorage.setItem(this.keyssfiltro, this.filtro);
        }
        else{
            this.localStorage.removeItem(this.keyssfiltro);
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