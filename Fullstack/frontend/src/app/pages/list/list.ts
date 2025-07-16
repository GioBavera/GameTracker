import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../services/service';
import { Juego } from '../../model/juego';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})

export class List implements OnInit {
  games: Juego[] = [];
  filteredGames: Juego[] = [];
  searchTerm: string = '';
  selectedPlatform: string = 'Todas las plataformas';
  selectedGenre: string = 'Todos los géneros';
  selectedStatus: string = 'Todos los estados';
  viewMode: 'grid' | 'table' = 'grid';
  editingGame: Juego | null = null;

  puntajesValidos = ['S', 'A+', 'A', 'B', 'C'];
  plataformasValidas = ['PS1', 'PS2', 'PS3', 'PS4', 'PC', 'X360', 'MOBILE', 'ARC', 'CLOUD'];
  generosValidos = ['FPS', 'TPS', 'Metroidvania', 'JRPS', 'Estrategia', 'Deportivos', 'Inmersive Sims', 'Sandbox', 'Horror', 'Simulacion', 'Cooperativo', 'Otros'];
  showAddForm: boolean = false;
  
  newGame = {
    nombre: '',
    plataforma: '',
    anno: new Date().getFullYear(),
    puntaje: '',
    completado: 'No',
    horas: '',
    genero: ''
  };
  
  platforms: string[] = [];
  genres: string[] = [];

  constructor(private gameService: Service, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getJuegos().subscribe({
      next: (data) => {
        this.games = data;
        this.filteredGames = [...this.games];

        this.platforms = ['Todas las plataformas', ...this.getUniqueValues('plataforma')];
        this.genres = ['Todos los géneros', ...this.getUniqueValues('genero')];

        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al cargar juegos desde el backend:', err);
      }
    });
  }

//------------------- Logica de filtros 
  loadFilterOptions(): void {
    this.platforms = ['Todas las plataformas', ...this.getUniqueValues('plataforma')];
    this.genres = ['Todos los géneros', ...this.getUniqueValues('genero')];
  }

  getUniqueValues(key: keyof Juego): string[] {
    const set = new Set<string>();
    for (const game of this.games) {
      const value = game[key];
      if (value !== undefined && value !== null) {
        set.add(String(value));
      }
    }
    return Array.from(set);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredGames = this.games.filter(game => {
      const matchesSearch = game.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPlatform = this.selectedPlatform === 'Todas las plataformas' || game.plataforma === this.selectedPlatform;
      const matchesGenre = this.selectedGenre === 'Todos los géneros' || game.genero === this.selectedGenre;
      const matchesStatus = this.selectedStatus === 'Todos los estados' ||
        (this.selectedStatus === 'Completado' && game.completado.toLowerCase() === 'si') ||
        (this.selectedStatus === 'No completado' && game.completado.toLowerCase() !== 'si');

      return matchesSearch && matchesPlatform && matchesGenre && matchesStatus;
    });

    this.cdr.detectChanges(); // Actualiza la vista obligatoriamente
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPlatform = 'Todas las plataformas';
    this.selectedGenre = 'Todos los géneros';
    this.selectedStatus = 'Todos los estados';
    this.filteredGames = [...this.games];
  }

//------------------- Vista
  toggleViewMode(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.newGame.genero = this.selectedGenre;
    }
  }

//------------------- CRUD
  onSubmitGame(): void {
    if (!this.isValidGame()) return;

    const juegoActualizado = {
      id: this.editingGame!.id, 
      nombre: String(this.newGame.nombre).trim(),
      plataforma: String(this.newGame.plataforma).trim(),
      anno: Number(this.newGame.anno),
      puntaje: String(this.newGame.puntaje).trim(),
      completado: this.newGame.completado ? 'SI' : 'NO',
      horas: Number(this.newGame.horas),
      genero: this.newGame.genero
    };

    // Modo Edicion 
    if (this.editingGame) {
      this.gameService.updateJuego(juegoActualizado).subscribe({
        next: updated => {
          // Reemplazar en el array original
          const index = this.games.findIndex(g => g.id === updated.id);
          if (index !== -1) this.games[index] = updated;

          this.applyFilters();
          this.resetForm();
          this.showAddForm = false;
          this.editingGame = null;
        },
        error: err => console.error('Error al editar juego:', err)
      });
    } else {    // Modo Agregar
      this.gameService.addJuego(juegoActualizado).subscribe({
        next: added => {
          this.games.push(added);
          this.applyFilters();
          this.resetForm();
          this.showAddForm = false;
        },
        error: err => console.error('Error al agregar juego:', err)
      });
    }
  }

  isValidGame(): boolean {
    return this.newGame.nombre.trim() !== '' &&
          this.plataformasValidas.includes(this.newGame.plataforma) &&
          +this.newGame.anno > 1970 &&
          this.puntajesValidos.includes(this.newGame.puntaje) &&
          this.generosValidos.includes(this.newGame.genero) &&
          !isNaN(+this.newGame.horas) &&
          +this.newGame.horas >= 0;
  }

  resetForm(): void {
    this.newGame = {
      nombre: '',
      plataforma: '',
      anno: new Date().getFullYear(),
      puntaje: '',
      completado: 'NO',
      horas: '',
      genero: ''
    };
    this.editingGame = null;
  }

  cancelAdd(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  onEditGame(game: Juego): void {
    this.editingGame = { ...game }; 
    this.showAddForm = true;

    this.newGame = {
      nombre: game.nombre,
      plataforma: game.plataforma,
      anno: game.anno,
      puntaje: game.puntaje,
      completado: game.completado.toLowerCase() === 'si' ? 'SI' : 'NO',
      horas: String(game.horas),
      genero: game.genero
    };
  }

  onDeleteGame(game: Juego): void {
    if (!confirm(`Estas seguro de que queres borrar "${game.nombre}"?`)) return;
    
    this.gameService.deleteJuego(game.id).subscribe({
      next: () => {
        this.games = this.games.filter(g => g.id !== game.id);
        this.loadFilterOptions();
        this.applyFilters();
        this.cdr.detectChanges(); // --- Revisar, no funciona
      },
      error: err => console.error('Error al borrar juego:', err)
    });
  }

}
