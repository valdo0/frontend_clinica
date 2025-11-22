export type EstadoAnalisis = 'PENDIENTE' | 'TERMINADO' | 'CANCELADO';

export interface AnalisisResponseDTO {
  id: number;
  laboratorioNombre: string;
  tipoAnalisisNombre: string;
  usuarioNombre: string;
  usuarioEmail: string;
  estado: EstadoAnalisis;
  descripcion: string;
  comentarios: string | null;
  fechaSolicitud: string;
  fechaFinalizacion: string | null;
}

export interface AnalisisRequestDTO {
  laboratorioId: number;
  tipoAnalisisId: number;
  usuarioId: number;
  descripcion?: string;
  comentarios?: string;
}

export interface AnalisisUpdateDTO {
  laboratorioId?: number;
  tipoAnalisisId?: number;
  estado?: EstadoAnalisis;
  descripcion?: string;
  comentarios?: string;
}
