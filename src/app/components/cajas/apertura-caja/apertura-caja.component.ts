import { Component, OnInit } from '@angular/core';
import { CajaService } from '../../../services/caja.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SwalService } from '../../../services/swal.service';

@Component({
  selector: 'app-apertura-caja',
  templateUrl: './apertura-caja.component.html',
  styleUrls: ['./apertura-caja.component.css']
})
export class AperturaCajaComponent implements OnInit {
  form: any;
  isCajaAbierta: boolean;
  detcajas: Array<any>;

  constructor(
    private cajaService: CajaService,
    private router: Router,
    private swalService: SwalService,
    private autService: AuthService
  ) {}

  ngOnInit() {
    this.form = {};
    this.detcajas = [];
    this.cajaService
      .getform(this.autService.getTdvCodigo())
      .subscribe(response => {
        this.isCajaAbierta = response.is_caja_abierta;
        if (this.isCajaAbierta) {
          this.swalService.fireWarning(
            'Ya ha sido aperturada la caja para el dia de hoy'
          );
          this.goToHome();
        } else {
          this.form = response.form;
          this.detcajas = this.form.detcajaant;
        }
      });
  }

  guardar() {
    this.swalService.fireDialog('¿Confirma apertura de caja?').then(confirm => {
      if (confirm.value) {
        const thetdvcod = this.autService.getTdvCodigo();

        const theform = {
          cj_obsaper: this.form.cj_obsaper,
          detcajas: this.detcajas,
          dia: this.form.dia,
          tdv_codigo: thetdvcod
        };

        this.cajaService
          .guardarAperturaCaja(theform, thetdvcod)
          .subscribe(response => {
            if (response.status === 200) {
              this.swalService.fireSuccess(response.msg);
              this.goToHome();
            } else {
              this.swalService.fireError(response.msg);
            }
          });
      }
    });
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  cancelar() {
    this.goToHome();
  }
}
