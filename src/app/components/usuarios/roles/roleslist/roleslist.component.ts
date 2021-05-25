import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../../services/swal.service';
import {RolService} from '../../../../services/rol.service';
import {LoadingUiService} from '../../../../services/loading-ui.service';

@Component({
    selector: 'app-roleslist',
    templateUrl: './roleslist.component.html'
})
export class RoleslistComponent implements OnInit {

    items: Array<any> = [];
    cols: Array<any> = [];
    selectedItem: any;

    enableBtns: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private rolService: RolService,
                private loadingUiService: LoadingUiService) {
    }

    ngOnInit(): void {
        this.loadGrid();
    }

    nuevo() {
        this.router.navigate(['roles', 'form', 0]);
    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    loadGrid() {
        this.rolService.listar().subscribe(res => {
            this.cols = res.items.cols;
            this.items = res.items.data;
        });
    }

    anularRow(rowData) {
        this.swalService.fireDialog('¿Confirma que desea anular este rol', '').then(confirm => {
                if (confirm.value) {
                    this.loadingUiService.publishBlockMessage();
                    this.rolService.anular(rowData.rl_id).subscribe(res => {
                        if (res.status === 200) {
                            this.swalService.fireToastSuccess(res.msg);
                            this.loadGrid();
                        }
                    });
                }
            }
        );
    }

    editarRow(rowData) {
        this.router.navigate(['roles', 'form', rowData.rl_id]);
    }
}
