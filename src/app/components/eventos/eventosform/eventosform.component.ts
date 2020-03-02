import {Component, OnInit} from '@angular/core';
import {EventosService} from 'src/app/services/eventos.service';
import {Router} from '@angular/router';
import {SwalService} from 'src/app/services/swal.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-eventosform',
  templateUrl: './eventosform.component.html',
  styleUrls: ['./eventosform.component.css']
})
export class EventosformComponent implements OnInit {
  form: any;
  listas: Array<any>;
  tiposserv: Array<any>;
  lugares: Array<any>;
  eventForm: FormGroup;
  submited: boolean;
  es: any;

  constructor(
    private eventService: EventosService,
    private router: Router,
    private datePipe: DatePipe,
    private swalService: SwalService,
    private formBuildes: FormBuilder
  ) {
    this.submited = false;
    this.tiposserv = [];
    this.lugares = [];

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };

    this.buildForm();
    this.loadForm();
  }

  get f() {
    return this.eventForm.controls;
  }

  ngOnInit() {

  }

  buildForm() {
    const fechaActual = new Date();
    this.eventForm = this.formBuildes.group({
      ev_fecha: [fechaActual, Validators.required],
      ev_lugar: [1, Validators.required],
      ev_tipo: [1, Validators.required],
      ev_horainicio: [''],
      ev_horafin: [''],
      ev_nota: [''],
      ev_precionormal: [0.0, Validators.required],
      ev_precioespecial: [0.0, Validators.required],
    });
  }

  buildFormWithDefValue(form: any) {
    const fechaActual = new Date();
    const filtered = this.lugares.filter(el => el['lugc_id'] === form['ev_lugar']);
    let lugar;
    if (filtered.length > 0) {
      lugar = filtered[0];
    }
    const filteredtype = this.tiposserv.filter(el => el['tiev_id'] === form['ev_tipo']);
    let tipo;
    if (filteredtype.length > 0) {
      tipo = filteredtype[0];
    }

    this.eventForm = this.formBuildes.group({
      ev_fecha: [fechaActual, Validators.required],
      ev_lugar: [lugar, Validators.required],
      ev_tipo: [tipo, Validators.required],
      ev_horainicio: [form['ev_horainicio']],
      ev_horafin: [form['ev_horafin']],
      ev_precionormal: [form['ev_precionormal'], Validators.required],
      ev_precioespecial: [form['ev_precioespecial'], Validators.required],
      ev_nota: ['']
    });
  }

  loadForm() {
    this.eventService.getForm().subscribe(res => {
      if (res.status === 200) {
        this.form = res.form;
      }
    });
    this.eventService.getListas().subscribe(res1 => {
      if (res1.status === 200) {
        this.tiposserv = res1.listas.tiposev;
        this.lugares = res1.listas.lugaresev;
        this.buildFormWithDefValue(this.form);
      }
    });
  }

  onSubmit() {
    this.submited = true;
    if (this.eventForm.invalid) {
      return;
    }

    const msg = 'Confirma la creación del evento';

    this.swalService.fireDialog(msg).then(confirm => {
      if (confirm.value) {
        const formvalue: any = this.eventForm.value;
        const formToPost: any = {};
        for (const prop of Object.keys(formvalue)) {
          formToPost[prop] = formvalue[prop];
        }
        console.log('Form to post es:');
        console.log(formToPost);

        let evhoraini = formToPost['ev_horainicio'];
        let evhorafin = formToPost['ev_horafin'];
        if (formToPost['ev_horainicio'] instanceof Date) {
          evhoraini = this.datePipe.transform(formToPost['ev_horainicio'], 'hh:mm');
        }
        if (formToPost['ev_horafin'] instanceof Date) {
          evhorafin = this.datePipe.transform(formToPost['ev_horafin'], 'hh:mm');
        }
        //const evdate = formToPost['ev_fecha'].toISOString();
        const evdate = this.datePipe.transform(formToPost['ev_fecha'], 'dd/MM/yyyy');
        const lugsel = formToPost['ev_lugar'];
        const tiposel = formToPost['ev_tipo'];
        formToPost['ev_fechap'] = evdate;
        formToPost['ev_horainiciop'] = evhoraini;
        formToPost['ev_horafinp'] = evhorafin;

        formToPost.codlugar = lugsel['lugc_id'];
        formToPost.codtipo = tiposel['tiev_id'];
        formToPost.ev_id = 0;

        this.eventService.crearEvento(formToPost).subscribe(res => {
          if (res.status === 200) {
            this.swalService.fireSuccess(res.msg);
            this.router.navigate(['eventos']);
          }
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['eventos']);
  }
}

