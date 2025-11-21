import { Injectable,inject } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

export interface TipoAnalisis {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Laboratorio {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  habilitado: boolean;
  tiposAnalisis: TipoAnalisis[];
}

export interface LaboratorioDTO {
  nombre: string;
  direccion: string;
  telefono: string;
  habilitado: boolean;
  tiposAnalisisIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class Laboratorios {
  private apiService = inject(ApiService);
  private readonly endpoint = '/laboratorios';

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.apiService.get<Laboratorio[]>(this.endpoint);
  }

  createLaboratorio(data: LaboratorioDTO): Observable<Laboratorio> {
    return this.apiService.post<Laboratorio>(this.endpoint, data);
  }

  updateLaboratorio(id: number, data: LaboratorioDTO): Observable<Laboratorio> {
    return this.apiService.put<Laboratorio>(`${this.endpoint}/${id}`, data);
  }

  deleteLaboratorio(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
