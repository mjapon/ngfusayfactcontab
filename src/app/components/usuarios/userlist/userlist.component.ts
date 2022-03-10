import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { SwalService } from '../../../services/swal.service';
import { UsertokenService } from '../../../services/usertoken.service';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html'
})
export class UserlistComponent implements OnInit {
    grid: any = {};
    selectedItem: any;
    isShowModal = false;
    formCambioClave: any = {};

    constructor(private router: Router,
        private swalService: SwalService,
        private fautService: UsertokenService) {
    }

    ngOnInit(): void {
        this.loadGrid();
    }

    nuevo() {
        this.router.navigate(['usuarios', 'form', 0]);
    }

    cambiarEstado(rowData) {
        let newState = 1;
        let newStateMsg = 'inactivar';
        if (rowData.us_estado === 1) {
            newState = 0;
            newStateMsg = 'activar';
        }

        let msg = `¿Seguro que desea ${newStateMsg} este usuario?`
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                this.fautService.cambiarEstado({ user: rowData.us_id, state: newState }).subscribe(res => {
                    if (res.status === 200 && res.resultado === 1) {
                        this.loadGrid();
                        this.swalService.fireSuccess(res.msg);
                    }
                });
            }
        });
    }

    cambiarClave(rowData) {
        this.formCambioClave = {
            us_id: rowData.us_id,
            us_clave: '',
            us_confirmclave: ''
        };
        this.isShowModal = true;
    }

    loadGrid() {
        this.fautService.listarUsuarios().subscribe(res => {
            this.grid = res.items;
        });
    }

    editarRow(rowData) {
        this.router.navigate(['usuarios', 'form', rowData.us_id]);
    }

    guardarCambioClave() {
        if (this.formCambioClave.us_clave.trim().length > 0
            && this.formCambioClave.us_confirmclave.trim().length > 0) {
            this.swalService.fireDialog('¿Seguro que desea realizar el cambio de clave?').then(
                confirm => {
                    if (confirm.value) {
                        this.fautService.cambiarClave(this.formCambioClave).subscribe(res => {
                            if (res.status === 200) {
                                if (res.res === 1) {
                                    this.swalService.fireSuccess(res.msg);
                                }
                                else {
                                    this.swalService.fireError(res.msg);
                                }
                                this.isShowModal = false;
                            }
                        });
                    }
                }
            )
        }
        else {
            this.swalService.fireError('Debe ingresar las claves')
        }
    }

    cancelarCambioClave() {
        this.isShowModal = false;
    }

}
