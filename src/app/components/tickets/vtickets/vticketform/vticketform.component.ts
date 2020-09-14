import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {UiService} from '../../../../services/ui.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {VentaticketService} from '../../../../services/ventaticket.service';

@Component({
    selector: 'app-vticketform',
    templateUrl: './vticketform.component.html',
    styleUrls: ['./vticketform.component.css']
})
export class VticketformComponent implements OnInit {
    tiposRubroList: any;
    form: any;
    rubrosel: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private vtService: VentaticketService,
                private swalService: SwalService,
                private uiService: UiService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.form = {};
        this.tiposRubroList = [];
        this.vtService.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
                this.tiposRubroList = res.tiposrubro;
            }
        });

        this.uiService.setFocusById('costoInput', 1000);
    }

    guardar() {
        if (this.rubrosel === null || this.rubrosel === undefined) {
            this.swalService.fireError('Debe seleccionar el tipo de registro');
            return;
        } else if (this.form.vt_monto == null || this.form.vt_monto.toString().trim().length === 0) {
            this.swalService.fireError('Debe ingresar el monto');
            return;
        } else {
            this.form.vt_tipo = this.rubrosel.ic_id;
            this.loadingUiService.publishBlockMessage();
            this.vtService.guardar(this.form).subscribe(res => {
                this.swalService.fireToastSuccess(res.msg);
                if (res.status === 200) {
                    this.router.navigate(['vtickets']);
                }
            });
        }
    }

    cancelar() {
        this.router.navigate(['vtickets']);
    }

    onrubrosel($event: any) {
        this.uiService.setFocusById('costoInput', 400);
        if (this.form.vt_monto === 0) {
            this.form.vt_monto = '';
        }
    }
}
