import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api';
import { ConfigService } from './config';
import { provideHttpClient } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const mockConfigService = {
    apiUrl: 'http://localhost:3000/api',
    apiTimeout: 5000
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService }
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una petición GET', () => {
    const dummyData = { id: 1, name: 'Test' };
    service.get('/test').subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/test');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('debería realizar una petición POST', () => {
    const dummyData = { id: 1, name: 'Test' };
    const payload = { name: 'Test' };
    service.post('/test', payload).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(dummyData);
  });

  it('debería realizar una petición PUT', () => {
    const dummyData = { id: 1, name: 'Updated' };
    const payload = { name: 'Updated' };
    service.put('/test/1', payload).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/test/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(dummyData);
  });

  it('debería realizar una petición DELETE', () => {
    service.delete('/test/1').subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/test/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería manejar errores HTTP', () => {
    const errorMessage = 'Error del servidor';
    service.get('/error').subscribe({
      next: () => fail('should have failed with the error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/error');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
