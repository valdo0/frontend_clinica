import { TestBed } from '@angular/core/testing';

import { Laboratorios } from './laboratorios';

describe('Laboratorios', () => {
  let service: Laboratorios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Laboratorios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
