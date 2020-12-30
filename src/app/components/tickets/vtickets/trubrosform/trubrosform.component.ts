import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {CadenasutilService} from '../../../../services/cadenasutil.service';
import {UiService} from '../../../../services/ui.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';
import {ArticuloService} from '../../../../services/articulo.service';
import {ArrayutilService} from '../../../../services/arrayutil.service';

@Component({
    selector: 'app-trubrosform',
    templateUrl: './trubrosform.component.html',
    styleUrls: ['./trubrosform.component.css']
})
export class TrubrosformComponent implements OnInit {

    form: any;
    icId: number;
    tiposList: Array<any>;
    tiposel: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private artService: ArticuloService,
                private cadsUtilService: CadenasutilService,
                private arrayUtil: ArrayutilService,
                private uiService: UiService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.icId = 0;
        this.form = {};
        this.tiposList = [];
        this.tiposel = {};
        this.route.paramMap.subscribe(params => {
            this.icId = parseInt(params.get('ic_id'), 10);
            this.loadForm();
        });
    }

    loadForm() {
        this.loadingUiService.publishBlockMessage();
        if (this.icId === 0) {
            this.artService.getFormRubro().subscribe(res => {
                if (res.status === 200) {
                    this.form = res.form;
                    this.tiposList = res.tipos;
                }
            });
        } else {
            this.artService.getFormEditRubro(this.icId).subscribe(res => {
                if (res.status === 200) {
                    this.form = res.item;
                    this.tiposList = res.tipos;
                    const dbtipo = this.arrayUtil.getFirstResult(
                        this.tiposList,
                        (el, idx, array) => {
                            return el.value === this.form.clsic_id;
                        }
                    );
                    if (dbtipo) {
                        this.tiposel = dbtipo.value;
                    }
                }
            });
        }
    }

    setFocus(nomApelInput: string) {
        this.uiService.setFocusById(nomApelInput);
    }

    cancelar() {
        this.router.navigate(['rubros']);
    }

    guardar() {
        if (!this.cadsUtilService.esNoNuloNoVacio(this.form.ic_code)) {
            this.swalService.fireToastError('Por favor ingrese el código del rubro');
        } else if (!this.cadsUtilService.esNoNuloNoVacio(this.form.ic_nombre)) {
            this.swalService.fireToastError('Por favor ingrese el nombre del rubro');
        } else {
            this.loadingUiService.publishBlockMessage();
            this.form.clsic_id = this.tiposel;
            this.artService.guardarRubro(this.form).subscribe(res => {
                this.swalService.fireToastSuccess(res.msg);
                if (res.status === 200) {
                    this.router.navigate(['rubros']);
                }
            });
        }

    }
}
