import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';

@Component({
    selector: 'app-ingegrform',
    templateUrl: './ingegrform.component.html'
})
export class IngegrformComponent implements OnInit {
    titulo = 'Ingreso';
    tiporouting = 1;
    isLoading = false;

    datafile: any;
    filepreview: any;
    base64data: any = null;
    adjisimage = false;
    tiposList: Array<any> = [];

    form: any = {};
    currentDate = new Date();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService) {
        this.route.paramMap.subscribe(params => {
            this.tiporouting = parseInt(params.get('tipo'), 10);
            this.setTitle();
        });
    }

    ngOnInit(): void {

    }

    setTitle() {
        if (this.tiporouting === 1) {
            this.titulo = 'Ingreso';
        } else if (this.tiporouting === 2) {
            this.titulo = 'Gasto';
        } else if (this.tiporouting === 3) {
            this.titulo = 'Transferencia';
        }
    }

    guardar() {

    }

    cancelar() {
        this.router.navigate(['vtickets']);
    }

    ontiposel($event: any) {

    }

    clearFile() {
        this.filepreview = null;
        this.base64data = null;
    }

    processFile() {
        const mimeType = this.datafile.type;
        const rega = /image|pdf|document/;
        const regimg = /image/;
        this.adjisimage = regimg.test(mimeType);
        if (rega.test(mimeType)) {
            const reader = new FileReader();
            reader.readAsDataURL(this.datafile);
            reader.onload = (e) => {
                this.filepreview = reader.result;
                this.base64data = this.filepreview;
            };
        } else {
            this.clearFile();
            this.swalService.fireError('Este tipo de archivo no esta admitido');
        }
    }


    onFileChange(fileInput: any) {
        this.datafile = fileInput.target.files[0];
        this.adjisimage = false;
        if (this.datafile) {
            const length = (this.datafile.size / 1024) / 1024;
            if (length > 10) {
                this.clearFile();
                this.swalService.fireError('El tamaño del archivo es muy grande, elija otro (Tamaño máximo 10MB)');
            } else {
                this.processFile();
            }
        } else {
            this.filepreview = null;
            this.base64data = null;
        }
    }

}
