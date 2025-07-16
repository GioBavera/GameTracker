import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../services/service';
import { Juego } from '../../model/juego';

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

  constructor(private service: Service, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.service.getJuegos().subscribe({
      next: juegos => {
        this.allGames = juegos;

        this.availableGenres = [...new Set(juegos.map(j => (j as any).genero || 'Desconocido'))];
        this.availablePlatforms = [...new Set(juegos.map(j => j.plataforma))];

        if (this.availableGenres.length > 0) {
          this.selectedGenre = this.availableGenres[0];
          this.loadGenreData(this.allGames);
        }
      },
      error: err => console.error('Error al obtener juegos:', err)
    });
  } 

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.loadGenreData(this.allGames);
  }

  loadGenreData(juegos: Juego[]): void {
    this.genreGames = juegos.filter(j => (j as any).genero === this.selectedGenre);
    this.cdr.detectChanges();

    this.service.getEstadisticasPorGenero(this.selectedGenre).subscribe({
      next: stats => {
        this.genreStats = stats;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error al obtener estadisticas:', err)
    });
  }
}