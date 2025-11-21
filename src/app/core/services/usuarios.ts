import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'USER' | 'ADMIN';
  fechaCreacion?: string;
  activo?: boolean;
}

export interface UsuarioDTO {
  nombre: string;
  email: string;
  telefono: string;
  rol: 'USER' | 'ADMIN';
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiService = inject(ApiService);
  private endpoint = '/usuarios';

  getUsuarios(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(this.endpoint);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  createUsuario(data: UsuarioDTO): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, data);
  }

  updateUsuario(id: number, data: Partial<UsuarioDTO>): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, data);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
