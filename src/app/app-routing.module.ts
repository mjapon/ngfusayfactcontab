import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {ContribsListComponent} from './components/contribs/contribs-list/contribs-list.component';
import {ContribsFormComponent} from './components/contribs/contribs-form/contribs-form.component';
import {StartComponent} from './components/start/start.component';
import {AperturaCajaComponent} from './components/cajas/apertura-caja/apertura-caja.component';
import {CierreCajaComponent} from './components/cajas/cierre-caja/cierre-caja.component';
import {ArticulosListComponent} from './components/articulos/articulos-list/articulos-list.component';
import {ArticulosFormComponent} from './components/articulos/articulos-form/articulos-form.component';
import {ReferentesListComponent} from './components/referentes/referentes-list/referentes-list.component';
import {ReferentesFormComponent} from './components/referentes/referentes-form/referentes-form.component';
import {SenderComponentComponent} from './components/sender-component/sender-component.component';
import {MiembrodirectivaComponent} from './components/miembrodirectiva/miembrodirectiva.component';
import {EventosComponent} from './components/eventos/eventos.component';
import {EventosformComponent} from './components/eventos/eventosform/eventosform.component';
import {EventosdetComponent} from './components/eventos/eventosdet/eventosdet.component';
import {Congreso2020Component} from './components/blog/congreso2020/congreso2020.component';
import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';
import {BlogsComponent} from './components/blogs/blogs.component';
import {BlogComponent} from './components/blogs/blog/blog.component';
import {TicketComponent} from './components/tickets/ticket/ticket.component';
import {TicketformComponent} from './components/tickets/ticketform/ticketform.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: StartComponent},
  {path: 'lghome', component: LoggedHomeComponent},
  {path: 'aperturaCaja', component: AperturaCajaComponent},
  {path: 'cierreCaja', component: CierreCajaComponent},
  {path: 'mercaderia', component: ArticulosListComponent},
  {path: 'mercaderiaForm/:art_id', component: ArticulosFormComponent},
  {path: 'contribs', component: ContribsListComponent},
  {path: 'contribs/:cnt_id', component: ContribsFormComponent},
  {path: 'directiva/:tipo', component: MiembrodirectivaComponent},
  {path: 'referentes', component: ReferentesListComponent},
  {path: 'eventos', component: EventosComponent},
  {path: 'eventosform', component: EventosformComponent},
  {path: 'eventos/:ev_id', component: EventosdetComponent},
  {path: 'congreso2020', component: Congreso2020Component},
  { path: 'blogs', component: BlogsComponent},
  { path: 'blog/:blg_id', component: BlogComponent},
  {
    path: 'referentesForm/:ref_id/:ref_tipo',
    component: ReferentesFormComponent
  },
  {path: 'sender', component: SenderComponentComponent},
  {path: 'tickets', component: TicketComponent},
  {path: 'ticket/form', component: TicketformComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
