import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil-reservas.html',
  styleUrls: ['./perfil-reservas.scss']
})
export class PerfilReservasComponent implements OnInit, OnDestroy {

  deporte: string = 'FUTBOL';
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  duracion: number = 60;
  extras = { chalecos: false, balon: false, banderines: false };
  precioTotal: number = 0;

  duracionesDisponibles = [
    { label: '1 Hora', valor: 60 },
    { label: '1 Hora y media', valor: 90 },
    { label: '2 Horas', valor: 120 },
    { label: '2 Horas y media', valor: 150 },
    { label: '3 Horas', valor: 180 }
  ];

  horasDisponibles: string[] = [];
  horasReservadasMock: string[] = ['16:00', '18:30', '20:15'];

  // === LÓGICA DEL CALENDARIO CUSTOM ===
  mesActual = new Date();
  diasCalendario: any[] = [];
  diasSemana = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  // === LÓGICA DE LA RULETA INTERACTIVA ===
  horasRuleta = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutosRuleta = ['00', '15', '30', '45'];
  periodosRuleta = ['AM', 'PM'];

  hIdx = 7; // Índice 08
  mIdx = 2; // Índice 30
  pIdx = 1; // Índice PM

  get horasVisibles() { return [this.horasRuleta[(this.hIdx - 1 + 12) % 12], this.horasRuleta[this.hIdx], this.horasRuleta[(this.hIdx + 1) % 12]]; }
  get minutosVisibles() { return [this.minutosRuleta[(this.mIdx - 1 + 4) % 4], this.minutosRuleta[this.mIdx], this.minutosRuleta[(this.mIdx + 1) % 4]]; }
  get periodosVisibles() { return this.pIdx === 0 ? ['\u00A0', 'AM', 'PM'] : ['AM', 'PM', '\u00A0']; }


  // === VARIABLES DE PAGO ===
  metodoPago: 'TARJETA' | 'YAPE' = 'TARJETA';
  idTransaccion = '';

  // === MODELO DEL FORMULARIO ===
  datosPago = {
    banco: '',
    titular: '',
    tarjeta: '',
    caducidad: '',
    cvv: '',
    operacionYape: ''
  };

  // === VARIABLES DE TIMER Y MODAL ===
  reservaEnProceso = false;
  tiempoRestante = 300;
  minutosMostrados = '05';
  segundosMostrados = '00';
  intervaloTimer: any;

  mostrarModalMensaje = false;
  tituloModal = ''; textoModal = ''; iconoModal = ''; colorIcono = '';

  ngOnInit() {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    this.fechaSeleccionada = (new Date(hoy.getTime() - offset)).toISOString().split('T')[0];

    this.generarCalendario();
    this.generarHorarios();
    this.calcularTotal();
  }

  ngOnDestroy() { this.limpiarTimer(); }

  // === FUNCIONES DE FORMATEO ESTRICTO ===

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
    if (valor.length >= 3) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    this.datosPago.caducidad = valor;
    input.value = valor;
  }

  formatearNumeros(campo: 'cvv' | 'operacionYape', maxLength: number, event: any) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').substring(0, maxLength);
    this.datosPago[campo] = valor;
    input.value = valor;
  }

  // === FUNCIONES DEL CALENDARIO CUSTOM ===
  nombreMesActual(): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${meses[this.mesActual.getMonth()]} de ${this.mesActual.getFullYear()}`;
  }

  cambiarMes(offset: number) {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + offset, 1);
    this.generarCalendario();
  }

  generarCalendario() {
    this.diasCalendario = [];
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    let indicePrimerDia = primerDia.getDay() - 1;
    if (indicePrimerDia === -1) indicePrimerDia = 6;

    for (let i = 0; i < indicePrimerDia; i++) {
      this.diasCalendario.push({ valor: '', inactivo: true });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const fechaIteracion = new Date(año, mes, i);
      const fechaCeros = new Date(fechaIteracion).setHours(0, 0, 0, 0);
      const esPasado = fechaCeros < hoy.getTime();

      this.diasCalendario.push({ valor: i, inactivo: esPasado, fechaCompleta: fechaIteracion });
    }
  }

  seleccionarDiaCalendario(dia: any) {
    if (dia.inactivo || !dia.valor) return;

    const fechaAjustada = new Date(dia.fechaCompleta.getTime() - (dia.fechaCompleta.getTimezoneOffset() * 60000));
    this.fechaSeleccionada = fechaAjustada.toISOString().split('T')[0];
    this.alCambiarFecha();
  }

  esDiaSeleccionado(dia: any): boolean {
    if (!dia.valor || !this.fechaSeleccionada) return false;
    const fechaAjustada = new Date(dia.fechaCompleta.getTime() - (dia.fechaCompleta.getTimezoneOffset() * 60000));
    return fechaAjustada.toISOString().split('T')[0] === this.fechaSeleccionada;
  }

  // === EVENTOS DE LA RULETA ===
  moverHora(dir: number) { this.hIdx = (this.hIdx + dir + 12) % 12; }
  moverMinuto(dir: number) { this.mIdx = (this.mIdx + dir + 4) % 4; }
  setPeriodo(idx: number) { this.pIdx = idx; }

  verificarRuleta() {
    let h = parseInt(this.horasRuleta[this.hIdx]);
    if (this.pIdx === 1 && h !== 12) h += 12;
    if (this.pIdx === 0 && h === 12) h = 0;

    const horaMilitar = `${h.toString().padStart(2, '0')}:${this.minutosRuleta[this.mIdx]}`;

    if (this.horasDisponibles.includes(horaMilitar)) {
      this.horaSeleccionada = horaMilitar;
      this.calcularTotal();
      this.mostrarAlerta('Horario Confirmado', `Has bloqueado las ${this.horasVisibles[1]}:${this.minutosVisibles[1]} ${this.periodosRuleta[this.pIdx]}.`, true);
    } else {
      this.mostrarAlerta('Horario No Disponible', 'El horario seleccionado ya está ocupado o ya pasó.', false);
    }
  }

  // === RESTO DE FUNCIONES ===
  mostrarAlerta(titulo: string, texto: string, esExito: boolean) {
    this.tituloModal = titulo; this.textoModal = texto;
    this.iconoModal = esExito ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
    this.colorIcono = esExito ? 'texto-neon' : 'text-danger';
    this.mostrarModalMensaje = true;
  }
  cerrarAlerta() { this.mostrarModalMensaje = false; }

  generarHorarios() {
    this.horasDisponibles = [];
    const ahora = new Date(); ahora.setMinutes(ahora.getMinutes() + 30);
    const fechaElegida = new Date(this.fechaSeleccionada + 'T00:00:00');
    const esHoy = fechaElegida.toDateString() === new Date().toDateString();

    for (let h = 8; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        let horaValida = true;
        if (esHoy) {
          const horaIteracion = new Date(this.fechaSeleccionada + 'T' + horaStr + ':00');
          if (horaIteracion < ahora) horaValida = false;
        }
        if (this.horasReservadasMock.includes(horaStr)) horaValida = false;
        if (horaValida) this.horasDisponibles.push(horaStr);
      }
    }
    if (!this.horasDisponibles.includes(this.horaSeleccionada)) this.horaSeleccionada = '';
    this.calcularTotal();
  }

  alCambiarFecha() { this.generarHorarios(); }

  calcularTotal() {
    const costoBase = (this.duracion / 30) * 30;
    const costoExtras = (this.extras.chalecos ? 5 : 0) + (this.extras.balon ? 5 : 0) + (this.extras.banderines ? 5 : 0);
    this.precioTotal = costoBase + costoExtras;
  }

  iniciarReserva() {
    if (!this.fechaSeleccionada || !this.horaSeleccionada) {
      this.mostrarAlerta('Campos Incompletos', 'Por favor selecciona una fecha y horario válidos (Usa el botón Verificar).', false);
      return;
    }
    this.reservaEnProceso = true;
    this.tiempoRestante = 300;

    // Generamos un ID de transacción aleatorio (Ej: #BLO-4921)
    this.idTransaccion = '#BLO-' + Math.floor(1000 + Math.random() * 9000);

    this.actualizarTextosTimer();
    this.intervaloTimer = setInterval(() => {
      this.tiempoRestante--; this.actualizarTextosTimer();
      if (this.tiempoRestante <= 0) this.cancelarReserva(true);
    }, 1000);
  }

  actualizarTextosTimer() {
    const m = Math.floor(this.tiempoRestante / 60); const s = this.tiempoRestante % 60;
    this.minutosMostrados = m.toString().padStart(2, '0'); this.segundosMostrados = s.toString().padStart(2, '0');
  }

  cancelarReserva(porExpiracion = false) {
    this.limpiarTimer(); this.reservaEnProceso = false;
    if (porExpiracion) {
      this.mostrarAlerta('Límite de Tiempo Agotado', 'El tiempo para completar la reserva ha expirado. El horario ha sido liberado.', false);
      this.generarHorarios();
    }
  }

  limpiarTimer() { if (this.intervaloTimer) clearInterval(this.intervaloTimer); }

  pagar() {
    this.mostrarAlerta('¡Reserva Confirmada!', 'Tu pago ha sido procesado correctamente y la cancha está separada.', true);
    this.limpiarTimer(); this.reservaEnProceso = false;
  }
}