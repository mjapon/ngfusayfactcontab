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
import {ArticulosViewComponent} from './components/articulos/articulos-view/articulos-view.component';
import {ArticulosBatchComponent} from './components/articulos/articulos-batch/articulos-batch.component';
import {TelemedicinaComponent} from './components/telemedicina/telemedicina.component';
import {MiscitasComponent} from './components/citas/miscitas/miscitas.component';
import {LoginpacienteComponent} from './components/loginpaciente/loginpaciente.component';
import {CitaspacienteComponent} from './components/citas/citaspaciente/citaspaciente.component';
import {CitasmedicasComponent} from './components/citas/citasmedicas/citasmedicas.component';
import {VticketComponent} from './components/tickets/vtickets/vticket/vticket.component';
import {VticketformComponent} from './components/tickets/vtickets/vticketform/vticketform.component';
import {OdontogramaComponent} from './components/citas/odontograma/odontograma.component';
import {HistoriaCliOdontoComponent} from './components/citas/historia-cli-odonto/historia-cli-odonto.component';
import {RoleslistComponent} from './components/usuarios/roles/roleslist/roleslist.component';
import {RolesformComponent} from './components/usuarios/roles/rolesform/rolesform.component';
import {UserlistComponent} from './components/usuarios/userlist/userlist.component';
import {UserformComponent} from './components/usuarios/userform/userform.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: StartComponent},
    {path: 'lghome', component: LoggedHomeComponent},
    {path: 'aperturaCaja', component: AperturaCajaComponent},
    {path: 'cierreCaja', component: CierreCajaComponent},
    {path: 'mercaderia', component: ArticulosListComponent},
    {path: 'mercaderiaForm/:art_id', component: ArticulosFormComponent},
    {path: 'mercaderiaView/:art_id', component: ArticulosViewComponent},
    {path: 'mercaderiaIngrRapid', component: ArticulosBatchComponent},
    {path: 'contribs', component: ContribsListComponent},
    {path: 'telemedicina', component: TelemedicinaComponent},
    {path: 'contribs/:cnt_id', component: ContribsFormComponent},
    {path: 'directiva/:tipo', component: MiembrodirectivaComponent},
    {path: 'referentes', component: ReferentesListComponent},
    {path: 'eventos', component: EventosComponent},
    {path: 'eventosform', component: EventosformComponent},
    {path: 'eventos/:ev_id', component: EventosdetComponent},
    {path: 'congreso2020', component: Congreso2020Component},
    {path: 'blogs', component: BlogsComponent},
    {path: 'blog/:blg_id', component: BlogComponent},
    {
        path: 'referentesForm/:ref_id/:ref_tipo',
        component: ReferentesFormComponent
    },
    {path: 'tickets', component: TicketComponent},
    {path: 'ticket/form', component: TicketformComponent},
    {path: 'vtickets', component: VticketComponent},
    {path: 'vticket/form', component: VticketformComponent},
    {path: 'miscitasmedicas', component: MiscitasComponent},
    {path: 'ingresoPaciente', component: LoginpacienteComponent},
    {path: 'citasPaciente', component: CitaspacienteComponent},
    {path: 'historiaclinica/:tipo', component: CitasmedicasComponent},
    {path: 'odontograma', component: OdontogramaComponent},
    {path: 'historiacliodonto', component: HistoriaCliOdontoComponent},
    {path: 'roles', component: RoleslistComponent},
    {path: 'roles/form/:rl_id', component: RolesformComponent},
    {path: 'usuarios', component: UserlistComponent},
    {path: 'usuarios/form/:us_id', component: UserformComponent},
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
