import { ModuleWithProviders, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//se importan los elementos a los que se las hará una pagina exclusiva
import { LoginComponent } from './components/auth/login/login.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { BandejaComponent } from './components/bandeja/bandeja.component';
import { ViewProjectComponent } from './components/view-project/view-project.component';
import { EvaluationsDetailsComponent } from './components/evaluations-details/evaluations-details.component';




const appRoutes: Routes =[

    { path: '', component: LoginComponent},
    { path: 'auth/login', component: LoginComponent},
    { path: 'home/inbox', component: BandejaComponent},
    { path: 'view-project/:creator/:project', component: ViewProjectComponent},
    { path: 'home/dashboard', component: MyProjectsComponent},
    { path: 'view-project/details-evalatuation/:creator/:project/:evaluation', component: EvaluationsDetailsComponent},
    { path: '**', component: LoginComponent}

];

//exportar el modulo de rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);