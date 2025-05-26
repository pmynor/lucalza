import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-listar-encuestas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './listar-encuesta.component.html',
  styleUrls: ['./listar-encuesta.component.css']
})
export class ListarEncuestaComponent implements OnInit {
  encuestas: any[] = [];
  mensaje = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarEncuestas();
  }

  cargarEncuestas() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3000/api/encuestas', { headers }).subscribe({
      next: data => this.encuestas = data,
      error: () => this.mensaje = 'Error al cargar encuestas.'
    });
  }

  actualizar(id: number) {
    this.router.navigate(['/home/actualizar', id]);
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta encuesta?')) return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete(`http://localhost:3000/api/encuestas/${id}`, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Encuesta eliminada correctamente.';
        this.cargarEncuestas();
      },
      error: () => this.mensaje = 'Error al eliminar encuesta.'
    });
  }
}
