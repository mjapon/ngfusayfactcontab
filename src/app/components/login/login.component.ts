import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SwalService} from '../../services/swal.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  angForm: FormGroup;
  submited: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private swalService: SwalService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  get f() {
    return this.angForm.controls;
  }

  ngOnInit() {
    console.log('Se App module ngoninit--->');
  }

  createForm() {
    this.angForm = this.fb.group({
      empresa: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  onclickSubmit() {
    this.submited = true;
    const formvalue: any = this.angForm.value;
    if (this.angForm.invalid) {
      return;
    }

    this.authService
      .autenticar(formvalue.empresa, formvalue.usuario, formvalue.clave)
      .subscribe((response: any) => {
        if (response.estado === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.msg
          });

          /*
          let userDataSesion: UserDataSession = {
            token: response.token,
            emp_codigo: response.emp_codigo,
            emp_esquema: response.emp_esquema,
            user_id: response.user_id
          };
          */

          const menu = response.menu;

          this.localStorageService.setItem('globalMenu', menu);
          this.localStorageService.setItem('authtoken', response.token);
          this.localStorageService.setItem('islogged', 'true');
          this.localStorageService.setItem('tdvCodigo', response.tdv_codigo);

          this.authService.changeMessage('true');
          this.router.navigate(['home']);
        } else if (response.estado === 400) {
          this.swalService.fireWarning(response.msg, 'Bad');
        } else {
          this.swalService.fireError('Error al procesar petición', 'HOO!');
        }
      });
  }
}
