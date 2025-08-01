import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Service } from '../../services/service';
import { estadisticasGenerales } from '../../model/stasTotal';
import { AuthService } from '../../services/auth';

Chart.register(...registerables);

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {

  stats: estadisticasGenerales = {
    totalJuegos: 0,
    completadosJuegos: 0,
    horas: 0,
    puntajePromedio: '',
    plataformaPopular: '',
    annoActivo: 0,
    porcentajeTerminado: 0,
    promedioHoras: 0
  };

  private charts: { [id: string]: Chart } = {};
  statsCargadas = false;
  username: string | null = null;

  constructor(private gameService: Service, private cdRef: ChangeDetectorRef, private authService : AuthService) {}

  ngOnInit(): void {
    this.gameService.getEstadisticas().subscribe({
      next: data => {
        this.username = this.authService.getUsername();
        this.stats = data;
        this.statsCargadas = true;
        this.cdRef.detectChanges();
        this.intentarCargarGraficos();
      },
      error: err => console.error('Error al obtener estadisticas generales:', err)
    });
  }

  ngAfterViewInit(): void {
    this.intentarCargarGraficos(); // Solo se llama una vez
  }

  private intentarCargarGraficos(): void {
    if (!this.statsCargadas) return;

    setTimeout(() => {
      this.renderChart('plataforma', 'grafico1', 'pie', this.coloresRojos());
      this.renderChart('puntaje', 'grafico2', 'polarArea', this.coloresAzules());
      this.renderChart('anno', 'grafico3', 'bar', this.coloresRojos());
      this.renderChart('genero', 'grafico4', 'bar', this.coloresAzules());
    });
  }

  private renderChart(campo: string, canvasId: string, tipo: 'bar' | 'pie' | 'polarArea', colores: string[]): void {
    this.gameService.getGrafico(campo).subscribe(chartData => {
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!ctx) return;

      this.charts[canvasId]?.destroy();

      const config: any = {
        type: tipo,
        data: {
          labels: chartData.labels,
          datasets: [{
            data: chartData.data,
            backgroundColor: colores,
            ...(tipo === 'bar' && { borderRadius: 10 }),
            ...(tipo === 'pie' && { borderWidth: 0, borderColor: '#fff' })
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: tipo !== 'bar',
              ...(tipo === 'pie' && {
                position: 'right',
                labels: { boxWidth: 12, padding: 10 }
              })
            }
          },
          ...(tipo === 'bar' && {
            scales: {
              x: { display: true },
              y: { display: true, beginAtZero: true }
            }
          }),
          ...(tipo === 'polarArea' && {
            scales: {
              r: { min: 0 }
            }
          })
        }
      };

      this.charts[canvasId] = new Chart(ctx, config);
    });
  }

  private coloresRojos(): string[] {
    return ['#FF6B6B', '#FF8E72', '#FFA987', '#FFC19E', '#FFDAB5', '#FFEFD4', '#FFF9EB'];
  }

  private coloresAzules(): string[] {
    return ['#1B3B6F', '#2E56A6', '#4A90E2', '#7AB9F9', '#A9D5FF', '#D4EBFF', '#EAF7FF'];
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.statsCargadas = false;
  }
}
