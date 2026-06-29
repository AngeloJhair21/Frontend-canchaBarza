import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from '../models/resena';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  // Asegúrate de que este puerto coincida con tu Spring Boot local
  private apiUrl = 'http://localhost:8080/api/resenas';

  constructor(private http: HttpClient) { }

  listarResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.apiUrl);
  }

  crearResena(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.apiUrl, resena);
  }
}