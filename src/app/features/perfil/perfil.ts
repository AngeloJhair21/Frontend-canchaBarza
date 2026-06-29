import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent {

  // === 1. DATOS SIMULADOS DEL USUARIO ===
  usuario = {
    nombre: 'Juan Pérez',
    correo: 'juanperez@example.com',
    dni: '12345678',
    telefono: '+51 987 654 321',
    notificaciones: true,
    boletin: false
  };

  // === 2. VARIABLES DEL MODAL ===
  mostrarModalEdit = false;
  vistaModal = 'principal'; // Puede ser: 'principal', 'verificando-codigo', 'nueva-clave'
  tipoVerificacion = ''; // Puede ser: 'correo', 'telefono', 'password'

  mostrarClave = false;
  mostrarConfirmarClave = false;
  mensajeExito = '';

  // === 3. FORMULARIOS (Reactive Forms) ===
  perfilForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required])
  });

  codigoForm = new FormGroup({
    d1: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d2: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d3: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d4: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]),
    d5: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)])
  });

  claveForm = new FormGroup({
    nuevaPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])(?!.*\s).{8,}$/)]),
    confirmarPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('nuevaPassword');
    const confirm = control.get('confirmarPassword');
    return password && confirm && password.value !== confirm.value ? { noCoincide: true } : null;
  }

  // === 4. FUNCIONES DEL MODAL ===
  abrirModal(): void {
    // Al abrir, llenamos las cajas de texto con los datos reales del usuario
    this.perfilForm.patchValue({
      correo: this.usuario.correo,
      telefono: this.usuario.telefono
    });
    this.vistaModal = 'principal';
    this.mostrarModalEdit = true;
  }

  cerrarModal(): void {
    this.mostrarModalEdit = false;
    this.codigoForm.reset();
    this.claveForm.reset();
  }

  iniciarVerificacion(tipo: string): void {
    this.tipoVerificacion = tipo;
    console.log(`Enviando código de verificación para: ${tipo}...`);
    this.vistaModal = 'verificando-codigo';
  }

  verificarCodigo(): void {
    if (this.codigoForm.valid) {
      if (this.tipoVerificacion === 'password') {
        this.vistaModal = 'nueva-clave';
      } else {
        this.vistaModal = 'principal';
        this.codigoForm.reset();
      }
    }
  }

  guardarNuevaClave(): void {
    if (this.claveForm.valid) {
      // EN LUGAR DE ALERT: Mostramos la vista de éxito
      this.mensajeExito = 'Tu contraseña ha sido actualizada con éxito.';
      this.vistaModal = 'exito';
      this.claveForm.reset();
    } else {
      this.claveForm.markAllAsTouched();
    }
  }

  guardarCambiosFinales(): void {
    const formVal = this.perfilForm.value;
    if (formVal.correo && formVal.telefono) {
        this.usuario.correo = formVal.correo;
        this.usuario.telefono = formVal.telefono;
    }
    this.mensajeExito = 'Tus datos personales han sido guardados correctamente.';
    this.vistaModal = 'exito';
  }

  // === 5. UTILIDADES (UX y Sesión) ===
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

  cerrarSesion() {
    console.log('Cerrando sesión...');
    // Aquí borrarás el Token y redirigirás al Inicio en el futuro
  }
}