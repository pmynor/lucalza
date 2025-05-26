import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncuestaService } from '../../services/encuesta.service';

@Component({
  selector: 'app-crear-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-encuesta.component.html'
})
export class CrearEncuestaComponent {
  encuesta = {
    titulo: '',
    descripcion: '',
    preguntas: [{ texto: '' }]
  };

  mensaje = '';

  constructor(private encuestaService: EncuestaService) {}

  agregarPregunta() {
    this.encuesta.preguntas.push({ texto: '' });
  }

  eliminarPregunta(index: number) {
    if (this.encuesta.preguntas.length > 1) {
      this.encuesta.preguntas.splice(index, 1);
    }
  }

  crearEncuesta() {
    if (!this.encuesta.titulo || this.encuesta.preguntas.some(p => !p.texto)) {
      this.mensaje = 'Por favor, llena todos los campos.';
      return;
    }

    // 🔁 Convertir preguntas a strings antes de enviarlas
    const payload = {
      titulo: this.encuesta.titulo,
      descripcion: this.encuesta.descripcion,
      preguntas: this.encuesta.preguntas.map(p => p.texto)
    };

    this.encuestaService.crearEncuesta(payload).subscribe({
      next: (res: any) => {
        this.mensaje = 'Encuesta creada exitosamente.';
        this.encuesta = {
          titulo: '',
          descripcion: '',
          preguntas: [{ texto: '' }]
        };
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al crear la encuesta.';
      }
    });
  }
}
