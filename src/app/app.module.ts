import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {FlexLayoutModule} from '@angular/flex-layout';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuModule} from 'primeng/menu';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {MenubarModule} from 'primeng/menubar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {StartComponent} from './components/start/start.component';
import {ToastModule} from 'primeng/toast';

import {AperturaCajaComponent} from './components/cajas/apertura-caja/apertura-caja.component';
import {CierreCajaComponent} from './components/cajas/cierre-caja/cierre-caja.component';
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
import {ArticulosBatchComponent} from './components/articulos/articulos-batch/articulos-batch.component';
import {ArticuloItemBatchComponent} from './components/articulos/articulo-item-batch/articulo-item-batch.component';
import localeEs from '@angular/common/locales/es-EC';

import {CitasmedicasComponent} from './components/citas/citasmedicas/citasmedicas.component';
import {VticketComponent} from './components/tickets/vtickets/vticket/vticket.component';
import {VticketformComponent} from './components/tickets/vtickets/vticketform/vticketform.component';
import {OdontogramaComponent} from './components/citas/odontograma/odontograma.component';
import {RoleslistComponent} from './components/usuarios/roles/roleslist/roleslist.component';
import {RolesformComponent} from './components/usuarios/roles/rolesform/rolesform.component';
import {UserlistComponent} from './components/usuarios/userlist/userlist.component';
import {UserformComponent} from './components/usuarios/userform/userform.component';
import {TrubrosComponent} from './components/tickets/vtickets/trubros/trubros.component';
import {TrubrosformComponent} from './components/tickets/vtickets/trubrosform/trubrosform.component';
import {CitashechasComponent} from './components/citas/citashechas/citashechas.component';
import {CitasplanedComponent} from './components/citas/citasplaned/citasplaned.component';
import {CitaMedDetComponent} from './components/citas/citameddet/cita-med-det.component';
import {ButooldentComponent} from './components/citas/odontograma/butooldent.component';
import {RowdiagnospiezaComponent} from './components/citas/odontograma/rowdiagnospieza.component';
import {PiezadentalComponent} from './components/citas/odontograma/piezadental.component';
import {CaraspdComponent} from './components/citas/odontograma/caraspd.component';
import {NumpiezaComponent} from './components/citas/odontograma/numpieza.component';
import {GrppiezadentComponent} from './components/citas/odontograma/grppiezadent.component';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {InputMaskModule} from 'primeng/inputmask';
import {MessageModule} from 'primeng/message';
import {CheckboxModule} from 'primeng/checkbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {ContextMenuModule} from 'primeng/contextmenu';
import {TabViewModule} from 'primeng/tabview';
import {RadioButtonModule} from 'primeng/radiobutton';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {MessageService} from 'primeng/api';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DatospacienteComponent} from './components/citas/datospaciente.component';
import {ListadopacientesComponent} from './components/citas/listadopacientes.component';
import {AntcodontoComponent} from './components/citas/antcodonto.component';
import {CitasodontoComponent} from './components/citas/citasodonto/citasodonto.component';
import {OdatencionesComponent} from './components/citas/odatenciones.component';
import {ResumenPacienteComponent} from './components/citas/resumenpac.component';
import {OdcalendarComponent} from './components/citas/odcalendar/odcalendar.component';
import {ColorPickerModule} from 'primeng/colorpicker';
import {CitaodontodetComponent} from './components/citas/odontograma/citaodontodet.component';
import {DetallescitacalComponent} from './components/citas/odcalendar/detallescitacal.component';
import {RecetasComponent} from './components/citas/recetas.component';
import {RxdocsComponent} from './components/citas/rxdocs.component';
import {PlantratamientoComponent} from './components/citas/citasodonto/plantratamiento/plantratamiento.component';
import {FactpagosComponent} from './components/citas/citasodonto/factpagos/factpagos.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {FacturaviewComponent} from './components/transac/facturas/facturasview/facturaview.component';
import {AbonosviewComponent} from './components/transac/abonos/abonosview/abonosview.component';
import {LoadingComponent} from './components/home/loading.component';
import {FacturaslistComponent} from './components/transac/facturas/facturaslist/facturaslist.component';
import {FacturasformComponent} from './components/transac/facturas/facturasform/facturasform.component';
import {SidebarmenuComponent} from './components/shared/sidebarmenu/sidebarmenu.component';
import {NewfacturaformComponent} from './components/transac/facturas/newfacturaform/newfacturaform.component';
import {PlaneslistComponent} from './components/transac/planes/planeslist/planeslist.component';
import {PlanesformComponent} from './components/transac/planes/planesform/planesform.component';
import {ReferenteslistComponent} from './components/referentes/referenteslist.component';
import {ResumenrefComponent} from './components/referentes/resumenref.component';
import {ReferenteviewComponent} from './components/referentes/referenteview.component';
import {SuscripcionComponent} from './components/referentes/suscripciones/suscripcion.component';
import {SuscripviewComponent} from './components/referentes/suscripciones/suscripview.component';
import {VticketviewComponent} from './components/tickets/vtickets/vticket/vticketview.component';
import {AgendaComponent} from './components/citas/agenda.component';
import {PlanctaslistComponent} from './components/contabilidad/plancuentas/planctaslist.component';
import {TreeModule} from 'primeng/tree';
import {LibrodiariolistComponent} from './components/contabilidad/librodiario/librodiariolist/librodiariolist.component';
import {LibrodiarioformComponent} from './components/contabilidad/librodiario/librodiarioform/librodiarioform.component';
import {LibromayorlistComponent} from './components/contabilidad/libromayor/libromayorlist/libromayorlist.component';
import {BalancegeneralComponent} from './components/contabilidad/reportes/balancegeneral/balancegeneral.component';
import {EstadoresultadosComponent} from './components/contabilidad/reportes/estadoresultados/estadoresultados.component';
import {TreeTableModule} from 'primeng/treetable';
import {ApprangofechasComponent} from './components/shared/apprangofechas/apprangofechas.component';
import {CategoriasComponent} from './components/articulos/categorias/categorias.component';
import {FacturaslistgenComponent} from './components/transac/facturas/facturaslistgen.component';
import {CuentasxcpComponent} from './components/transac/facturas/cuentasxcp.component';
import {IngegrComponent} from './components/ingresosegresos/ingegr/ingegr.component';
import {IngegrformComponent} from './components/ingresosegresos/ingegrform/ingegrform.component';
import {AsientoviewComponent} from './components/contabilidad/librodiario/asientoview/asientoview.component';
import {IngegrviewComponent} from './components/ingresosegresos/ingegrview/ingegrview.component';
import {UtilidadesComponent} from './components/transac/facturas/utilidades/utilidades.component';


registerLocaleData(localeEs, 'es-EC');

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        StartComponent,
        AperturaCajaComponent,
        CierreCajaComponent,
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
        ArticulosBatchComponent,
        ArticuloItemBatchComponent,
        CitasmedicasComponent,
        VticketComponent,
        VticketformComponent,
        OdontogramaComponent,
        RoleslistComponent,
        RolesformComponent,
        UserlistComponent,
        UserformComponent,
        TrubrosComponent,
        TrubrosformComponent,
        CitashechasComponent,
        CitasplanedComponent,
        CitaMedDetComponent,
        ButooldentComponent,
        RowdiagnospiezaComponent,
        PiezadentalComponent,
        CaraspdComponent, RxdocsComponent,
        NumpiezaComponent,
        GrppiezadentComponent,
        DatospacienteComponent,
        ListadopacientesComponent,
        AntcodontoComponent,
        CitasodontoComponent,
        OdatencionesComponent,
        ResumenPacienteComponent,
        OdcalendarComponent,
        CitaodontodetComponent,
        DetallescitacalComponent,
        RecetasComponent,
        RxdocsComponent,
        PlantratamientoComponent,
        FactpagosComponent,
        FacturaviewComponent,
        AbonosviewComponent,
        LoadingComponent,
        FacturaslistComponent,
        FacturasformComponent,
        SidebarmenuComponent,
        NewfacturaformComponent,
        PlaneslistComponent,
        PlanesformComponent,
        ReferenteslistComponent,
        ResumenrefComponent,
        ReferenteviewComponent,
        SuscripcionComponent,
        SuscripviewComponent,
        VticketviewComponent,
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
        UtilidadesComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FlexLayoutModule,
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
        ToolbarModule,
        DialogModule,
        ButtonModule,
        SplitButtonModule,
        InputMaskModule,
        MessageModule,
        CheckboxModule,
        ToastModule,
        DropdownModule,
        CalendarModule,
        MegaMenuModule,
        ContextMenuModule,
        TabViewModule,
        AccordionModule,
        RadioButtonModule,
        BlockUIModule,
        ProgressSpinnerModule,
        AutoCompleteModule,
        SliderModule,
        ColorPickerModule,
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
        TreeTableModule
    ],
    providers: [
        AuthService,
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
