import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {StartComponent} from './components/start/start.component';
import {AperturaCajaComponent} from './components/cajas/apertura-caja/apertura-caja.component';
import {CierreCajaComponent} from './components/cajas/cierre-caja/cierre-caja.component';
import {ArticulosListComponent} from './components/articulos/articulos-list/articulos-list.component';
import {ArticulosFormComponent} from './components/articulos/articulos-form/articulos-form.component';

import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';
import {TicketComponent} from './components/tickets/ticket/ticket.component';
import {TicketformComponent} from './components/tickets/ticketform/ticketform.component';
import {ArticulosViewComponent} from './components/articulos/articulos-view/articulos-view.component';
import {ArticulosBatchComponent} from './components/articulos/articulos-batch/articulos-batch.component';
import {CitasmedicasComponent} from './components/citas/citasmedicas/citasmedicas.component';
import {RoleslistComponent} from './components/usuarios/roles/roleslist/roleslist.component';
import {RolesformComponent} from './components/usuarios/roles/rolesform/rolesform.component';
import {UserlistComponent} from './components/usuarios/userlist/userlist.component';
import {UserformComponent} from './components/usuarios/userform/userform.component';
import {TrubrosComponent} from './components/tickets/vtickets/trubros/trubros.component';
import {TrubrosformComponent} from './components/tickets/vtickets/trubrosform/trubrosform.component';
import {CitasodontoComponent} from './components/citas/citasodonto/citasodonto.component';
import {NewfacturaformComponent} from './components/transac/facturas/newfacturaform/newfacturaform.component';
import {PlaneslistComponent} from './components/transac/planes/planeslist/planeslist.component';
import {PlanesformComponent} from './components/transac/planes/planesform/planesform.component';
import {ReferenteslistComponent} from './components/referentes/referenteslist.component';
import {ReferenteviewComponent} from './components/referentes/referenteview.component';
import {AgendaComponent} from './components/citas/agenda.component';
import {PlanctaslistComponent} from './components/contabilidad/plancuentas/planctaslist.component';
import {LibrodiariolistComponent} from './components/contabilidad/librodiario/librodiariolist/librodiariolist.component';
import {LibrodiarioformComponent} from './components/contabilidad/librodiario/librodiarioform/librodiarioform.component';
import {LibromayorlistComponent} from './components/contabilidad/libromayor/libromayorlist/libromayorlist.component';
import {BalancegeneralComponent} from './components/contabilidad/reportes/balancegeneral/balancegeneral.component';
import {EstadoresultadosComponent} from './components/contabilidad/reportes/estadoresultados/estadoresultados.component';
import {CategoriasComponent} from './components/articulos/categorias/categorias.component';
import {FacturaslistgenComponent} from './components/transac/facturas/facturaslistgen.component';
import {CuentasxcpComponent} from './components/transac/facturas/cuentasxcp.component';
import {IngegrComponent} from './components/ingresosegresos/ingegr/ingegr.component';
import {IngegrformComponent} from './components/ingresosegresos/ingegrform/ingegrform.component';
import {UtilidadesComponent} from "./components/transac/facturas/utilidades/utilidades.component";

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
    {path: 'categorias', component: CategoriasComponent},
    {path: 'tickets', component: TicketComponent},
    {path: 'ticket/form', component: TicketformComponent},
    /*{path: 'vtickets', component: VticketComponent},*/
    {path: 'vtickets', component: IngegrComponent},
    /*{path: 'vticket/form', component: VticketformComponent},*/
    {path: 'vtickets/form/:tipo', component: IngegrformComponent},
    {path: 'historiaclinica/:tipo', component: CitasmedicasComponent},
    {path: 'odonto', component: CitasodontoComponent},
    {path: 'roles', component: RoleslistComponent},
    {path: 'roles/form/:rl_id', component: RolesformComponent},
    {path: 'usuarios', component: UserlistComponent},
    {path: 'usuarios/form/:us_id', component: UserformComponent},
    {path: 'rubros', component: TrubrosComponent},
    {path: 'rubros/form/:ic_id', component: TrubrosformComponent},
    /*{path: 'calendario/:tipo', component: OdcalendarComponent},*/
    {path: 'agenda/:tipo', component: AgendaComponent},
    {path: 'trndocs/:tipo', component: FacturaslistgenComponent},
    {path: 'cuentasxcp/:tipo', component: CuentasxcpComponent},
    {path: 'trndocform/:tracodigo', component: NewfacturaformComponent},
    {path: 'planes', component: PlaneslistComponent},
    {path: 'planesform', component: PlanesformComponent},
    {path: 'referentes', component: ReferenteslistComponent},
    {path: 'referentes/:codref', component: ReferenteviewComponent},
    {path: 'plancuentas', component: PlanctaslistComponent},
    {path: 'librodiario', component: LibrodiariolistComponent},
    {path: 'newasiento/:cod', component: LibrodiarioformComponent},
    {path: 'libromayor', component: LibromayorlistComponent},
    {path: 'contabilidad/balancegeneral', component: BalancegeneralComponent},
    {path: 'contabilidad/estadoresultados', component: EstadoresultadosComponent},
    {path: 'utilventas', component: UtilidadesComponent},
    {path: '**', component: HomeComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
