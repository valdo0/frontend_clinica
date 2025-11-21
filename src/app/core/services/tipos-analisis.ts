import { Injectable, inject } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

export interface TipoAnalisis {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface TipoAnalisisDTO {
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class TiposAnalisisService {
  private apiService = inject(ApiService);
  private readonly endpoint = '/tipos-analisis';

  getTiposAnalisis(): Observable<TipoAnalisis[]> {
    return this.apiService.get<TipoAnalisis[]>(this.endpoint);
  }

  createTipoAnalisis(data: TipoAnalisisDTO): Observable<TipoAnalisis> {
    return this.apiService.post<TipoAnalisis>(this.endpoint, data);
  }
}
