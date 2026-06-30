import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio'; 
import { ReservasComponent } from './features/reservas/reservas'; 
import { CanchasComponent } from './features/canchas/canchas';
import { NosotrosComponent } from './features/nosotros/nosotros';
import { LoginComponent } from './features/login/login';
import { RecuperarComponent } from './features/recuperar/recuperar';
import { RegistroComponent } from './features/registro/registro';
import { PerfilComponent } from './features/perfil/perfil';
import { PerfilReservasComponent } from './features/perfil-reservas/perfil-reservas';
import { MisReservasComponent } from './features/mis-reservas/mis-reservas';
import { ChatSoporteComponent } from './features/chat-soporte/chat-soporte';

export const routes: Routes = [
  // 1. Cuando la URL esté vacía (localhost:4200), redirigir a 'inicio'
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  
  // 2. Cuando la URL sea 'inicio', cargar tu componente
  { path: 'inicio', component: InicioComponent },
  
  // 3. Tu nueva ruta de reservas
  { path: 'reservas', component: ReservasComponent },

  // 4. Ruta para canchas
  { path: 'canchas', component: CanchasComponent },

  // 5. Ruta para nosotros
  { path: 'nosotros', component: NosotrosComponent },

  // 6. Ruta para login
  { path: 'login', component: LoginComponent },

  // 7. Ruta para recuperar contraseña
  { path: 'recuperar', component: RecuperarComponent },

  // 8. Ruta para registro
  { path: 'registro', component: RegistroComponent },

  //9. Ruta para el perfil del usuario
  { path: 'perfil', component: PerfilComponent },

  // 10. Ruta para las reservas del usuario
  { path: 'perfil-reservas', component: PerfilReservasComponent },

  // 11. Ruta para las reservas del usuario
  { path: 'mis-reservas', component: MisReservasComponent },

  // 12. Ruta para el chat de soporte
  { path: 'chat-soporte', component: ChatSoporteComponent },

  // Ruta comodín (¡SIEMPRE AL FINAL DEL ARREGLO!)
  { path: '**', redirectTo: 'inicio' }
];
