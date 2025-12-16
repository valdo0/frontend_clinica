import { TestBed } from '@angular/core/testing';
import { AnalisisService } from './analisis';
import { ApiService } from './api';
import { of } from 'rxjs';
import { AnalisisResponseDTO, AnalisisRequestDTO, AnalisisUpdateDTO, EstadoAnalisis } from '../models';

describe('AnalisisService', () => {
  let service: AnalisisService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put']);

    TestBed.configureTestingModule({
      providers: [
        AnalisisService,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(AnalisisService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los análisis', () => {
    const mockAnalisis: AnalisisResponseDTO[] = [];
    apiServiceSpy.get.and.returnValue(of(mockAnalisis));

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockAnalisis);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('analisis');
  });

  it('debería obtener todos los análisis por usuario', () => {
    const mockAnalisis: AnalisisResponseDTO[] = [];
    const userId = 1;
    apiServiceSpy.get.and.returnValue(of(mockAnalisis));

    service.getAllByUser(userId).subscribe(res => {
      expect(res).toEqual(mockAnalisis);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith(`analisis/usuario/${userId}`);
  });

  it('debería crear un análisis', () => {
    const request: AnalisisRequestDTO = { usuarioId: 1, tipoAnalisisId: 1, laboratorioId: 1, descripcion: 'Test' };
    const response: AnalisisResponseDTO = { 
      id: 1, 
      laboratorioNombre: 'Lab', 
      tipoAnalisisNombre: 'Tipo', 
      usuarioNombre: 'User', 
      usuarioEmail: 'email@test.com', 
      estado: 'PENDIENTE' as EstadoAnalisis, 
      descripcion: 'Test', 
      comentarios: null, 
      fechaSolicitud: '2023-01-01', 
      fechaFinalizacion: null 
    };
    apiServiceSpy.post.and.returnValue(of(response));

    service.create(request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('analisis', request);
  });

  it('debería actualizar un análisis', () => {
    const id = 1;
    const request: AnalisisUpdateDTO = { estado: 'TERMINADO' as EstadoAnalisis, comentarios: 'Resultados' };
    const response: AnalisisResponseDTO = { 
      id: 1, 
      laboratorioNombre: 'Lab', 
      tipoAnalisisNombre: 'Tipo', 
      usuarioNombre: 'User', 
      usuarioEmail: 'email@test.com', 
      estado: 'TERMINADO' as EstadoAnalisis, 
      descripcion: 'Test', 
      comentarios: 'Resultados', 
      fechaSolicitud: '2023-01-01', 
      fechaFinalizacion: '2023-01-02' 
    };
    apiServiceSpy.put.and.returnValue(of(response));

    service.update(id, request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.put).toHaveBeenCalledWith(`analisis/${id}`, request);
  });
});
