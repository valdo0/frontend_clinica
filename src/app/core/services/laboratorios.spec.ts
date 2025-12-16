import { TestBed } from '@angular/core/testing';
import { Laboratorios } from './laboratorios';
import { ApiService } from './api';
import { of } from 'rxjs';
import { Laboratorio, LaboratorioDTO } from '../models';

describe('Laboratorios', () => {
  let service: Laboratorios;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        Laboratorios,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(Laboratorios);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener laboratorios', () => {
    const mockLabs: Laboratorio[] = [];
    apiServiceSpy.get.and.returnValue(of(mockLabs));

    service.getLaboratorios().subscribe(res => {
      expect(res).toEqual(mockLabs);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/laboratorios');
  });

  it('debería crear laboratorio', () => {
    const request: LaboratorioDTO = { nombre: 'Lab Test', direccion: 'Address', telefono: '123', habilitado: true, tiposAnalisisIds: [1] };
    const response: Laboratorio = { id: 1, nombre: 'Lab Test', direccion: 'Address', telefono: '123', habilitado: true, tiposAnalisis: [] };
    apiServiceSpy.post.and.returnValue(of(response));

    service.createLaboratorio(request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/laboratorios', request);
  });

  it('debería actualizar laboratorio', () => {
    const id = 1;
    const request: LaboratorioDTO = { nombre: 'Lab Updated', direccion: 'Address', telefono: '123', habilitado: true, tiposAnalisisIds: [1] };
    const response: Laboratorio = { id: 1, nombre: 'Lab Updated', direccion: 'Address', telefono: '123', habilitado: true, tiposAnalisis: [] };
    apiServiceSpy.put.and.returnValue(of(response));

    service.updateLaboratorio(id, request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.put).toHaveBeenCalledWith(`/laboratorios/${id}`, request);
  });

  it('debería eliminar laboratorio', () => {
    const id = 1;
    apiServiceSpy.delete.and.returnValue(of(void 0));

    service.deleteLaboratorio(id).subscribe(res => {
      expect(res).toBeUndefined();
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith(`/laboratorios/${id}`);
  });
});
