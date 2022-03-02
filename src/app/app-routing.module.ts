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
import {UtilidadesComponent} from './components/transac/facturas/utilidades/utilidades.component';
import {AguaHomeComponent} from './components/aguap/home/agua-home.component';
import {ContraguaformComponent} from './components/aguap/contraguaform/contraguaform.component';
import {LectomedComponent} from './components/aguap/lectomed/lectomed.component';
import {CtesAguapService} from './components/aguap/utils/ctes-aguap.service';
import {CobroaguaComponent} from './components/aguap/cobroagua/cobroagua.component';
import {AgplistadohomeComponent} from './components/aguap/utils/agplistadohome.component';
import {RepagomavilComponent} from './components/aguap/utils/repagomavil.component';
import {ReportesComponent} from './components/reportes/reportes.component';
import {RblistComponent} from './components/transac/rubros/list/rblist.component';
import {CierrecajaComponent} from './components/transac/cajas/cierrecaja.component';
import {BasepreciosComponent} from './components/shared/baseprecios.component';
import {AgpReporteLecturasComponent} from './components/aguap/reportes/lecturasagua.component';
import {AgpReportePagosComponent} from './components/aguap/reportes/pagosagua.component';
import { AguaMainComponent } from './components/aguap/main/agua-main.component';
// import {AdminGuard} from './guards/admin/admin.guard';

const aguapmod: CtesAguapService = new CtesAguapService();

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: StartComponent},
    {path: 'lghome', component: LoggedHomeComponent},
    {
        path: 'mercaderia',
        component: ArticulosListComponent,
        /*data: {perml: ['PRODS_LISTAR']},
        canActivate: [AdminGuard]*/
    },
    {
        path: 'mercaderiaForm/:art_id',
        component: ArticulosFormComponent,
        /*data: {perml: ['PRODS_EDIT', 'PRODS_CREATE']},
        canActivate: [AdminGuard]*/
    },
    {
        path: 'mercaderiaView/:art_id',
        component: ArticulosViewComponent,
        /*data: {perml: ['PRODS_DET_VIEW']}*/
    },
    {path: 'categorias', component: CategoriasComponent},
    {path: 'preciosmavil', component: BasepreciosComponent},
    {path: 'tickets', component: TicketComponent},
    {path: 'ticket/form', component: TicketformComponent},
    {path: 'vtickets', component: IngegrComponent},
    {path: 'vtickets/form/:tipo', component: IngegrformComponent},
    {path: 'historiaclinica/:tipo', component: CitasmedicasComponent},
    {path: 'odonto', component: CitasodontoComponent},
    {path: 'roles', component: RoleslistComponent},
    {path: 'roles/form/:rl_id', component: RolesformComponent},
    {path: 'usuarios', component: UserlistComponent},
    {path: 'usuarios/form/:us_id', component: UserformComponent},
    {path: 'agenda/:tipo', component: AgendaComponent},
    {path: 'trndocs/:tipo', component: FacturaslistgenComponent},
    {path: 'cuentasxcp/:tipo', component: CuentasxcpComponent},
    {path: 'trndocform/:tracodigo/:acc', component: NewfacturaformComponent},
    {path: 'referentes', component: ReferenteslistComponent},
    {path: 'referentes/:codref', component: ReferenteviewComponent},
    {path: 'plancuentas', component: PlanctaslistComponent},
    {path: 'librodiario', component: LibrodiariolistComponent},
    {path: 'newasiento/:cod', component: LibrodiarioformComponent},
    {path: 'libromayor', component: LibromayorlistComponent},
    {path: 'contabilidad/balancegeneral', component: BalancegeneralComponent},
    {path: 'contabilidad/estadoresultados', component: EstadoresultadosComponent},
    {path: 'utilventas', component: UtilidadesComponent},
    {path: 'reportes', component: ReportesComponent},
    {path: 'rubros', component: RblistComponent},
    {path: 'cierrecaja', component: CierrecajaComponent},
    {path: aguapmod.rutaHome, component: AguaHomeComponent},
    { path: aguapmod.rutaMain, component: AguaMainComponent},
    {path: aguapmod.rutaContraForm, component: ContraguaformComponent},
    {path: aguapmod.rutaLectoMedForm, component: LectomedComponent},
    {path: aguapmod.rutaPagos, component: CobroaguaComponent},
    {path: aguapmod.rutaListados, component: AgplistadohomeComponent},
    {path: aguapmod.rutaPagoMavil, component: RepagomavilComponent},
    {path: aguapmod.rutaReporteLecturas, component: AgpReporteLecturasComponent},
    {path: aguapmod.rutaReportePagos, component: AgpReportePagosComponent},
    {path: '**', component: HomeComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
