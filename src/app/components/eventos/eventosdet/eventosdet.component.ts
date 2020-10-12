import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventosService} from '../../../services/eventos.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonaService} from '../../../services/persona.service';
import {UiService} from '../../../services/ui.service';
import {FautService} from '../../../services/faut.service';
import {SwalService} from '../../../services/swal.service';
import {Subscription} from "rxjs";

declare var $: any;

@Component({
  selector: 'app-eventosdet',
  templateUrl: './eventosdet.component.html',
  styleUrls: ['./eventosdet.component.css']
})
export class EventosdetComponent implements OnInit, OnDestroy {
  eventId: number;
  datosEvent: any;
  isLogged: boolean;
    subscription: Subscription;

  constructor(private eventosService: EventosService,
              private router: Router,
              private uiService: UiService,
              private activatedRoute: ActivatedRoute,
              private personaService: PersonaService,
              private fautService: FautService,
              private swalService: SwalService) {
    this.datosEvent = {};
    this.isLogged = false;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const eventId = params.get('ev_id');
      this.eventId = parseInt(eventId, 10);
      this.loadDatosEvent();
      this.suscribePersonaTopic();

      this.isLogged = this.fautService.isAuthenticated();

      this.fautService.source.subscribe(msg => {
        if (msg === 'logout') {
          this.isLogged = false;
        } else if (msg === 'login') {
          this.isLogged = true;
        }
      });
    });

    $('#modalRegistraForm').on('show.bs.modal', function() {
      setTimeout(function() {
        $('.auxciruc').focus();
      }, 500);
    });
  }

  suscribePersonaTopic() {
      this.subscription = this.personaService.observableSource.subscribe(msg => {
      if (msg === 'doClose') {
        $('#modalRegistraForm').modal('hide');
      }
    });
  }

  loadDatosEvent() {
    this.eventosService.getDatosEvento(this.eventId).subscribe(res => {
      if (res.status === 200) {
        this.datosEvent = res.event;
      }
    });
  }

  gotoListado() {
    this.router.navigate(['eventos']);
  }

  registrarme() {
    this.personaService.publishMsgToObs('initForm');
    $('#modalRegistraForm').modal();
  }

  anularEvento() {
    const msg = '¿Confirma la anulación de este evento?';
    this.swalService.fireDialog(msg).then(confirm => {
      if (confirm.value) {
        this.eventosService.anularEvento({ev_id: this.eventId}).subscribe(res => {
          if (res.status === 200) {
            this.swalService.fireSuccess(res.msg);
            this.router.navigate(['eventos']);
          }
        });
      }
    });
  }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
