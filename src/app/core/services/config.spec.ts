import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config';
import { environment } from '../../../environments/environment';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar apiUrl', () => {
    expect(service.apiUrl).toEqual(environment.apiUrl);
  });

  it('debería retornar apiTimeout', () => {
    expect(service.apiTimeout).toEqual(environment.apiTimeout);
  });

  it('debería retornar isProduction', () => {
    expect(service.isProduction).toEqual(environment.production);
  });
});
