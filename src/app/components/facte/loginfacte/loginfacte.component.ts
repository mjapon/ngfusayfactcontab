import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomService } from 'src/app/services/dom.service';
import { FacteContribService } from 'src/app/services/facte/contrib.service';
import { FautService } from 'src/app/services/faut.service';
import { LoadingUiService } from 'src/app/services/loading-ui.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-loginfacte',
  templateUrl: './loginfacte.component.html',
  styleUrls: ['./loginfacte.component.css']
})
export class LoginfacteComponent implements OnInit {

  loginForm: FormGroup;
  submited: boolean;

  constructor(private fb: FormBuilder,
    private swalService: SwalService,
    private domService: DomService,
    private contribService: FacteContribService,
    private loadingServ: LoadingUiService,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.verificarLogueado();

  }

  get f() {
    return this.loginForm.controls;
  }

  createForm() {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.domService.setFocusTm(
      'usernameInput', 500);
  }

  verificarLogueado() {
    if (this.contribService.isAuthenticated()) {
      this.router.navigate(['homefacte']);
    }
  }


  onclickSubmit() {
    this.submited = true;
    if (this.loginForm.invalid) {
      return;
    }
    const form = this.loginForm.value;
    this.loadingServ.publishBlockMessage();
    this.contribService.autenticar(form.user, form.password).subscribe(
      res => {
        if (res.autenticado) {
          this.contribService.publishMessage('loginFacte');
          this.contribService.setAsAuthenticated(res.userinfo, res.token);
          this.swalService.fireToastSuccess('', 'Bienvenido: ' + res.userinfo.cnt_nombres);
          this.router.navigate(['homefacte']);
        } else {
          this.swalService.fireWarning('Usuario o clave incorrectos');
        }
      }
    );
  }



}
