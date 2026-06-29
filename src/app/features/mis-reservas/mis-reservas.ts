import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-reservas.html',
  styleUrls: ['./mis-reservas.scss']
})
export class MisReservasComponent implements OnInit {

  filtroActual: string = 'Todas';
  reservasMostradas: any[] = [];
  
  // === ESTADOS DEL MODAL ===
  reservaSeleccionada: any = null; 
  vistaModal: 'DETALLES' | 'PAGO' | 'MENSAJE' = 'DETALLES';
  mensajeNotificacion: string = ''; 

  // === VARIABLES DE CHAT Y EXTRAS ===
  nuevoComentario: string = ''; 
  montoBaseReserva: number = 0;
  montoTotalDinamico: number = 0;
  montoSoloExtras: number = 0; 
  extrasPendiente = { chalecos: false, balon: false, banderines: false };

  // === VARIABLES DE PAGO ===
  metodoPago: 'TARJETA' | 'YAPE' = 'TARJETA';
  datosPago = { banco: '', titular: '', tarjeta: '', caducidad: '', cvv: '', operacionYape: '' };
  idTransaccion = ''; 

  // === DATOS SIMULADOS ===
  reservasMock = [
    {
      id: 1, titulo: 'Cancha A', deporte: 'Fútbol 7', fecha: 'Jueves, 24 Oct', hora: '20:00 - 21:00',
      estado: 'Aprobada', metodoPago: 'Yape', extras: 'Chalecos, Balón', montoBase: 90.00, ref: '#123456789',
      comentarioUsuario: '', respuestaAdmin: 'No hay problema, los esperamos.', estrellasAdmin: 5 
    },
    {
      id: 2, titulo: 'Cancha Central', deporte: 'Vóley', fecha: 'Sábado, 26 Oct', hora: '18:00 - 20:00',
      estado: 'Pendiente', metodoPago: 'Tarjeta', extras: 'Ninguno', montoBase: 120.00, ref: '#BLO-8842',
      comentarioUsuario: '', respuestaAdmin: 'Esperando validación de pago.', estrellasAdmin: 0 
    },
    {
      id: 3, titulo: 'Cancha B', deporte: 'Fútbol 5', fecha: 'Lunes, 14 Oct', hora: '21:00 - 22:00',
      estado: 'Terminada', metodoPago: 'Yape', extras: 'Banderines', montoBase: 65.00, ref: '#YAP-9001',
      comentarioUsuario: '', respuestaAdmin: 'Dejaron basura en la banca, por favor tener cuidado.', estrellasAdmin: 3 
    }
  ];

  ngOnInit() { this.aplicarFiltro('Todas'); }

  aplicarFiltro(filtro: string) {
    this.filtroActual = filtro;
    if (filtro === 'Todas') {
      this.reservasMostradas = [...this.reservasMock];
    } else {
      this.reservasMostradas = this.reservasMock.filter(r => r.estado === filtro.slice(0, -1) || r.estado === filtro); 
    }
  }

  // === LÓGICA DE APERTURA Y NAVEGACIÓN DEL MODAL ===
  abrirDetalles(reserva: any) {
    this.reservaSeleccionada = reserva;
    this.vistaModal = 'DETALLES';
    this.nuevoComentario = reserva.comentarioUsuario || ''; 
    this.montoBaseReserva = reserva.montoBase;
    
    this.extrasPendiente = { chalecos: false, balon: false, banderines: false };
    this.calcularTotalDinamico();
  }

  cerrarDetalles() {
    this.reservaSeleccionada = null;
    this.vistaModal = 'DETALLES';
  }

  mostrarNotificacion(mensaje: string) {
    this.mensajeNotificacion = mensaje;
    this.vistaModal = 'MENSAJE';
  }

  // === LÓGICA DE EXTRAS Y PAGOS ===
  calcularTotalDinamico() {
    let costoExtras = 0;
    if (this.extrasPendiente.chalecos) costoExtras += 5;
    if (this.extrasPendiente.balon) costoExtras += 5;
    if (this.extrasPendiente.banderines) costoExtras += 5;
    
    this.montoSoloExtras = costoExtras; 
    this.montoTotalDinamico = this.montoBaseReserva + costoExtras; 
  }

  guardarComentario() {
    this.reservaSeleccionada.comentarioUsuario = this.nuevoComentario;
    this.mostrarNotificacion('Mensaje guardado y enviado al administrador.');
  }

  cancelarReservaPendiente() {
    this.reservaSeleccionada.estado = 'Cancelada';
    this.mostrarNotificacion('Cancelado exitosamente. De un momento se habilitará para reembolso.');
    this.aplicarFiltro(this.filtroActual); 
  }

  irAPagar() {
    this.idTransaccion = '#BLO-' + Math.floor(1000 + Math.random() * 9000);
    this.vistaModal = 'PAGO';
  }

  confirmarPago() {
    this.reservaSeleccionada.estado = 'Pendiente'; 
    this.reservaSeleccionada.montoBase = this.montoTotalDinamico; 
    
    this.datosPago = { banco: '', titular: '', tarjeta: '', caducidad: '', cvv: '', operacionYape: '' };
    
    this.mostrarNotificacion('¡Pago procesado exitosamente! Los servicios adicionales han sido agregados, esperando verificación del Administrador.');
    this.aplicarFiltro(this.filtroActual);
  }

  obtenerEstrellas(cantidad: number) { return new Array(5).fill(0).map((_, i) => i < cantidad); }

  // === FUNCIONES ESTRICTAS DE FORMULARIO DE PAGO ===
  validarLetras(campo: 'banco' | 'titular', event: any) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.datosPago[campo] = valor;
    input.value = valor; 
  }
  formatearTarjeta(event: any) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').substring(0, 16);
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.datosPago.tarjeta = valor;
    input.value = valor;
  }
  formatearCaducidad(event: any) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').substring(0, 4);
    if (valor.length >= 3) { valor = valor.substring(0, 2) + '/' + valor.substring(2, 4); }
    this.datosPago.caducidad = valor;
    input.value = valor;
  }
  formatearNumeros(campo: 'cvv' | 'operacionYape', maxLength: number, event: any) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').substring(0, maxLength);
    this.datosPago[campo] = valor;
    input.value = valor;
  }
}
