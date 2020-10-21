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

import {EventosComponent} from './components/eventos/eventos.component';
import {EventosformComponent} from './components/eventos/eventosform/eventosform.component';
import {EventosdetComponent} from './components/eventos/eventosdet/eventosdet.component';
import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';
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
import {RoleslistComponent} from './components/usuarios/roles/roleslist/roleslist.component';
import {RolesformComponent} from './components/usuarios/roles/rolesform/rolesform.component';
import {UserlistComponent} from './components/usuarios/userlist/userlist.component';
import {UserformComponent} from './components/usuarios/userform/userform.component';
import {TrubrosComponent} from './components/tickets/vtickets/trubros/trubros.component';
import {TrubrosformComponent} from './components/tickets/vtickets/trubrosform/trubrosform.component';

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
    {path: 'referentes', component: ReferentesListComponent},
    {path: 'eventos', component: EventosComponent},
    {path: 'eventosform', component: EventosformComponent},
    {path: 'eventos/:ev_id', component: EventosdetComponent},
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
    {path: 'roles', component: RoleslistComponent},
    {path: 'roles/form/:rl_id', component: RolesformComponent},
    {path: 'usuarios', component: UserlistComponent},
    {path: 'usuarios/form/:us_id', component: UserformComponent},
    {path: 'rubros', component: TrubrosComponent},
    {path: 'rubros/form/:ic_id', component: TrubrosformComponent},
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
