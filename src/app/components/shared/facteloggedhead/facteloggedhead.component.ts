import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacteContribService } from 'src/app/services/facte/contrib.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-facteloggedhead',
  templateUrl: './facteloggedhead.component.html',
  styleUrls: ['./facteloggedhead.component.scss']
})
export class FacteloggedheadComponent implements OnInit {

  userinfo: any;
  isLogged: boolean;


  constructor(private router: Router,
    private contribService: FacteContribService,
    private swalService: SwalService) { }

  ngOnInit(): void {

    const userInfoSaved = this.contribService.getUserInfoSaved();
    if (userInfoSaved) {
      this.userinfo = userInfoSaved;
    }

    this.contribService.source.subscribe(msg => {
      if (msg === 'loginFacte') {
        this.isLogged = true;
      }
      else if (msg === 'logoutFacte') {
        this.isLogged = false;
      }
    });

    this.isLogged = this.contribService.isAuthenticated();
  }

  goHome() {
    this.router.navigate(['homefacte']);
  }

  logout() {
    this.contribService.clearInfoAuthenticated();
    this.contribService.publishMessage('logoutFacte');
    this.router.navigate(['/']);
  }

}
