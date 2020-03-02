import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EventosService} from '../../services/eventos.service';
import {FautService} from '../../services/faut.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventoslist: Array<any>;
  isLogged: boolean;

  constructor(private router: Router,
              private eventosService: EventosService,
              private fautService: FautService) {
    this.eventoslist = [];
    this.isLogged = false;
  }

  ngOnInit() {
    this.loadEventos();
    this.isLogged = this.fautService.isAuthenticated();
    this.fautService.source.subscribe(msg => {
      if (msg === 'logout') {
        this.isLogged = false;
      } else if (msg === 'login') {
        this.isLogged = true;
      }
    });
  }

  loadEventos() {
    this.eventosService.listarEventos().subscribe(res => {
      if (res.status === 200) {
        this.eventoslist = res.data;
      }
    });
  }

  goToForm() {
    this.router.navigate(['eventosform']);
  }

  showDetallesEvent(item: any) {

    if (item.ev_url) {
      this.router.navigate([item.ev_url]);
    } else {
      this.router.navigate(['eventos', item.ev_id]);
    }

  }
}
