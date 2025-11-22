import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Usuario, UsuarioDTO } from '../models';


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
