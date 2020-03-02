import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PersonaService} from '../../../services/persona.service';
import {Router} from '@angular/router';
import {SwalService} from '../../../services/swal.service';
import {ObjectsService} from '../../../services/objects.service';
import {ValidationService} from '../../../services/formvalidation.service';
import {PersonaEventService} from '../../../services/personaevent.service';
import {MessageService} from 'primeng/api';
import {UiService} from '../../../services/ui.service';

declare var $: any;

@Component({
  selector: 'app-personaform',
  templateUrl: './personaform.component.html',
  styleUrls: ['./personaform.component.css']
})
export class PersonaformComponent implements OnInit {
  submited: boolean;
  isAlreadyRegistered: boolean;
  formGroup: FormGroup;
  form: any;
  enterKeyPressed: boolean;
  @Input() public eventId: number;

  constructor(private personaService: PersonaService,
              private personaEventService: PersonaEventService,
              private uiService: UiService,
              private messageService: MessageService,
              private router: Router,
              private swalService: SwalService,
              private formBuilder: FormBuilder,
              private objectService: ObjectsService) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit() {
    this.submited = false;
    this.enterKeyPressed = false;
    this.buildForm(null);
    this.subscribeOpenModal();
  }

  init() {
    this.submited = false;
    this.enterKeyPressed = false;
    this.isAlreadyRegistered = false;
    this.buildForm(null);
    this.personaService.getForm().subscribe(res => {
      if (res.status === 200) {
        this.buildForm(res.form);
      }
    });
  }

  buildForm(form: any) {
    this.formGroup = this.formBuilder.group({
      per_ciruc: [(form ? form['per_ciruc'] : ''), [Validators.required, ValidationService.numberValidator, Validators.maxLength(15)]],
      per_nombres: [(form ? form['per_nombres'] : ''), [Validators.required, Validators.maxLength(40)]],
      per_apellidos: [(form ? form['per_apellidos'] : ''), [Validators.maxLength(40)]],
      per_email: [(form ? form['per_email'] : ''), [Validators.required, Validators.maxLength(50)]],
      per_movil: [(form ? form['per_movil'] : ''), [Validators.maxLength(12), ValidationService.numberValidator]]
    });
  }

  subscribeOpenModal() {
    this.personaService.observableSource.subscribe(msg => {
      if (msg === 'initForm') {
        this.init();
      }
    });
  }

  submit() {
    this.submited = true;
    if (this.formGroup.invalid) {
      return;
    }
    const msg = 'Confirma su registro';
    this.swalService.fireDialog(msg).then(confirm => {
      if (confirm.value) {
        const formToPost = this.objectService.clone(this.formGroup.value);
        this.personaEventService.registrarPersona(this.eventId, formToPost).subscribe(res => {
          if (res.status === 200) {
            this.swalService.fireSuccess(res.msg);
            this.personaService.publishMsgToObs('doClose');
          }
        });
      }
    });
  }

  cancelar() {
    this.personaService.publishMsgToObs('doClose');
  }

  loadDataPerson(persona: any) {
    this.buildForm(persona);
  }

  doBusqueda(setFocus: boolean) {
    const cirucFormControl = this.formGroup.controls['per_ciruc'];
    const value: string = cirucFormControl.value;
    if (value.length >= 4) {
      this.personaService.buscarPorCi(value).subscribe(res => {
        if (res.status === 200) {
          this.loadDataPerson(res.persona);
          this.uiService.setFocusByClass('auxBtnSubmit', 100);
          this.personaEventService.personIsRegistered(this.eventId, value).subscribe(resB => {
            if (resB.status === 200) {
              if (resB.registrado) {
                this.isAlreadyRegistered = true;
                this.uiService.setFocusByClass('auxBtnCerrar');
              }
            }
          });
        } else {
          this.uiService.setFocusByClass('auxPerNombres');
          this.clearDataPerson(value);
        }
      });
    }
  }

  onBlurCiRucEvent() {
    if (!this.enterKeyPressed) {
      this.isAlreadyRegistered = false;
      const cirucFormControl = this.formGroup.controls['per_ciruc'];
      if (!cirucFormControl.errors) {
        this.doBusqueda(false);
      }
    }
  }

  onEnterKeyPress($event: any) {
    this.enterKeyPressed = true;
    this.doBusqueda(true);
  }

  private clearDataPerson(ciruc: string) {
    this.loadDataPerson({'per_ciruc': ciruc});
  }
}
