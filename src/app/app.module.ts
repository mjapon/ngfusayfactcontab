import {CommonModule, DatePipe, NgOptimizedImage, registerLocaleData} from '@angular/common';
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
import {ApprangofechasComponent} from './components/shared/apprangofechas/apprangofechas.component';
import {CategoriasComponent} from './components/articulos/categorias/categorias.component';
import {FacturaslistgenComponent} from './components/transac/facturas/facturaslistgen.component';
import {IngegrComponent} from './components/ingresosegresos/ingegr/ingegr.component';
import {IngegrformComponent} from './components/ingresosegresos/ingegrform/ingegrform.component';
import {AsientoviewComponent} from './components/contabilidad/librodiario/asientoview/asientoview.component';
import {IngegrviewComponent} from './components/ingresosegresos/ingegrview/ingegrview.component';
import {UtilidadesComponent} from './components/transac/facturas/utilidades/utilidades.component';
import {CredreflistComponent} from './components/transac/creditos/creditosref/credreflist/credreflist.component';
import {CredrefformComponent} from './components/transac/creditos/creditosref/credrefform/credrefform.component';
import {TicketviewComponent} from './components/tickets/ticketview/ticketview.component';
import {DetfactviewComponent} from './components/transac/facturas/facturasview/detfactview.component';
import {StepsModule} from 'primeng/steps';
import es from '@angular/common/locales/es';
import {BuscarefComponent} from './components/shared/buscaref/buscaref.component';
import {ChangesecdocComponent} from './components/transac/changesecdoc.component';
import {MavilgridComponent} from './components/shared/mavilgrid.component';
// import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
// import {environment} from 'src/environments/environment';
import {ArtviewComponent} from './components/articulos/artview/artview.component';
import {ReportesComponent} from './components/reportes/reportes.component';
import {CalcupreciomavilComponent} from './components/shared/calcupreciomavil/calcupreciomavil.component';
import {OdontogramaviewComponent} from './modules/odontologo/odontograma/odontogramaview.component';
import {OdongramahistlistComponent} from './modules/odontologo/odontograma/odongramahistlist.component';
import {CierrecajaComponent} from './components/transac/cajas/cierrecaja.component';
import {TickethistpacComponent} from './components/tickets/ticket/tickethistpac.component';
import {FinanCredListComponent} from './components/finan/creditos/financredlist.component';
import {FinanCredFormComponent} from './components/finan/creditos-form/financredform.component';
import {FinanCredDetComponent} from './components/finan/creditos-det/financreddet.component';
import {FinanPagosViewComponent} from './components/finan/pagos/pagos-view/pagosview.component';
import {FinanAdjuntosCredComponent} from './components/finan/adjuntoscred/adjuntoscred.component';
import {FinanCuentasComponent} from './components/finan/cuentas/financuentas.component';
import {FinanMovsFormComponent} from './components/finan/movimientos/movs-form/movsform.component';
import {LoginfacteComponent} from './components/facte/loginfacte/loginfacte.component';
import {HomefacteComponent} from './components/facte/homefacte/homefacte.component';
import {FacteloggedheadComponent} from './components/shared/facteloggedhead/facteloggedhead.component';
import {FormNewrefBasic} from './components/referentes/formnewref/formnewref.component';
import {PcontableCierreComponent} from './components/contabilidad/periodocontable/cierre/pcontablecierre.component';
import {PcontableNewComponent} from './components/contabilidad/periodocontable/apertura/pcontablenew.component';
import {
    AsientoCierreViewComponent
} from './components/contabilidad/periodocontable/asientocierreview/asientocierreview.component';
import {BadgeModule} from 'primeng/badge';
import {RippleModule} from 'primeng/ripple';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ListadorefsComponent} from './components/referentes/listadorefs/listadorefs.component';
import {AccordionModule} from 'primeng/accordion';
import {MarklabelComponent} from './components/shared/marklabel/marklabel.component';
import {CuentasxcpComponent} from './components/transac/facturas/cuentasxcp/cuentasxcp.component';
import {GradientBgDirective} from './modules/sharedmed/gradientdiv/gradientbg';
import {GradientShadowBgDirective} from './modules/sharedmed/gradientdiv/shadowbg';
import {AnimIcoDirective} from './modules/sharedmed/gradientdiv/animico';
import {ExportBtnComponent} from './components/shared/export-btn/export-btn.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CharacterCountDirective} from './modules/sharedmed/textareacount.directive';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {ChipsModule} from 'primeng/chips';
import {ImageviewerComponent} from './modules/sharedmed/imageviewer/imageviewer.component';
import {IngegrformEditComponent} from './components/ingresosegresos/ingegrformedit/ingegrformedit.component';
import {EstadisticasmedComponent} from './modules/medico/estadisticasmed/estadisticasmed.component';
import {KnobModule} from 'primeng/knob';
import {EstmedcardComponent} from './modules/medico/estmedcard/estmedcard.component';
import {WeekViewComponent} from './modules/mavilcalendar/week-view/week-view.component';
import {BsTooltipDirective} from './directivas/bs-tooltip.directive';


registerLocaleData(localeEs, 'es-EC');
registerLocaleData(es);

// const config: SocketIoConfig = {url: environment.socket, options: {}};

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
        BuscarefComponent,
        ChangesecdocComponent,
        MavilgridComponent,
        ArtviewComponent,
        ReportesComponent,
        CalcupreciomavilComponent,
        OdontogramaviewComponent,
        OdongramahistlistComponent,
        CierrecajaComponent,
        TickethistpacComponent,
        FinanCredListComponent,
        FinanCredFormComponent,
        FinanCredDetComponent,
        FinanPagosViewComponent,
        FinanAdjuntosCredComponent,
        FinanCuentasComponent,
        FinanMovsFormComponent,
        LoginfacteComponent,
        HomefacteComponent,
        FacteloggedheadComponent,
        FormNewrefBasic,
        PcontableCierreComponent,
        PcontableNewComponent,
        AsientoCierreViewComponent,
        ExportBtnComponent,
        ImageviewerComponent,
        IngegrformEditComponent,
        EstadisticasmedComponent,
        WeekViewComponent
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
        StepsModule,
        BadgeModule,
        RippleModule,
        BreadcrumbModule,
        NgOptimizedImage,
        AccordionModule,
        MarklabelComponent,
        GradientShadowBgDirective,
        GradientBgDirective,
        AnimIcoDirective,
        InputTextareaModule,
        CharacterCountDirective,
        OverlayPanelModule,
        InputGroupModule,
        InputGroupAddonModule,
        ChipsModule,
        KnobModule,
        EstmedcardComponent,
        BsTooltipDirective,
        // SocketIoModule.forRoot(config)
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
    exports: [
        LoadingComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
