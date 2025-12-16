import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import AgregarLab from './agregar-lab';
import { Laboratorios } from '../../../core/services/laboratorios';
import { TiposAnalisisService } from '../../../core/services/tipos-analisis';
import { Laboratorio, TipoAnalisis } from '../../../core/models';

describe('AgregarLab', () => {
  let component: AgregarLab;
  let fixture: ComponentFixture<AgregarLab>;
  let laboratoriosServiceSpy: jasmine.SpyObj<Laboratorios>;
  let tiposAnalisisServiceSpy: jasmine.SpyObj<TiposAnalisisService>;

  const mockTipos: TipoAnalisis[] = [
    { id: 1, nombre: 'Tipo 1', descripcion: 'Desc 1' },
    { id: 2, nombre: 'Tipo 2', descripcion: 'Desc 2' }
  ];

  beforeEach(async () => {
    const labSpy = jasmine.createSpyObj('Laboratorios', ['createLaboratorio', 'updateLaboratorio']);
    const tiposSpy = jasmine.createSpyObj('TiposAnalisisService', ['getTiposAnalisis']);

    await TestBed.configureTestingModule({
      imports: [AgregarLab, FormsModule],
      providers: [
        { provide: Laboratorios, useValue: labSpy },
        { provide: TiposAnalisisService, useValue: tiposSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarLab);
    component = fixture.componentInstance;
    laboratoriosServiceSpy = TestBed.inject(Laboratorios) as jasmine.SpyObj<Laboratorios>;
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
    expect(component.tiposAnalisisDisponibles).toEqual(mockTipos);
  });

  it('debería abrir modal en modo crear', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    fixture.detectChanges();

    component.modo = 'crear';
    component.abrir();

    expect(component.isModalOpen).toBeTrue();
    expect(component.nombre).toBe('');
    expect(component.tiposAnalisisSeleccionados).toEqual([]);
  });

  it('debería abrir modal en modo editar', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    fixture.detectChanges();

    const lab: Laboratorio = { 
      id: 1, 
      nombre: 'Lab 1', 
      direccion: 'Dir 1', 
      telefono: '123', 
      habilitado: true, 
      tiposAnalisis: [{ id: 1, nombre: 'Tipo 1', descripcion: 'Desc 1' }] 
    };
    component.modo = 'editar';
    component.laboratorio = lab;
    component.abrir();

    expect(component.isModalOpen).toBeTrue();
    expect(component.nombre).toBe('Lab 1');
    expect(component.tiposAnalisisSeleccionados).toEqual([1]);
  });

  it('debería crear laboratorio', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    laboratoriosServiceSpy.createLaboratorio.and.returnValue(of({} as any));
    fixture.detectChanges();

    component.modo = 'crear';
    component.nombre = 'New Lab';
    component.direccion = 'Address';
    component.telefono = '123';
    component.habilitado = true;
    component.tiposAnalisisSeleccionados = [1];

    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    spyOn(component.laboratorioGuardado, 'emit');

    component.guardarLaboratorio(form);

    expect(laboratoriosServiceSpy.createLaboratorio).toHaveBeenCalledWith(jasmine.objectContaining({
      nombre: 'New Lab',
      tiposAnalisisIds: [1]
    }));
    expect(component.laboratorioGuardado.emit).toHaveBeenCalled();
    expect(component.isModalOpen).toBeFalse();
  });

  it('debería actualizar laboratorio', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    laboratoriosServiceSpy.updateLaboratorio.and.returnValue(of({} as any));
    fixture.detectChanges();

    component.modo = 'editar';
    component.laboratorio = { id: 1 } as any;
    component.nombre = 'Updated Lab';
    
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    spyOn(component.laboratorioGuardado, 'emit');

    component.guardarLaboratorio(form);

    expect(laboratoriosServiceSpy.updateLaboratorio).toHaveBeenCalledWith(1, jasmine.objectContaining({
      nombre: 'Updated Lab'
    }));
    expect(component.laboratorioGuardado.emit).toHaveBeenCalled();
  });

  it('debería manejar error al guardar', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    laboratoriosServiceSpy.createLaboratorio.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    component.modo = 'crear';
    const form = { valid: true } as any;
    component.guardarLaboratorio(form);

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeTruthy();
  });

  it('debería alternar selección de tipo de análisis', () => {
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
    fixture.detectChanges();

    component.toggleTipoAnalisis(1);
    expect(component.tiposAnalisisSeleccionados).toEqual([1]);

    component.toggleTipoAnalisis(1);
    expect(component.tiposAnalisisSeleccionados).toEqual([]);
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
