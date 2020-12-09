import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';

//config firebase
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { MaterialModule } from './material/material.module';
import { ChartsModule } from 'ng2-charts';




import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { AsideComponent } from './components/aside/aside.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { LoginContentComponent } from './components/auth/login/login-content/login-content.component';
import { MyProjectsContentComponent } from './components/my-projects/my-projects-content/my-projects-content.component';
import { BandejaComponent } from './components/bandeja/bandeja.component';
import { BandejaContentComponent } from './components/bandeja/bandeja-content/bandeja-content.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { ViewProjectComponent } from './components/view-project/view-project.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewProjectComponent } from './components/dialogs/new-project/new-project.component';
import { ConfirmCreateComponent } from './components/dialogs/confirm-create/confirm-create.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HusComponent } from './components/dialogs/hus/hus.component';
import { NewEvaluationComponent } from './components/dialogs/new-evaluation/new-evaluation.component';
import { CategoryEvaluationComponent } from './components/dialogs/category-evaluation/category-evaluation.component';
import { ViewEvaluationComponent } from './components/dialogs/view-evaluation/view-evaluation.component';
import { EvaluationsDetailsComponent } from './components/evaluations-details/evaluations-details.component';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    AsideComponent,
    NavbarComponent,
    MyProjectsComponent,
    LoginContentComponent,
    MyProjectsContentComponent,
    BandejaComponent,
    BandejaContentComponent,
    MainHeaderComponent,
    ViewProjectComponent,
    NewProjectComponent,
    ConfirmCreateComponent,
    HusComponent,
    NewEvaluationComponent,
    CategoryEvaluationComponent,
    ViewEvaluationComponent,
    EvaluationsDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    MaterialModule,
    routing,
    BrowserAnimationsModule,
    ChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    NewProjectComponent,
    ConfirmCreateComponent,
    HusComponent,
    NewEvaluationComponent,
    CategoryEvaluationComponent,
    ViewEvaluationComponent
 ],
  providers: [appRoutingProviders, { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
