import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {UsertokenService} from '../../../services/usertoken.service';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html'
})
export class UserlistComponent implements OnInit {
    grid: any = {};
    selectedItem: any;

    enableBtns: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private fautService: UsertokenService) {
    }

    ngOnInit(): void {
        this.loadGrid();
    }

    nuevo() {
        this.router.navigate(['usuarios', 'form', 0]);
    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    anularRow(rowData) {
        this.swalService.fireToastInfo('Logica anulacion de usuario no implementado');
    }

    loadGrid() {
        this.fautService.listarUsuarios().subscribe(res => {
            this.grid = res.items;
        });
    }

    editarRow(rowData) {
        this.router.navigate(['usuarios', 'form', rowData.us_id]);
    }

}
