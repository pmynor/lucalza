import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  private apiUrl = 'http://localhost:3000/api/encuestas';

  constructor(private http: HttpClient) {}

  crearEncuesta(encuesta: any): Observable<any> {
    return this.http.post(this.apiUrl, encuesta);
  }
}
