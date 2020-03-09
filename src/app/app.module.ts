import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Codigo agregado para la logica de Firebase
//import { AngularFireModule } from '@angular/fire'; // Firebase config
//import { AngularFirestoreModule } from '@angular/fire/firestore'; // For Cloud Firestore
//import { environment } from 'src/environments/environment'; // Config
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/shared/navbar/navbar.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuComponent} from './components/shared/menu/menu.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DropdownModule} from 'primeng/dropdown';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CalendarModule} from 'primeng/calendar';
import {ContribuyenteService} from './services/contribuyente.service';
import {ContribsListComponent} from './components/contribs/contribs-list/contribs-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {MenubarModule} from 'primeng/menubar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AngularFireAuth} from '@angular/fire/auth';
import {SidebarModule} from 'primeng/sidebar';
import {
  CarouselModule,
  CheckboxModule,
  EditorModule,
  InputMaskModule,
  MegaMenuModule,
  MessageModule,
  MessageService,
  SplitButtonModule,
  ToolbarModule
} from 'primeng/primeng';
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
import { Congreso2020Component } from './components/blog/congreso2020/congreso2020.component';
import { LoggednavbarComponent } from './components/shared/loggednavbar/loggednavbar.component';
import { LoggedHomeComponent } from './components/logged/logged-home/logged-home.component';

import {BreadcrumbModule} from 'primeng/breadcrumb';
import {BlogComponent} from './components/blogs/blog/blog.component';
import {BlogsComponent} from './components/blogs/blogs.component';
import { AppfooterComponent } from './components/shared/appfooter/appfooter.component';
import {TicketComponent} from "./components/tickets/ticket/ticket.component";
import {TicketformComponent} from "./components/tickets/ticketform/ticketform.component";

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


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
      TicketformComponent
  ],
  imports: [
    BrowserModule,
    // Imports agregados
    //AngularFireModule.initializeApp(environment.firebaseConfig), // Import firebase
    //AngularFirestoreModule, // Import firestore
    FlexLayoutModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
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
    AngularFontAwesomeModule,
    GalleriaModule,
    CarouselModule,
    EditorModule,
    NgbModule,
    BreadcrumbModule,
    SidebarModule
  ],
  providers: [
    ContribuyenteService,
    AuthService,
    MessageService,
    DateFormatPipe,
    DatePipe,
    AngularFireAuth,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuditInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
