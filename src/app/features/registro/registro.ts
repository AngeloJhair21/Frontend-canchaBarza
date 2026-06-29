import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent {
  
  mostrarPassword = false;
  mostrarConfirmar = false;
  buscandoDni = false; // Para mostrar un spinner cuando conectemos la API

  // Regex para contraseña: 1 Mayus, 1 Simbolo, Min 8 caracteres, Sin espacios
  passwordPattern = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])(?!.*\s).{8,}$/;

  registroForm = new FormGroup({
    // DNI: Solo 8 números
    dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    // Nombres y Apellidos (Se llenarán solos con la API después)
    nombres: new FormControl({ value: '', disabled: false }, [Validators.required]),
    apellidos: new FormControl({ value: '', disabled: false }, [Validators.required]),
    
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.matchValidator });

  constructor(private router: Router) {}

  matchValidator(control: AbstractControl): ValidationErrors | null {
    const p = control.get('password');
    const cp = control.get('confirmPassword');
    return p && cp && p.value !== cp.value ? { noCoincide: true } : null;
  }

  // 🔍 SIMULACIÓN DE BÚSQUEDA RENIEC
  buscarDni(): void {
    const dniValido = this.registroForm.get('dni')?.valid;
    if (dniValido) {
      this.buscandoDni = true;
      console.log('Consultando DNI en el backend...');
      
      // Simulamos que el backend responde en 1.5 segundos
      setTimeout(() => {
        this.registroForm.patchValue({
          nombres: 'ANGELO JHAIR', // Esto vendría de la API
          apellidos: 'LLAGAS'      // Esto vendría de la API
        });
        this.buscandoDni = false;
      }, 1500);
    }
  }

  registrarUsuario(): void {
    if (this.registroForm.valid) {
      console.log('Usuario listo para guardar en DB:', this.registroForm.getRawValue());
      this.router.navigate(['/login']);
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  // Solo permite números en el DNI (Filtro por teclado)
  soloNumeros(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }
  toggleConfirmar() { this.mostrarConfirmar = !this.mostrarConfirmar; }
}