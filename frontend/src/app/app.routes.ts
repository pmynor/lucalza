import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CrearEncuestaComponent } from './components/crear-encuesta/crear-encuesta.component';
import { ListarPersonasComponent } from './components/listar-personas/listar-personas.component';
import { ListarEncuestaComponent } from './components/listar-encuesta/listar-encuesta.component';
import { CrearPersonaComponent } from './components/crear-persona/crear-persona.component';
import { ResponderEncuestaComponent } from './components/responder-encuesta/responder-encuesta.component';
import { ActualizarEncuestaComponent } from './components/actualizar-encuesta/actualizar-encuesta.component';
import { EstadisticasEncuestaComponent } from './components/estadisticas-encuesta/estadisticas-encuesta.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],   // <-- aquí
    children: [
      { path: 'crear', component: CrearEncuestaComponent },
      { path: 'listar', component: ListarPersonasComponent },
      { path: 'listarEncuestas', component: ListarEncuestaComponent },
      { path: 'personas', component: CrearPersonaComponent },
      { path: 'responder', component: ResponderEncuestaComponent },
      { path: 'actualizar/:id', component: ActualizarEncuestaComponent },
       { path: 'encuestas/:id/estadisticas', component: EstadisticasEncuestaComponent }

    ]
  }
];