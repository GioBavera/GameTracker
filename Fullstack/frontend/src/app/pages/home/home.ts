import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Service } from '../../services/service';
import { estadisticasGenerales } from '../../model/stasTotal';

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

  constructor(private gameService: Service) {}

  ngOnInit(): void {
    console.log('Home ngOnInit: cargando datos');
    this.gameService.getGameStats().subscribe({
      next: data => {
        console.log('Datos cargados:', data);
        this.stats = data;
        this.statsCargadas = true;
        this.intentarCargarGraficos();
      },
      error: err => console.error('Error al obtener estadísticas generales:', err)
    });
  }

  private cargarDatos(): void {
    this.statsCargadas = false; // Resetear para que ngAfterViewChecked vuelva a intentarlo

    this.gameService.getGameStats().subscribe({
      next: data => {
        this.stats = data;
        this.statsCargadas = true;

        // Esperar que el DOM esté disponible
        setTimeout(() => this.intentarCargarGraficos(), 0);
      },
      error: err => console.error('Error al obtener estadísticas generales:', err)
    });
  }

  ngAfterViewChecked(): void {
    if (!this.statsCargadas) {
      this.cargarDatos(); // Esto ya incluye el setTimeout con los gráficos
    }
  }

  ngAfterViewInit(): void {
    this.intentarCargarGraficos(); // Intentar cargar si ya llegaron los datos
  }

  private intentarCargarGraficos(): void {
    if (!this.statsCargadas) {
      console.log('Intentar cargar gráficos: stats no cargadas aún');
      return;
    }

    setTimeout(() => {
      this.cargarGraficoPie('plataforma', 'grafico1', ['#FF6B6B', '#FF8E72', '#FFA987', '#FFC19E', '#FFDAB5', '#FFEFD4', '#FFF9EB']);
      this.cargarGraficoAreaPolar('puntaje', 'grafico2', ['#1B3B6F', '#2E56A6', '#4A90E2', '#7AB9F9', '#A9D5FF', '#D4EBFF', '#EAF7FF']);
      this.cargarGraficoBarras('anno', 'grafico3', ['#FF6B6B', '#FF8E72', '#FFA987', '#FFC19E', '#FFDAB5', '#FFEFD4', '#FFF9EB']);
      this.cargarGraficoBarras('genero', 'grafico4', ['#1B3B6F', '#2E56A6', '#4A90E2', '#7AB9F9', '#A9D5FF', '#D4EBFF', '#EAF7FF'])
    }, 0);
  } 

//--------------- Funciones para cargar graficos 
  cargarGraficoBarras(campo: string, canvasId: string, colores: string[]): void {
    this.gameService.getChartDataPorCampo(campo).subscribe(chartData => {
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

  cargarGraficoAreaPolar(campo: string, canvasId: string, colores: string[]): void {
  this.gameService.getChartDataPorCampo(campo).subscribe(chartData => {
    if (typeof document === 'undefined') return;
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    this.charts[canvasId] = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: chartData.labels,
        datasets: [{
          data: chartData.data,
          backgroundColor: colores
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          r: {
            min: 0
          }
        }
      }
    });
  });
}

  cargarGraficoPie(campo: string, canvasId: string, colores: string[]): void {
  this.gameService.getChartDataPorCampo(campo).subscribe(chartData => {
    if (typeof document === 'undefined') return;
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    this.charts[canvasId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData.labels,
        datasets: [{
          data: chartData.data,
          backgroundColor: colores,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 10
            }
          }
        }
      }
    });
  });
}

  ngOnDestroy(): void {
  Object.values(this.charts).forEach(chart => chart.destroy());
  this.statsCargadas = false;
}

}