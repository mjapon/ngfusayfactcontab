import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {ArticuloService} from '../../../../services/articulo.service';

@Component({
    selector: 'app-trubros',
    templateUrl: './trubros.component.html'
})
export class TrubrosComponent implements OnInit {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;

    enableBtns: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private artService: ArticuloService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.items = new Array<any>();
        this.cols = new Array<any>();
        this.loadGrid();
    }

    nuevo() {
        this.router.navigate(['rubros', 'form', 0]);
    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    anularRow(rowData) {
        this.swalService.fireToastInfo('Logica anulacion de rubro no iplementado');
    }

    loadGrid() {
        this.loadingUiService.publishBlockMessage();
        this.artService.listarRubros().subscribe(res => {
            this.cols = res.items.cols;
            this.items = res.items.data;
        });
    }

    editarRow(rowData) {
        this.router.navigate(['rubros', 'form', rowData.ic_id]);
    }

}
