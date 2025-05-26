import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-crear-persona',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './crear-persona.component.html',
  styleUrls: ['./crear-persona.component.css']
})
export class CrearPersonaComponent implements OnInit {
  persona = {
    nombre: '',
    direccion: '',
    telefono: '',
    nacionalidad: '',
    latitud: 0,
    longitud: 0
  };

  mensaje: string = '';
  private mapInstance: any;
  private markerInstance: any;

  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit(): Promise<void> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.persona.latitud = position.coords.latitude;
          this.persona.longitud = position.coords.longitude;
          await this.initMap();
        },
        async (error) => {
          this.mensaje = 'No se pudo obtener la ubicación.';
          await this.initMap(); 
        }
      );
    } else {
      this.mensaje = 'Geolocalización no soportada por el navegador.';
      await this.initMap();
    }
  }

  async initMap() {
    const L = await import('leaflet');

    if (this.mapInstance) {
      this.mapInstance.remove();
    }

    const lat = this.persona.latitud;
    const lng = this.persona.longitud;

    this.mapInstance = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapInstance);

    this.markerInstance = L.marker([lat, lng], { draggable: true }).addTo(this.mapInstance);
    this.markerInstance.bindPopup('Ubicación actual').openPopup();
    this.markerInstance.on('moveend', (e: any) => {
      const coords = e.target.getLatLng();
      this.persona.latitud = coords.lat;
      this.persona.longitud = coords.lng;
    });

    this.mapInstance.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.persona.latitud = lat;
      this.persona.longitud = lng;
      this.markerInstance.setLatLng([lat, lng]);
    });
  }

  crearPersona() {
    const token = localStorage.getItem('token');

    this.http.post<any>('http://localhost:3000/api/personas', this.persona, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: async res => {
        this.mensaje = 'persona creada exitosamente.';

        // Limpia solo los campos de texto, mantiene ubicación
        this.persona.nombre = '';
        this.persona.direccion = '';
        this.persona.telefono = '';
        this.persona.nacionalidad = '';

        await this.initMap(); // actualiza el mapa
      },
      error: err => {
        if (err.error && err.error.message) {
          this.mensaje = err.error.message;
        } else {
          this.mensaje = 'Error al crear la persona.';
        }
      }
      
    });
  }
}
