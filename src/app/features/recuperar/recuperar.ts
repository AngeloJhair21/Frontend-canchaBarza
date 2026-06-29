import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.scss']
})
export class RecuperarComponent {
  
  pasoActual: number = 1;
  mostrarClave = false;
  mostrarConfirmarClave = false;

  // 1. REGEX ESTRICTO: Al menos 1 mayúscula, al menos 1 símbolo especial, SIN espacios, mínimo 8 caracteres.
  passwordPattern = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])(?!.*\s).{8,}$/;

  recuperarForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    d1: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d2: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d3: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d4: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d5: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    
    // 2. Aplicamos la regla estricta a la nueva contraseña
    nuevaPassword: new FormControl('', [
      Validators.required, 
      Validators.pattern(this.passwordPattern)
    ]),
    confirmarPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  constructor(private router: Router) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('nuevaPassword');
    const confirmPassword = control.get('confirmarPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { noCoincide: true } : null;
  }

  enviarCodigo(): void {
    if (this.recuperarForm.get('correo')?.valid) {
      this.pasoActual = 2;
    }
  }

  verificarCodigo(): void {
    this.pasoActual = 3;
  }

  restablecerContrasena(): void {
    if (this.recuperarForm.valid) {
      console.log('Enviando nueva contraseña segura al backend...');
      // 3. EN LUGAR DE ALERT: Pasamos al Paso 4 (Vista de Éxito)
      this.pasoActual = 4;
    } else {
      this.recuperarForm.markAllAsTouched();
    }
  }

  // 4. Función para el botón final que lo lleva a su sesión
  irALaCuenta(): void {
    this.router.navigate(['/inicio']); // O la ruta de su perfil de usuario
  }

  toggleClave() { this.mostrarClave = !this.mostrarClave; }
  toggleConfirmarClave() { this.mostrarConfirmarClave = !this.mostrarConfirmarClave; }

  moverFoco(event: any, siguiente: HTMLInputElement | null, anterior: HTMLInputElement | null): void {
    const input = event.target;
    const valorLimpio = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    input.value = valorLimpio;

    if (event.key === 'Backspace' && input.value === '' && anterior) {
      anterior.focus();
    } else if (valorLimpio.length === 1 && siguiente) {
      siguiente.focus();
    }
  }
}