import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from 'src/environments/environment';

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

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {MenubarModule} from 'primeng/menubar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ButtonModule} from 'primeng/button';
import {SidebarModule} from 'primeng/sidebar';
import {AccordionModule} from 'primeng/accordion';
import {PageHeaderComponent} from './components/shared/page-header/page-header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {StartComponent} from './components/start/start.component';
import {ToastModule} from 'primeng/toast';

import {AperturaCajaComponent} from './components/cajas/apertura-caja/apertura-caja.component';
import {CierreCajaComponent} from './components/cajas/cierre-caja/cierre-caja.component';
import {ArticulosListComponent} from './components/articulos/articulos-list/articulos-list.component';

import {ArticulosFormComponent} from './components/articulos/articulos-form/articulos-form.component';
import {DateFormatPipe} from './pipes/date-format.pipe';
import {DisableControlDirective} from './directives/disablecontrol.directive';
import {AuditInterceptorService} from './services/rates/audit-interceptor.service';
import {FusaynavbarComponent} from './components/shared/fusaynavbar/fusaynavbar.component';
import {FusayfooterComponent} from './components/shared/fusayfooter/fusayfooter.component';

import {GalleriaModule} from 'primeng/galleria';
import {EventosComponent} from './components/eventos/eventos.component';
import {EventosformComponent} from './components/eventos/eventosform/eventosform.component';
import {EventosdetComponent} from './components/eventos/eventosdet/eventosdet.component';
import {DatePipe, registerLocaleData} from '@angular/common';
import {LoggednavbarComponent} from './components/shared/loggednavbar/loggednavbar.component';
import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';

import {BreadcrumbModule} from 'primeng/breadcrumb';

import {AppfooterComponent} from './components/shared/appfooter/appfooter.component';
import {TicketComponent} from './components/tickets/ticket/ticket.component';
import {TicketformComponent} from './components/tickets/ticketform/ticketform.component';
import {ArticulosViewComponent} from './components/articulos/articulos-view/articulos-view.component';
import {ArticulosBatchComponent} from './components/articulos/articulos-batch/articulos-batch.component';
import {ArticuloItemBatchComponent} from './components/articulos/articulo-item-batch/articulo-item-batch.component';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {StepsModule} from 'primeng/steps';
import localeEs from '@angular/common/locales/es-EC';
import {
    AutoCompleteModule,
    BlockUIModule,
    CarouselModule,
    CheckboxModule,
    ContextMenuModule,
    EditorModule,
    InputMaskModule,
    MegaMenuModule,
    MessageModule,
    MessageService,
    ProgressSpinnerModule,
    RadioButtonModule,
    SplitButtonModule,
    TabViewModule,
    ToolbarModule
} from 'primeng';

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

registerLocaleData(localeEs, 'es-EC');

const config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(environment.googleLoginApp)
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(environment.facebookLoginApp)
    }
]);

export function provideConfig() {
    return config;
}


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        PageHeaderComponent,
        StartComponent,
        AperturaCajaComponent,
        CierreCajaComponent,
        ArticulosListComponent,
        ArticulosFormComponent,
        DateFormatPipe,
        DisableControlDirective,
        FusaynavbarComponent,
        FusayfooterComponent,
        EventosComponent,
        EventosformComponent,
        EventosdetComponent,
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
        TrubrosformComponent
    ],
    imports: [
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
        ButtonModule,
        SplitButtonModule,
        InputMaskModule,
        MessageModule,
        CheckboxModule,
        ToastModule,
        DropdownModule,
        CalendarModule,
        MegaMenuModule,
        GalleriaModule,
        CarouselModule,
        EditorModule,
        NgbModule,
        BreadcrumbModule,
        SidebarModule,
        ContextMenuModule,
        TabViewModule,
        SocialLoginModule,
        StepsModule,
        AccordionModule,
        RadioButtonModule,
        BlockUIModule,
        ProgressSpinnerModule,
        AutoCompleteModule
    ],
    providers: [
        AuthService,
        MessageService,
        DateFormatPipe,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuditInterceptorService,
            multi: true
        },
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {provide: LOCALE_ID, useValue: 'es-EC'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
