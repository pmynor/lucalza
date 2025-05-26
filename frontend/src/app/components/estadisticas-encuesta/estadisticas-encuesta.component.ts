import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

interface Resultado {
  encuesta_id: number;
  encuesta: string;
  pregunta_id: number;
  pregunta: string;
  valor: string;
  cantidad_respuestas: number;
}

@Component({
  selector: 'app-estadisticas-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-encuesta.component.html'
})
export class EstadisticasEncuestaComponent implements OnInit, AfterViewInit {
  resultados: Resultado[] = [];
  agrupado: { [pregunta: string]: { labels: number[], data: number[] } } = {};
  renderizado = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  get preguntas(): string[] {
    return Object.keys(this.agrupado);
  }

  ngOnInit(): void {
    const encuestaId = this.route.snapshot.paramMap.get('id');

    this.http.get<Resultado[]>(`http://localhost:3000/api/encuestas/${encuestaId}/estadisticas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe(data => {
      this.resultados = data;
      this.agrupado = this.groupByPregunta(data);
      this.renderizado = true;
    });
  }

  ngAfterViewInit(): void {
    const interval = setInterval(() => {
      if (this.renderizado && this.preguntas.length > 0) {
        for (const pregunta of this.preguntas) {
          const id = this.canvasId(pregunta);
          const canvas = document.getElementById(id) as HTMLCanvasElement;

          if (canvas) {
            new Chart(canvas, {
              type: 'pie',
              data: {
                labels: this.agrupado[pregunta].labels.map(String),
                datasets: [{
                  label: 'Votos',
                  data: this.agrupado[pregunta].data,
                  backgroundColor: this.generarColores(this.agrupado[pregunta].data.length)
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }
            });
          }
        }

        clearInterval(interval);
      }
    }, 500);
  }

  canvasId(pregunta: string): string {
    return 'canvas_' + pregunta.replace(/\s+/g, '_').replace(/[^\w]/g, '');
  }

  groupByPregunta(data: Resultado[]): { [pregunta: string]: { labels: number[], data: number[] } } {
    const agrupado: { [pregunta: string]: { [valor: number]: number } } = {};

    for (const item of data) {
      if (!agrupado[item.pregunta]) {
        agrupado[item.pregunta] = {};
      }
      const valorNum = Number(item.valor);
      if (!agrupado[item.pregunta][valorNum]) {
        agrupado[item.pregunta][valorNum] = 0;
      }
      agrupado[item.pregunta][valorNum] += item.cantidad_respuestas;
    }

    const final: { [pregunta: string]: { labels: number[], data: number[] } } = {};
    for (const pregunta in agrupado) {
      const valores = Object.keys(agrupado[pregunta]).map(Number).sort();
      final[pregunta] = {
        labels: valores,
        data: valores.map(v => agrupado[pregunta][v])
      };
    }

    return final;
  }

  generarColores(cantidad: number): string[] {
    const colores: string[] = [];
    for (let i = 0; i < cantidad; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colores.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colores;
  }
}
