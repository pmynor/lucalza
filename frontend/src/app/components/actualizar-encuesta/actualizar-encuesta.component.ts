import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actualizar-encuesta.component.html',
  styleUrls: ['./actualizar-encuesta.component.css']
})
export class ActualizarEncuestaComponent implements OnInit {
  encuestaId: number = 0;
  titulo: string = '';
  descripcion: string = '';
  preguntas: { texto: string }[] = [];
  mensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.encuestaId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarEncuesta();
  }

  cargarEncuesta() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3000/api/encuestas', { headers }).subscribe(encuestas => {
      const encuesta = encuestas.find(e => e.id === this.encuestaId);
      if (encuesta) {
        this.titulo = encuesta.titulo;
        this.descripcion = encuesta.descripcion;

        this.preguntas = encuesta.preguntas.map((p: any) => {
          if (typeof p === 'string') return { texto: p };
          return { texto: p.texto };
        });
      } else {
        this.mensaje = 'Encuesta no encontrada.';
      }
    });
  }

  agregarPregunta() {
    this.preguntas.push({ texto: '' });
  }

  eliminarPregunta(index: number) {
    this.preguntas.splice(index, 1);
  }

  guardarCambios() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const preguntasValidas = this.preguntas
      .map(p => p.texto.trim())
      .filter(texto => texto !== '');

    if (preguntasValidas.length === 0) {
      this.mensaje = 'Debes tener al menos una pregunta.';
      return;
    }

    this.http.put(`http://localhost:3000/api/encuestas/${this.encuestaId}`, {
      preguntas: preguntasValidas
    }, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Encuesta actualizada correctamente.';
        setTimeout(() => this.router.navigate(['/home/listar']), 1500);
      },
      error: () => {
        this.mensaje = 'Error al actualizar la encuesta.';
      }
    });
  }
}
