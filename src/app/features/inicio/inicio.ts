import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Resena } from '../../models/resena';
import { ResenaService } from '../../services/resena'; // <-- Importamos el servicio

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class InicioComponent implements OnInit {
  
  listaResenas: Resena[] = [];

  formularioResena: Resena = {
    nombreJugador: '',
    calificacion: 5,
    comentario: ''
  };

  estrellasArray = [1, 2, 3, 4, 5];

  // Inyectamos el servicio en el constructor
  constructor(private resenaService: ResenaService) {}

  ngOnInit(): void {
    this.cargarResenas();
  }

  // Llama a Spring Boot por GET
  cargarResenas(): void {
    this.resenaService.listarResenas().subscribe((datos) => {
      this.listaResenas = datos;
    });
  }

  // Llama a Spring Boot por POST
  enviarResena(): void {
    this.resenaService.crearResena(this.formularioResena).subscribe(() => {
      alert('¡Gracias por tu reseña! Ha sido guardada con éxito.');
      this.cargarResenas(); // Recargamos la lista para ver la nueva reseña
      
      // Limpiamos el formulario
      this.formularioResena = { nombreJugador: '', calificacion: 5, comentario: '' };
    });
  }

  seleccionarEstrella(numero: number): void {
    this.formularioResena.calificacion = numero;
  }
}
