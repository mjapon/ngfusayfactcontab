import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReferenteService} from '../../../services/referente.service';
import {SwalService} from '../../../services/swal.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-referentes-form',
  templateUrl: './referentes-form.component.html',
  styleUrls: ['./referentes-form.component.css']
})
export class ReferentesFormComponent implements OnInit {

  form: FormGroup;
  submited: boolean;
  refId: number;
  refTipo: number;

  constructor(private fb: FormBuilder,
              private refService: ReferenteService,
              private swalService: SwalService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.buildDefaultForm();
  }

  buildDefaultForm() {
    this.form = this.fb.group({
      ref_nombres: ['', Validators.required],
      ref_apellidos: [''],
      ref_ci: [''],
      ref_dir: [''],
      ref_telf: [''],
      ref_email: [''],
      ref_movil: ['']
    });
  }

  buildForm(form: any) {
    this.form = this.fb.group({
      ref_nombres: [form.ref_nombres, Validators.required],
      ref_apellidos: [form.ref_apellidos],
      ref_ci: [form.ref_ci],
      ref_dir: [form.ref_dir],
      ref_telf: [form.ref_telf],
      ref_email: [form.ref_email],
      ref_movil: [form.ref_movil]
    });
  }

}
