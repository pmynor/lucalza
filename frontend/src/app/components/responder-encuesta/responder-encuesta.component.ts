import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-responder-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './responder-encuesta.component.html',
  styleUrls: ['./responder-encuesta.component.css']
})
export class ResponderEncuestaComponent implements OnInit {
  personas: any[] = [];
  encuestas: any[] = [];

  personaId: number = 0;
  encuestaId: number = 0;
  respuestas: { preguntaId: number, texto: string, valor: number }[] = [];

  mensaje = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3000/api/personas', { headers }).subscribe(data => {
      this.personas = data;
    });

    this.http.get<any[]>('http://localhost:3000/api/encuestas', { headers }).subscribe(data => {
      this.encuestas = data;
    });
  }

  cargarPreguntas() {
    const encuesta = this.encuestas.find(e => e.id === +this.encuestaId);
    this.respuestas = (encuesta?.preguntas || []).map((p: any) => ({
      preguntaId: p.id,
      texto: p.texto,
      valor: 5
    }));
  }

  enviarRespuestas() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const payload = this.respuestas.map(r => ({
      personaId: this.personaId,
      encuestaId: this.encuestaId,
      preguntaId: r.preguntaId,
      valor: r.valor
    }));

    this.http.post('http://localhost:3000/api/respuestas', payload, { headers }).subscribe({
      next: () => this.mensaje = 'Respuestas enviadas correctamente.',
      error: () => this.mensaje = 'Error al enviar respuestas.'
    });
  }
}
