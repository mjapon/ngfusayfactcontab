import {Component, OnInit} from '@angular/core';
import {PlanService} from '../../../../services/plan.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-planeslist',
    templateUrl: './planeslist.component.html'
})
export class PlaneslistComponent implements OnInit {
    title: any;
    filtro: any;
    isLoading: boolean;
    grid: any;
    selectedItem: any;

    constructor(private planService: PlanService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.isLoading = false;
        this.title = 'PLANES EMPRESA';
        this.grid = {};
        this.listar();
    }

    doFilter($event: KeyboardEvent) {
        this.listar();
    }

    listar() {
        this.isLoading = true;
        this.planService.listarGrid(this.filtro).subscribe(res => {
            if (res.status === 200) {
                this.grid = res.grid;
                this.title = res.ttransacc.tra_nombre;
            }
            this.isLoading = false;
        });
    }

    goToForm() {
        this.router.navigate(['planesform']);
    }

    onRowSelect($event: any) {

    }

    onUnRowSelect($event: any) {

    }

    anularRow(rowData) {

    }

    verRow(rowData) {

    }
}
