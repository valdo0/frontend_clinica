import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService = inject(ApiService);
  private readonly endpoint = '/usuarios';

  getUsuarios(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(this.endpoint);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  createUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  patchUsuario(id: number, cambios: Partial<Usuario>): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}`, cambios);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

}
