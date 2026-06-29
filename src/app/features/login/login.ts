import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Para el botón volver y los links

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // ¡Importante RouterLink!
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  
  loginForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]) // Sin lógica de caracteres
  });

  // Variable para controlar el "ojito"
  mostrarPassword = false;

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion(): void {
    if (this.loginForm.valid) {
      console.log('Enviando datos al backend:', this.loginForm.value);
      // Aquí irá el POST a Spring Boot
    }
  }
}