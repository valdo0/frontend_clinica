import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import AgregarTipoAnalisis from './agregar-tipo-analisis';
import { TiposAnalisisService } from '../../../core/services/tipos-analisis';
import { TipoAnalisis } from '../../../core/models';

describe('AgregarTipoAnalisis', () => {
  let component: AgregarTipoAnalisis;
  let fixture: ComponentFixture<AgregarTipoAnalisis>;
  let tiposAnalisisServiceSpy: jasmine.SpyObj<TiposAnalisisService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TiposAnalisisService', ['createTipoAnalisis']);

    await TestBed.configureTestingModule({
      imports: [AgregarTipoAnalisis, FormsModule],
      providers: [
        { provide: TiposAnalisisService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTipoAnalisis);
    component = fixture.componentInstance;
    tiposAnalisisServiceSpy = TestBed.inject(TiposAnalisisService) as jasmine.SpyObj<TiposAnalisisService>;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería abrir modal en modo crear', () => {
    component.modo = 'crear';
    component.abrir();
    expect(component.isModalOpen).toBeTrue();
    expect(component.nombre).toBe('');
    expect(component.descripcion).toBe('');
  });

  it('debería abrir modal en modo editar', () => {
    const tipo: TipoAnalisis = { id: 1, nombre: 'Tipo 1', descripcion: 'Desc 1' };
    component.modo = 'editar';
    component.tipoAnalisis = tipo;
    component.abrir();

    expect(component.isModalOpen).toBeTrue();
    expect(component.nombre).toBe('Tipo 1');
    expect(component.descripcion).toBe('Desc 1');
  });

  it('debería crear tipo de análisis', () => {
    tiposAnalisisServiceSpy.createTipoAnalisis.and.returnValue(of({} as any));
    
    component.modo = 'crear';
    component.nombre = 'New Tipo';
    component.descripcion = 'Desc';
    
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    spyOn(component.tipoGuardado, 'emit');

    component.guardarTipo(form);

    expect(tiposAnalisisServiceSpy.createTipoAnalisis).toHaveBeenCalledWith(jasmine.objectContaining({
      nombre: 'New Tipo',
      descripcion: 'Desc'
    }));
    expect(component.tipoGuardado.emit).toHaveBeenCalled();
    expect(component.isModalOpen).toBeFalse();
  });

  it('debería manejar error al guardar', () => {
    tiposAnalisisServiceSpy.createTipoAnalisis.and.returnValue(throwError(() => new Error('Error')));
    
    component.modo = 'crear';
    const form = { valid: true } as any;
    component.guardarTipo(form);

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeTruthy();
  });

  it('debería cerrar al hacer clic en el fondo', () => {
    component.isModalOpen = true;
    const event = { target: { classList: { contains: (cls: string) => cls === 'modal' } } } as any;
    component.onBackdropClick(event);
    expect(component.isModalOpen).toBeFalse();
  });

  it('no debería cerrar al hacer clic en el contenido', () => {
    component.isModalOpen = true;
    const event = { target: { classList: { contains: (cls: string) => false } } } as any;
    component.onBackdropClick(event);
    expect(component.isModalOpen).toBeTrue();
  });
});
