import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {BlockUIModule} from 'primeng/blockui';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputMaskModule} from 'primeng/inputmask';
import {InputNumberModule} from 'primeng/inputnumber';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessageModule} from 'primeng/message';
import {MessageService} from 'primeng/api';
import {MultiSelectModule} from 'primeng/multiselect';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {ToastModule} from 'primeng/toast';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StartComponent} from './components/start/start.component';
import {ArticulosListComponent} from './components/articulos/articulos-list/articulos-list.component';

import {ArticulosFormComponent} from './components/articulos/articulos-form/articulos-form.component';
import {AuditInterceptorService} from './services/rates/audit-interceptor.service';
import {FusaynavbarComponent} from './components/shared/initnavbar/fusaynavbar.component';
import {FusayfooterComponent} from './components/shared/initfooter/fusayfooter.component';
import {LoggednavbarComponent} from './components/shared/loggednavbar/loggednavbar.component';
import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';

import {AppfooterComponent} from './components/shared/loggedfooter/appfooter.component';
import {TicketComponent} from './components/tickets/ticket/ticket.component';
import {TicketformComponent} from './components/tickets/ticketform/ticketform.component';
import {ArticulosViewComponent} from './components/articulos/articulos-view/articulos-view.component';
import localeEs from '@angular/common/locales/es-EC';

import {CitasmedicasComponent} from './modules/medico/citasmedicas/citasmedicas.component';
import {OdontogramaComponent} from './modules/odontologo/odontograma/odontograma.component';
import {RoleslistComponent} from './components/usuarios/roles/roleslist/roleslist.component';
import {RolesformComponent} from './components/usuarios/roles/rolesform/rolesform.component';
import {UserlistComponent} from './components/usuarios/userlist/userlist.component';
import {UserformComponent} from './components/usuarios/userform/userform.component';
import {CitashechasComponent} from './modules/sharedmed/citashechas/citashechas.component';
import {CitasplanedComponent} from './modules/sharedmed/citasplaned/citasplaned.component';
import {CitaMedDetComponent} from './modules/medico/citameddet/cita-med-det.component';
import {ButooldentComponent} from './modules/odontologo/odontograma/butooldent.component';
import {RowdiagnospiezaComponent} from './modules/odontologo/odontograma/rowdiagnospieza.component';
import {PiezadentalComponent} from './modules/odontologo/odontograma/piezadental.component';
import {CaraspdComponent} from './modules/odontologo/odontograma/caraspd.component';
import {NumpiezaComponent} from './modules/odontologo/odontograma/numpieza.component';
import {GrppiezadentComponent} from './modules/odontologo/odontograma/grppiezadent.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DatosrefComponent} from './components/referentes/datosref.component';
import {ListadorefsComponent} from './components/referentes/listadorefs.component';
import {AntcodontoComponent} from './modules/odontologo/antcodonto.component';
import {CitasodontoComponent} from './modules/odontologo/citasodonto/citasodonto.component';
import {OdatencionesComponent} from './modules/odontologo/odatenciones.component';
import {ResumenPacienteComponent} from './modules/odontologo/resumenpac.component';
import {MvcalendarComponent} from './modules/mavilcalendar/mvcalendar/mvcalendar.component';
import {CitaodontodetComponent} from './modules/odontologo/odontograma/citaodontodet.component';
import {DetallescitacalComponent} from './modules/mavilcalendar/mvcalendar/detallescitacal.component';
import {RecetasComponent} from './modules/odontologo/recetas.component';
import {RxdocsComponent} from './modules/sharedmed/rxdocs.component';
import {PlantratamientoComponent} from './modules/odontologo/citasodonto/plantratamiento/plantratamiento.component';
import {FactpagosComponent} from './modules/odontologo/citasodonto/factpagos/factpagos.component';

import {FacturaviewComponent} from './components/transac/facturas/facturasview/facturaview.component';
import {AbonosviewComponent} from './components/transac/abonos/abonosview/abonosview.component';
import {LoadingComponent} from './components/home/loading.component';
import {FacturaslistComponent} from './components/transac/facturas/facturaslist/facturaslist.component';
import {FacturasformComponent} from './components/transac/facturas/facturasform/facturasform.component';
import {NewfacturaformComponent} from './components/transac/facturas/newfacturaform/newfacturaform.component';
import {ReferenteslistComponent} from './components/referentes/referenteslist.component';
import {ResumenrefComponent} from './components/referentes/resumenref.component';
import {ReferenteviewComponent} from './components/referentes/referenteview.component';
import {AgendaComponent} from './modules/agenda/agenda.component';
import {PlanctaslistComponent} from './components/contabilidad/plancuentas/planctaslist.component';

import {LibrodiariolistComponent} from './components/contabilidad/librodiario/librodiariolist/librodiariolist.component';
import {LibrodiarioformComponent} from './components/contabilidad/librodiario/librodiarioform/librodiarioform.component';
import {LibromayorlistComponent} from './components/contabilidad/libromayor/libromayorlist/libromayorlist.component';
import {BalancegeneralComponent} from './components/contabilidad/reportes/balancegeneral/balancegeneral.component';
import {EstadoresultadosComponent} from './components/contabilidad/reportes/estadoresultados/estadoresultados.component';
import {ApprangofechasComponent} from './components/shared/apprangofechas/apprangofechas.component';
import {CategoriasComponent} from './components/articulos/categorias/categorias.component';
import {FacturaslistgenComponent} from './components/transac/facturas/facturaslistgen.component';
import {CuentasxcpComponent} from './components/transac/facturas/cuentasxcp.component';
import {IngegrComponent} from './components/ingresosegresos/ingegr/ingegr.component';
import {IngegrformComponent} from './components/ingresosegresos/ingegrform/ingegrform.component';
import {AsientoviewComponent} from './components/contabilidad/librodiario/asientoview/asientoview.component';
import {IngegrviewComponent} from './components/ingresosegresos/ingegrview/ingegrview.component';
import {UtilidadesComponent} from './components/transac/facturas/utilidades/utilidades.component';
import {CredreflistComponent} from './components/transac/creditos/creditosref/credreflist/credreflist.component';
import {CredrefformComponent} from './components/transac/creditos/creditosref/credrefform/credrefform.component';
import {TicketviewComponent} from './components/tickets/ticketview/ticketview.component';
import {DetfactviewComponent} from './components/transac/facturas/facturasview/detfactview.component';
import {AguaHomeComponent} from './components/aguap/home/agua-home.component';
import {ContraguaformComponent} from './components/aguap/contraguaform/contraguaform.component';
import {LectomedComponent} from './components/aguap/lectomed/lectomed.component';
import {CobroaguaComponent} from './components/aguap/cobroagua/cobroagua.component';
import {StepsModule} from 'primeng/steps';
import {DatosmedidorComponent} from './components/aguap/utils/datosmedidor.component';
import {TblmedidoresComponent} from './components/aguap/utils/tblmedidores.component';
import {BasicdatosrefComponent} from './components/aguap/utils/basicdatosref.component';
import es from '@angular/common/locales/es';
import {BuscarefComponent} from './components/shared/buscaref/buscaref.component';
import {BuscamedidorComponent} from './components/aguap/utils/buscamedidor.component';
import {BtntipobusaguaComponent} from './components/aguap/utils/btntipobusagua.component';
import {AgplistadoComponent} from './components/aguap/utils/agplistado.component';
import {AgplistadohomeComponent} from './components/aguap/utils/agplistadohome.component';
import {ChangesecdocComponent} from './components/transac/changesecdoc.component';
import {RepagomavilComponent} from './components/aguap/utils/repagomavil.component';
import {MavilgridComponent} from './components/shared/mavilgrid.component';


registerLocaleData(localeEs, 'es-EC');
registerLocaleData(es);

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        StartComponent,
        ArticulosListComponent,
        ArticulosFormComponent,
        FusaynavbarComponent,
        FusayfooterComponent,
        LoggednavbarComponent,
        LoggedHomeComponent,
        AppfooterComponent,
        TicketComponent,
        TicketformComponent,
        ArticulosViewComponent,
        CitasmedicasComponent,
        OdontogramaComponent,
        RoleslistComponent,
        RolesformComponent,
        UserlistComponent,
        UserformComponent,
        CitashechasComponent,
        CitasplanedComponent,
        CitaMedDetComponent,
        ButooldentComponent,
        RowdiagnospiezaComponent,
        PiezadentalComponent,
        CaraspdComponent, RxdocsComponent,
        NumpiezaComponent,
        GrppiezadentComponent,
        DatosrefComponent,
        ListadorefsComponent,
        AntcodontoComponent,
        CitasodontoComponent,
        OdatencionesComponent,
        ResumenPacienteComponent,
        MvcalendarComponent,
        CitaodontodetComponent,
        DetallescitacalComponent,
        RecetasComponent,
        RxdocsComponent,
        PlantratamientoComponent,
        FactpagosComponent,
        FacturaviewComponent,
        DetfactviewComponent,
        AbonosviewComponent,
        LoadingComponent,
        FacturaslistComponent,
        FacturasformComponent,
        NewfacturaformComponent,
        ReferenteslistComponent,
        ResumenrefComponent,
        ReferenteviewComponent,
        AgendaComponent,
        PlanctaslistComponent,
        LibrodiariolistComponent,
        LibrodiarioformComponent,
        LibromayorlistComponent,
        BalancegeneralComponent,
        EstadoresultadosComponent,
        ApprangofechasComponent,
        CategoriasComponent,
        FacturaslistgenComponent,
        CuentasxcpComponent,
        IngegrComponent,
        IngegrformComponent,
        AsientoviewComponent,
        IngegrviewComponent,
        UtilidadesComponent,
        CredreflistComponent,
        CredrefformComponent,
        TicketviewComponent,
        AguaHomeComponent,
        ContraguaformComponent,
        LectomedComponent,
        CobroaguaComponent,
        DatosmedidorComponent,
        TblmedidoresComponent,
        BasicdatosrefComponent,
        BuscarefComponent,
        BuscamedidorComponent,
        BtntipobusaguaComponent,
        AgplistadoComponent,
        AgplistadohomeComponent,
        ChangesecdocComponent,
        RepagomavilComponent,
        MavilgridComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        PanelMenuModule,
        MenuModule,
        TableModule,
        MenubarModule,
        SelectButtonModule,
        DialogModule,
        InputMaskModule,
        MessageModule,
        CheckboxModule,
        ToastModule,
        DropdownModule,
        CalendarModule,
        ContextMenuModule,
        TabViewModule,
        RadioButtonModule,
        BlockUIModule,
        ProgressSpinnerModule,
        AutoCompleteModule,
        SidebarModule,
        TreeModule,
        MultiSelectModule,
        TranslateModule.forRoot({
            defaultLanguage: 'es', loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        InputNumberModule,
        TreeTableModule,
        StepsModule
    ],
    providers: [
        MessageService,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuditInterceptorService,
            multi: true
        },
        {provide: LOCALE_ID, useValue: 'es'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
