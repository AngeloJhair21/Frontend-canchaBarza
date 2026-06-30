import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-soporte',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './chat-soporte.html',
  styleUrls: ['./chat-soporte.scss']
})
export class ChatSoporteComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollChat') private scrollContainer!: ElementRef;

  nuevoMensaje: string = '';
  estaEscribiendo: boolean = false;

  preguntasRapidas = [
    '¿Cómo reservo una cancha?',
    'Precios de Fútbol 7',
    'Problemas con mi pago',
    'Horarios disponibles hoy'
  ];

  mensajes: any[] = [
    {
      emisor: 'bot',
      texto: '¡Hola! Soy el asistente virtual de Barsa Los Olivos. ¿En qué te puedo ayudar hoy con tus reservas deportivas?',
      hora: '14:30',
      tipo: 'texto'
    },
    {
      emisor: 'usuario',
      texto: 'Hola, quiero saber cuáles son los horarios disponibles para Fútbol 7 esta noche.',
      hora: '14:31',
      tipo: 'texto'
    },
    {
      emisor: 'bot',
      texto: 'Para hoy, tenemos las siguientes canchas de Fútbol 7 disponibles en nuestro complejo principal:',
      hora: '14:31',
      tipo: 'canchas',
      opciones: [
        { nombre: 'Cancha 2 (Sintético)', horario: '20:00 - 21:00' },
        { nombre: 'Cancha 4 (Sintético)', horario: '22:00 - 23:00' }
      ],
      textoFooter: '¿Te gustaría proceder con alguna de estas opciones?'
    }
  ];

  ngOnInit() {}

  ngAfterViewChecked() {
    this.hacerScrollAbajo();
  }

  hacerScrollAbajo() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  enviarMensajeRapido(pregunta: string) {
    this.nuevoMensaje = pregunta;
    this.enviarMensaje();
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Agregamos el mensaje del usuario
    this.mensajes.push({
      emisor: 'usuario',
      texto: this.nuevoMensaje,
      hora: horaActual,
      tipo: 'texto'
    });

    this.nuevoMensaje = '';
    this.estaEscribiendo = true;

    // Simulamos la espera de la IA (Backend)
    setTimeout(() => {
      this.estaEscribiendo = false;
      this.mensajes.push({
        emisor: 'bot',
        texto: 'Por el momento soy un modelo de prueba en el frontend. Próximamente me conectarán al Backend con IA para ayudarte con tus reservas.',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tipo: 'texto'
      });
    }, 1500);
  }
}