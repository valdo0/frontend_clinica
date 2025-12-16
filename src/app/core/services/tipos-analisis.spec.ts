import { TestBed } from '@angular/core/testing';
import { TiposAnalisisService } from './tipos-analisis';
import { ApiService } from './api';
import { of } from 'rxjs';
import { TipoAnalisis, TipoAnalisisDTO } from '../models';

describe('TiposAnalisisService', () => {
  let service: TiposAnalisisService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        TiposAnalisisService,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(TiposAnalisisService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener tipos de análisis', () => {
    const mockTipos: TipoAnalisis[] = [];
    apiServiceSpy.get.and.returnValue(of(mockTipos));

    service.getTiposAnalisis().subscribe(res => {
      expect(res).toEqual(mockTipos);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/tipos-analisis');
  });

  it('debería crear tipo de análisis', () => {
    const request: TipoAnalisisDTO = { nombre: 'Test', descripcion: 'Test Desc' };
    const response: TipoAnalisis = { id: 1, ...request };
    apiServiceSpy.post.and.returnValue(of(response));

    service.createTipoAnalisis(request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/tipos-analisis', request);
  });
});
