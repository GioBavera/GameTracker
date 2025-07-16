import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Juego } from '../model/juego';
import { stasGenero } from '../model/stasGenero';
import { estadisticasGenerales } from '../model/stasTotal';
import { Grafico } from '../model/graficos';

@Injectable({
  providedIn: 'root'
})

export class Service {

  constructor(private http: HttpClient) {}

  getJuegos(): Observable<Juego[]> {
    return this.http.get<Juego[]>('http://localhost:8080/api/juegos');
  }

  getEstadisticasPorGenero(genero: string): Observable<stasGenero> {
    return this.http.get<stasGenero>(`http://localhost:8080/api/juegos/stats/genero/${genero}`);
  }

  addJuego(juego: any) {
    return this.http.post<Juego>('http://localhost:8080/api/juegos/adicionar', juego);
  }

  deleteJuego(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/juegos/eliminar/${id}`);
  }

  updateJuego(juego: Juego): Observable<Juego> {
    return this.http.put<Juego>(`http://localhost:8080/api/juegos/${juego.id}`, juego);
  }

  getGameStats(): Observable<estadisticasGenerales> {
    return this.http.get<estadisticasGenerales>('http://localhost:8080/api/estadisticas/generales');
  }

  getChartDataPorCampo(campo: string): Observable<Grafico> {
    return this.http.get<Grafico>(`http://localhost:8080/api/graficos/${campo}`);
  }
}