import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { EstadoAnalisis, AnalisisResponseDTO, AnalisisRequestDTO, AnalisisUpdateDTO } from '../models';


@Injectable({
  providedIn: 'root',
})
export class AnalisisService {
  private apiService = inject(ApiService);

  getAll(): Observable<AnalisisResponseDTO[]> {
    return this.apiService.get<AnalisisResponseDTO[]>('analisis');
  }

  getAllByUser(id:number): Observable<AnalisisResponseDTO[]> {
    return this.apiService.get<AnalisisResponseDTO[]>(`analisis/usuario/${id}`);
  }

  create(request: AnalisisRequestDTO): Observable<AnalisisResponseDTO> {
    return this.apiService.post<AnalisisResponseDTO>('analisis', request);
  }

  update(id: number, request: AnalisisUpdateDTO): Observable<AnalisisResponseDTO> {
    return this.apiService.put<AnalisisResponseDTO>(`analisis/${id}`, request);
  }
}
