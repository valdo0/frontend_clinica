import { Injectable, inject } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { Laboratorio, LaboratorioDTO } from '../models';


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
