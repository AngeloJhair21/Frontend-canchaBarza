import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importamos la magia de los Formularios Reactivos
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  // 2. Agregamos ReactiveFormsModule a los imports del componente
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.scss']
})
export class NosotrosComponent implements AfterViewInit, OnInit {
  
  // Coordenadas del mapa
  private latitudCancha = -11.9526418;
  private longitudCancha = -77.0723681;
  private map!: L.Map;

  // 3. Declaramos nuestro formulario
  incidenciasForm!: FormGroup;

  ngOnInit(): void {
    // 4. Construimos el formulario con sus reglas estrictas
    this.incidenciasForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      // ¡Aquí está la validación nativa de correo!
      correo: new FormControl('', [Validators.required, Validators.email]),
      tipo: new FormControl('', [Validators.required]),
      cancha: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  ngAfterViewInit(): void {
    this.iniciarMapa();
  }

  private iniciarMapa(): void {
    this.map = L.map('mapa-nosotros', { zoomControl: false }).setView([this.latitudCancha, this.longitudCancha], 16);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap & CartoDB'
    }).addTo(this.map);

    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    L.marker([this.latitudCancha, this.longitudCancha], { icon: iconDefault })
     .addTo(this.map)
     .bindPopup('<b>Barsa Los Olivos</b><br>San Fernando 198<br>¡Te esperamos!')
     .openPopup();
  }

  abrirRutaGps(): void {
    const urlOficial = `https://www.google.com/maps/dir/?api=1&destination=${this.latitudCancha},${this.longitudCancha}`;
    window.open(urlOficial, '_blank');
  }

  // 🚧 CONEXIÓN AL BACKEND 🚧
  enviarReporte(): void {
    if (this.incidenciasForm.valid) {
      console.log('Datos limpios y listos para Spring Boot:', this.incidenciasForm.value);
      // Aquí irá tu: this.http.post('tu-api/incidencias', this.incidenciasForm.value).subscribe(...)
      
      // Limpiamos el formulario después de enviar
      this.incidenciasForm.reset();
      alert('¡Reporte enviado correctamente!'); // Temporal hasta que hagamos un modal bonito
    } else {
      // Si el usuario intentó enviar el formulario vacío o con un correo falso, marcamos todo en rojo
      this.incidenciasForm.markAllAsTouched();
    }
  }
}