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

@Injectable({
  providedIn: 'root',
})
export class Laboratorios {
  private apiService = inject(ApiService);
  private readonly endpoint = '/laboratorios';

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.apiService.get<Laboratorio[]>(this.endpoint);
  }
}
