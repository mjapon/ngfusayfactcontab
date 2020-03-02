import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {SwalService} from '../../services/swal.service';
import {FautService} from '../../services/faut.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private fautService: FautService,
              private router: Router,
              private swalService: SwalService
  ) {
  }

  ngOnInit() {
    /*
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
      this.swalService.fireError('No estas autenticado');
    }
    */

    if (this.fautService.isAuthenticated()) {
      console.log('is autenticated');
      this.goToLoggedHome();
    } else {
      console.log('not is autenticated');
      this.goToEvento();

    }

  }

  goToEvento() {
    this.router.navigate(['congreso2020']);
  }

  goToLoggedHome() {
    this.router.navigate(['lghome']);
  }

}
