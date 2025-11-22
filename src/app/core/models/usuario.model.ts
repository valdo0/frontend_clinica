export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'ADMIN' | 'LABMANAGER' | 'PACIENTE';
  fechaRegistro?: string;
  fechaCreacion?: string;
  activo?: boolean;
}

export interface UsuarioDTO {
  nombre: string;
  email: string;
  telefono: string;
  rol: 'ADMIN' | 'LABMANAGER' | 'PACIENTE';
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
}
