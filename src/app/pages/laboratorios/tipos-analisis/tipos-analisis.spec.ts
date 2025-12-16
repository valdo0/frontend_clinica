import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import TiposAnalisis from './tipos-analisis';
import { TiposAnalisisService } from '../../../core/services/tipos-analisis';
import { TipoAnalisis } from '../../../core/models';

describe('TiposAnalisis', () => {
  let component: TiposAnalisis;
  let fixture: ComponentFixture<TiposAnalisis>;
  let tiposAnalisisServiceSpy: jasmine.SpyObj<TiposAnalisisService>;

  const mockTipos: TipoAnalisis[] = [
    { id: 1, nombre: 'Tipo 1', descripcion: 'Desc 1' },
    { id: 2, nombre: 'Tipo 2', descripcion: 'Desc 2' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TiposAnalisisService', ['getTiposAnalisis', 'createTipoAnalisis']);

    await TestBed.configureTestingModule({
      imports: [TiposAnalisis, RouterTestingModule],
      providers: [
        { provide: TiposAnalisisService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposAnalisis);
    component = fixture.componentInstance;
    tiposAnalisisServiceSpy = TestBed.inject(TiposAnalisisService) as jasmine.SpyObj<TiposAnalisisService>;
  });

  it('debería crearse', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar tipos de análisis al inicio', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of(mockTipos));
    fixture.detectChanges();

    expect(component.tiposAnalisis).toEqual(mockTipos);
    expect(component.isLoading).toBeFalse();
  });

  it('debería manejar error al cargar tipos', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeTruthy();
  });

  it('debería abrir modal para agregar', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component.modalTipo).toBeTruthy();
    spyOn(component.modalTipo, 'abrir');

    component.abrirModalAgregar();

    expect(component.modalTipo.modo).toBe('crear');
    expect(component.modalTipo.abrir).toHaveBeenCalled();
  });

  it('debería recargar al guardar', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    fixture.detectChanges();

    component.onTipoGuardado();
    expect(tiposAnalisisServiceSpy.getTiposAnalisis).toHaveBeenCalledTimes(2); // Init + reload
  });
});
