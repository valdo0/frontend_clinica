import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  rol: 'ADMIN' | 'LABMANAGER' | 'PACIENTE';
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiService = inject(ApiService);
  private readonly USER_KEY = 'user_session';

  login(credentials: LoginRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>('auth/login', credentials).pipe(
      tap(user => this.saveUser(user))
    );
  }

  private saveUser(user: Usuario): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
