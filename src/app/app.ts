import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 1. Importante para usar *ngIf
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router'; // 2. Importamos el Router
// (Aquí tendrás la importación de tu menú, por ejemplo: import { NavbarComponent } from '...')

@Component({
  selector: 'app-root',
  standalone: true,
  // 3. Asegúrate de que CommonModule esté en los imports
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  
  // 4. Inyectamos el Router con la palabra 'public' para que el HTML pueda leerlo
  constructor(public router: Router) {}

}