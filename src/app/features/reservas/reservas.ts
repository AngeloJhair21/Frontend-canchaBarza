import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importaciones clave de FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; // Para traducirlo al español

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FullCalendarModule], // <-- IMPORTANTE AGREGAR FullCalendarModule
  templateUrl: './reservas.html', // (o .component.html)
  styleUrls: ['./reservas.scss']  // (o .component.scss)
})
export class ReservasComponent implements OnInit {

  // Opciones estructurales del calendario
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth', // Vista de mes como en tu diseño
    locale: esLocale,            // Pone los días en "LUN, MAR, MIE"
    
    // Configuramos la cabecera (Flechas y Título del mes)
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    
    // Ocultamos los días del mes anterior/siguiente para que se vea más limpio
    showNonCurrentDates: false, 
    
    // 🚧 CONEXIÓN CON EL BACKEND (SPRING BOOT) 🚧
    // Cuando conectemos, esta propiedad 'events' se alimentará de tu base de datos PostgreSQL.
    // Haremos un GET a tu API, y el calendario pintará los cuadros verdes automáticamente.
    events: [], // Por ahora lo dejamos VACÍO, sin datos inyectados.

    // 🚧 ACCIÓN DE RESERVA (SPRING BOOT) 🚧
    // Al hacer clic en un día, se ejecutará esta función para capturar la fecha
    // y eventualmente mandarla a tu formulario de reserva y luego al POST del backend.
    dateClick: this.manejarClicFecha.bind(this)
  };

  constructor() { }

  ngOnInit(): void {
    // 🚧 FUTURA LLAMADA AL BACKEND:
    // this.reservaService.obtenerDisponibilidad().subscribe(datos => {
    //   this.calendarOptions.events = datos;
    // });
  }

  manejarClicFecha(arg: any): void {
    console.log('El usuario tocó la fecha:', arg.dateStr);
    // Aquí luego abriremos un modal o panel para que elija la hora exacta.
  }
}
