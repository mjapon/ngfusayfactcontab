import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {StartComponent} from './components/start/start.component';
import {ArticulosListComponent} from './components/articulos/articulos-list/articulos-list.component';
import {ArticulosFormComponent} from './components/articulos/articulos-form/articulos-form.component';

import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';
import {TicketComponent} from './components/tickets/ticket/ticket.component';
import {TicketformComponent} from './components/tickets/ticketform/ticketform.component';
import {ArticulosViewComponent} from './components/articulos/articulos-view/articulos-view.component';
import {CitasmedicasComponent} from './modules/medico/citasmedicas/citasmedicas.component';
import {RoleslistComponent} from './components/usuarios/roles/roleslist/roleslist.component';
import {RolesformComponent} from './components/usuarios/roles/rolesform/rolesform.component';
import {UserlistComponent} from './components/usuarios/userlist/userlist.component';
import {UserformComponent} from './components/usuarios/userform/userform.component';
import {CitasodontoComponent} from './modules/odontologo/citasodonto/citasodonto.component';
import {NewfacturaformComponent} from './components/transac/facturas/newfacturaform/newfacturaform.component';
import {ReferenteslistComponent} from './components/referentes/referenteslist.component';
import {ReferenteviewComponent} from './components/referentes/referenteview.component';
import {AgendaComponent} from './modules/agenda/agenda.component';
import {PlanctaslistComponent} from './components/contabilidad/plancuentas/planctaslist.component';
import {
    LibrodiariolistComponent
} from './components/contabilidad/librodiario/librodiariolist/librodiariolist.component';
import {
    LibrodiarioformComponent
} from './components/contabilidad/librodiario/librodiarioform/librodiarioform.component';
import {LibromayorlistComponent} from './components/contabilidad/libromayor/libromayorlist/libromayorlist.component';
import {BalancegeneralComponent} from './components/contabilidad/reportes/balancegeneral/balancegeneral.component';
import {
    EstadoresultadosComponent
} from './components/contabilidad/reportes/estadoresultados/estadoresultados.component';
import {CategoriasComponent} from './components/articulos/categorias/categorias.component';
import {FacturaslistgenComponent} from './components/transac/facturas/facturaslistgen.component';
import {IngegrComponent} from './components/ingresosegresos/ingegr/ingegr.component';
import {IngegrformComponent} from './components/ingresosegresos/ingegrform/ingegrform.component';
import {UtilidadesComponent} from './components/transac/facturas/utilidades/utilidades.component';
import {ReportesComponent} from './components/reportes/reportes.component';
import {CierrecajaComponent} from './components/transac/cajas/cierrecaja.component';
import {CtesFinanService} from './components/finan/ctesfina.service';
import {FinanCredListComponent} from './components/finan/creditos/financredlist.component';
import {FinanCredFormComponent} from './components/finan/creditos-form/financredform.component';
import {FinanCredDetComponent} from './components/finan/creditos-det/financreddet.component';
import {FinanCuentasComponent} from './components/finan/cuentas/financuentas.component';
import {FinanMovsFormComponent} from './components/finan/movimientos/movs-form/movsform.component';
import {LoginfacteComponent} from './components/facte/loginfacte/loginfacte.component';
import {HomefacteComponent} from './components/facte/homefacte/homefacte.component';
import {PcontableCierreComponent} from './components/contabilidad/periodocontable/cierre/pcontablecierre.component';
import {PcontableNewComponent} from './components/contabilidad/periodocontable/apertura/pcontablenew.component';
import {ParametrosComponent} from './modules/sharedmed/parametros/parametros.component';
import {authGuard} from './guards/auth.guard';
import {AccountsPayableListComponent} from './components/transac/creditos/provs/accounts-payable-list/accounts-payable-list.component';
import { AuxcuentasxcpComponent } from './components/transac/facturas/cuentasxcp/auxcuentasxcp.component';

const finamod: CtesFinanService = new CtesFinanService();

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: StartComponent},
    {path: 'lghome', component: LoggedHomeComponent},
    {
        path: 'mercaderia',
        component: ArticulosListComponent,
        canActivate: [authGuard],
        data: {perml: ["PRODS_LISTAR"]}
    },
    {
        path: 'mercaderiaForm/:art_id',
        component: ArticulosFormComponent,
        canActivate: [authGuard],
        data: {perml: ["PRODS_LISTAR"]}
    },
    {
        path: 'mercaderiaView/:art_id',
        component: ArticulosViewComponent,
        canActivate: [authGuard],
        data: {perml: ["PRODS_LISTAR"]}
    },
    {path: 'categorias', component: CategoriasComponent},
    {path: 'loginfacte', component: LoginfacteComponent},
    {path: 'homefacte', component: HomefacteComponent},
    {
        path: 'tickets',
        component: TicketComponent,
        canActivate: [authGuard],
        data: {perml: ["TK_LISTAR"]}

    },
    {
        path: 'ticket/form',
        component: TicketformComponent,
        canActivate: [authGuard],
        data: {perml: ["TK_LISTAR"]}
    },
    {path: 'vtickets', component: IngegrComponent},
    {path: 'vtickets/form/:tipo', component: IngegrformComponent},
    {
        path: 'historiaclinica/:tipo',
        component: CitasmedicasComponent,
        canActivate: [authGuard],
        data: {perml: ["HIST_LISTAR"]}
    },
    {
        path: 'odonto',
        component: CitasodontoComponent,
        canActivate: [authGuard],
        data: {perml: ["HISTO_LISTAR"]}
    },
    {path: 'roles', component: RoleslistComponent},
    {path: 'roles/form/:rl_id', component: RolesformComponent},
    {
        path: 'usuarios',
        component: UserlistComponent,
        canActivate: [authGuard],
        data: {perml: ["US_LISTAR"]}
    },
    {
        path: 'usuarios/form/:us_id',
        component: UserformComponent,
        canActivate: [authGuard],
        data: {perml: ["US_LISTAR"]}
    },
    {
        path: 'agenda/:tipo',
        component: AgendaComponent,
        canActivate: [authGuard],
        data: {perml: ["AGN_LISTAR"]}
    },
    {
        path: 'trndocs/:tipo',
        component: FacturaslistgenComponent
    },
    {
        path: 'cuentasxcp/:tipo',
        component: AuxcuentasxcpComponent
    },
    {
        path: 'trndocform/:tracodigo/:acc',
        component: NewfacturaformComponent
    },
    {
        path: 'referentes',
        component: ReferenteslistComponent,
        canActivate: [authGuard],
        data: {perml: ["REF_LISTAR"]}
    },
    {
        path: 'referentes/:codref',
        component: ReferenteviewComponent,
        canActivate: [authGuard],
        data: {perml: ["REF_LISTAR"]}
    },
    {path: 'plancuentas', component: PlanctaslistComponent},
    {path: 'librodiario', component: LibrodiariolistComponent},
    {path: 'newasiento/:cod', component: LibrodiarioformComponent},
    {path: 'libromayor', component: LibromayorlistComponent},
    {path: 'contabilidad/balancegeneral', component: BalancegeneralComponent},
    {path: 'contabilidad/estadoresultados', component: EstadoresultadosComponent},
    {path: 'contabilidad/periodo/cierre', component: PcontableCierreComponent},
    {path: 'contabilidad/periodo/apertura', component: PcontableNewComponent},
    {path: 'utilventas', component: UtilidadesComponent},
    {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [authGuard],
        data: {perml: ["REP_ADM"]}
    },
    {path: 'cierrecaja', component: CierrecajaComponent},
    {path: finamod.rutaHome, component: FinanCredListComponent,
        canActivate: [authGuard],
        data: {perml: ["FIN_CRED_LIST"]}
    },
    {path: finamod.rutaCreaCred, component: FinanCredFormComponent,
        canActivate: [authGuard],
        data: {perml: ["FIN_CRED_LIST"]}
    },
    {path: finamod.rutaDetCred, component: FinanCredDetComponent,
        canActivate: [authGuard],
        data: {perml: ["FIN_CRED_LIST"]}
    },
    {path: finamod.rutaAperturaCta, component: FinanCuentasComponent,
        canActivate: [authGuard],
        data: {perml: ["FIN_CRED_LIST"]}
    },
    {path: finamod.rutaMovsCta, component: FinanMovsFormComponent,
        canActivate: [authGuard],
        data: {perml: ["FIN_CRED_LIST"]}
    },
    {path: 'parametros', component: ParametrosComponent,
        canActivate: [authGuard],
        data: {perml: ["APP_CONFIG"]}
    },
    {path: 'cuentas-por-pagar', component: AccountsPayableListComponent},
    {path: '**', component: HomeComponent}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
