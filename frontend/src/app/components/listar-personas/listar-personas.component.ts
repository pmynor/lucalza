import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar-personas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './listar-personas.component.html',
  styleUrls: ['./listar-personas.component.css']
})
export class ListarPersonasComponent implements OnInit {
  encuestas: any[] = [];
  mensaje = '';
  isBrowser = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/api/personas', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: async (data) => {
        this.encuestas = data;

        if (this.isBrowser) {
          setTimeout(() => this.inicializarMapas(), 0); // Esperar render
        }
      },
      error: () => this.mensaje = 'Error al cargar personas.'
    });
  }
  
  getMapId(e: any): string {
    if (e.id) return `map-${e.id}`;
    return `map-${(e.nombre || '').toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  async inicializarMapas() {
    const L = await import('leaflet'); // ✅ Import dinámico protegido

    this.encuestas.forEach((e: any) => {
      if (!e.latitud || !e.longitud) return;

      const id = `map-${e.id || e.nombre.replace(/\s+/g, '-')}`;
      const map = L.map(id).setView([e.latitud, e.longitud], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([e.latitud, e.longitud]).addTo(map)
        .bindPopup(e.nombre)
        .openPopup();
    });
  }
}
