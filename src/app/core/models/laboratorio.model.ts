import { TipoAnalisis } from './tipo-analisis.model';

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
