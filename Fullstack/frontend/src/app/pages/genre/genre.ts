import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../services/service';
import { Juego } from '../../model/juego';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'genre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genre.html',
  styleUrls: ['./genre.scss']
})

export class Genre implements OnInit {
  
  private allGames: Juego[] = [];
  availableGenres: string[] = [];
  availablePlatforms: string[] = [];
  selectedGenre: string = '';
  genreGames: Juego[] = [];
  showAddForm: boolean = false;
  private charts: { [id: string]: Chart } = {};
  statsCargadas = false;

  genreStats = {
    totalJuegos: 0,
    juegosCompletados: 0,
    horasTotales: 0,
    puntajePromedio: '',
    plataformaPopular: '',
    annoMasActivo: 0,
    porcentajeCompletado: 0,
    promedioHorasPorJuego: 0
  };

  constructor(private gameService: Service, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.gameService.getJuegos().subscribe({
      next: juegos => {
        this.allGames = juegos;
        this.availableGenres = [...new Set(juegos.map(j => (j as any).genero || 'Desconocido'))];
        this.availablePlatforms = [...new Set(juegos.map(j => j.plataforma))];

        if (this.availableGenres.length > 0) {
          this.selectedGenre = this.availableGenres[0];
          this.onGenreSelect(this.selectedGenre);
        }
      },
      error: err => console.error('Error al obtener juegos:', err)
    });
  }

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.loadGenreData(this.allGames).then(() => {
      this.cargarGraficoBarras('anno', 'grafico1', ['#FF6B6B', '#FF8E72', '#FFA987', '#FFC19E', '#FFDAB5', '#FFEFD4', '#FFF9EB']);
      this.cargarGraficoBarras('plataforma', 'grafico2', ['#1B3B6F', '#2E56A6', '#4A90E2', '#7AB9F9', '#A9D5FF', '#D4EBFF', '#EAF7FF']);
    }).catch(err => {
      console.error('Error al cargar datos del género:', err);
    });
  }

  loadGenreData(juegos: Juego[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.genreGames = juegos.filter(j => (j as any).genero === this.selectedGenre);
      this.cdr.detectChanges();
      this.gameService.getEstadisticasPorGenero(this.selectedGenre).subscribe({
        next: stats => {
          this.genreStats = stats;
          this.cdr.detectChanges();
          resolve();
        },
        error: err => {
          console.error('Error al obtener estadisticas:', err);
          reject(err);
        }
      });
    });
  }

  //--------------- Funciones para cargar graficos 
  cargarGraficoBarras(campo: string, canvasId: string, colores: string[]): void {
    this.gameService.getGraficoPorGenero(campo, this.selectedGenre).subscribe(chartData => {
      if (typeof document === 'undefined') return;
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!ctx) return;

      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
      }

      this.charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [{
            data: chartData.data,
            backgroundColor: colores,
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: { display: true },
            y: { display: true, beginAtZero: true }
          }
        }
      });
    });
  }
  
}
