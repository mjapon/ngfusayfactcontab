import {Component, OnInit} from '@angular/core';
import {PlanService} from '../../../../services/plan.service';
import {Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';

@Component({
    selector: 'app-planesform',
    templateUrl: './planesform.component.html'
})
export class PlanesformComponent implements OnInit {
    title: string;
    formplan: any;
    formfactura: any;
    form: any;
    traCodigoPlan = 12;
    tdvCodigoPlan = 1;
    isLoading = false;
    totalPlan: number;

    formfacturaev: any;

    constructor(private planService: PlanService,
                private router: Router,
                private swalService: SwalService) {

    }

    ngOnInit(): void {
        this.title = 'Crear plan';
        this.formfactura = {detalles: []};
        this.formfacturaev = {detalles: []};
        this.formplan = {};
        this.isLoading = false;
        this.totalPlan = 0.0;
        this.initform();
    }

    initform() {
        this.formplan = {};
        this.isLoading = true;
        this.planService.getForm().subscribe(res => {
            if (res.status === 200) {
                this.formplan = res.formplan;
            }
            this.isLoading = false;
        });
    }

    onTotalUpdated($event: any) {
        if ($event) {
            this.formfacturaev = $event;
            this.totalPlan = $event.totales.total;
        }
    }

    cancelarCreaPlan() {
        this.gotolist();
    }

    crearPlan() {
        this.formfacturaev.formplan = this.formplan;
        this.planService.crear(this.formfacturaev).subscribe(res => {
            if (res.status === 200) {
                this.swalService.fireToastSuccess(res.msg);
                this.gotolist();
            }
        });
    }

    gotolist() {
        this.router.navigate(['planes']);
    }
}
