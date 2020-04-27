import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from 'src/environments/environment';

import {FlexLayoutModule} from '@angular/flex-layout';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/shared/navbar/navbar.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuComponent} from './components/shared/menu/menu.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {ContribuyenteService} from './services/contribuyente.service';
import {ContribsListComponent} from './components/contribs/contribs-list/contribs-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {MenubarModule} from 'primeng/menubar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {ContribsFormComponent} from './components/contribs/contribs-form/contribs-form.component';
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
import {ReferentesListComponent} from './components/referentes/referentes-list/referentes-list.component';
import {ReferentesFormComponent} from './components/referentes/referentes-form/referentes-form.component';
import {AuditInterceptorService} from './services/rates/audit-interceptor.service';
import {SenderComponentComponent} from './components/sender-component/sender-component.component';
import {FusaynavbarComponent} from './components/shared/fusaynavbar/fusaynavbar.component';
import {LoadcomponentComponent} from './components/shared/loadcomponent/loadcomponent.component';
import {FusayfooterComponent} from './components/shared/fusayfooter/fusayfooter.component';

import {GalleriaModule} from 'primeng/galleria';
import {MiembrodirectivaComponent} from './components/miembrodirectiva/miembrodirectiva.component';
import {EventosComponent} from './components/eventos/eventos.component';
import {EventosformComponent} from './components/eventos/eventosform/eventosform.component';
import {EventosdetComponent} from './components/eventos/eventosdet/eventosdet.component';
import {PersonaformComponent} from './components/personas/personaform/personaform.component';
import {ValidationMessagesComponent} from './components/shared/validation-messages/validation-messages.component';
import {DatePipe} from '@angular/common';
import {Congreso2020Component} from './components/blog/congreso2020/congreso2020.component';
import {LoggednavbarComponent} from './components/shared/loggednavbar/loggednavbar.component';
import {LoggedHomeComponent} from './components/logged/logged-home/logged-home.component';

import {BreadcrumbModule} from 'primeng/breadcrumb';
import {BlogComponent} from './components/blogs/blog/blog.component';
import {BlogsComponent} from './components/blogs/blogs.component';
import {AppfooterComponent} from './components/shared/appfooter/appfooter.component';
import {TicketComponent} from './components/tickets/ticket/ticket.component';
import {TicketformComponent} from './components/tickets/ticketform/ticketform.component';
import {ArticulosViewComponent} from './components/articulos/articulos-view/articulos-view.component';
import {ArticulosBatchComponent} from './components/articulos/articulos-batch/articulos-batch.component';
import {ArticuloItemBatchComponent} from './components/articulos/articulo-item-batch/articulo-item-batch.component';
import {TelemedicinaComponent} from './components/telemedicina/telemedicina.component';
import {GoogleLoginProvider, SocialLoginModule, AuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';
import {StepsModule} from 'primeng/steps';

import {LOCALE_ID} from '@angular/core';
import localeEs from '@angular/common/locales/es-EC';
import {registerLocaleData} from '@angular/common';
import {
    CarouselModule,
    CheckboxModule, ContextMenuModule, EditorModule,
    InputMaskModule,
    MegaMenuModule,
    MessageModule, MessageService,
    SplitButtonModule, TabViewModule,
    ToolbarModule
} from 'primeng';

registerLocaleData(localeEs, 'es-EC');

let config = new AuthServiceConfig([
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
        NavbarComponent,
        LoginComponent,
        HomeComponent,
        MenuComponent,
        ContribsListComponent,
        ContribsFormComponent,
        PageHeaderComponent,
        StartComponent,
        AperturaCajaComponent,
        CierreCajaComponent,
        ArticulosListComponent,
        ArticulosFormComponent,
        DateFormatPipe,
        DisableControlDirective,
        ReferentesListComponent,
        ReferentesFormComponent,
        SenderComponentComponent,
        FusaynavbarComponent,
        LoadcomponentComponent,
        FusayfooterComponent,
        MiembrodirectivaComponent,
        EventosComponent,
        EventosformComponent,
        EventosdetComponent,
        PersonaformComponent,
        ValidationMessagesComponent,
        Congreso2020Component,
        LoggednavbarComponent,
        LoggedHomeComponent,
        BlogComponent,
        BlogsComponent,
        AppfooterComponent,
        TicketComponent,
        TicketformComponent,
        ArticulosViewComponent,
        ArticulosBatchComponent,
        ArticuloItemBatchComponent,
        TelemedicinaComponent
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
        TableModule,
        MenubarModule,
        SelectButtonModule,
        ToolbarModule,
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
        StepsModule
    ],
    providers: [
        ContribuyenteService,
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
