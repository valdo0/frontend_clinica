import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import ListadoLabs from './listado-labs';
import { Laboratorios } from '../../../core/services/laboratorios';
import { TiposAnalisisService } from '../../../core/services/tipos-analisis';
import { Laboratorio } from '../../../core/models';

describe('ListadoLabs', () => {
  let component: ListadoLabs;
  let fixture: ComponentFixture<ListadoLabs>;
  let laboratoriosServiceSpy: jasmine.SpyObj<Laboratorios>;
  let tiposAnalisisServiceSpy: jasmine.SpyObj<TiposAnalisisService>;

  const mockLabs: Laboratorio[] = [
    { id: 1, nombre: 'Lab 1', direccion: 'Dir 1', telefono: '123', habilitado: true, tiposAnalisis: [] },
    { id: 2, nombre: 'Lab 2', direccion: 'Dir 2', telefono: '456', habilitado: false, tiposAnalisis: [] }
  ];

  beforeEach(async () => {
    const labSpy = jasmine.createSpyObj('Laboratorios', ['getLaboratorios', 'deleteLaboratorio']);
    const tiposSpy = jasmine.createSpyObj('TiposAnalisisService', ['getTiposAnalisis']);

    await TestBed.configureTestingModule({
      imports: [ListadoLabs, RouterTestingModule, FormsModule],
      providers: [
        { provide: Laboratorios, useValue: labSpy },
        { provide: TiposAnalisisService, useValue: tiposSpy } // Needed for child component
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoLabs);
    component = fixture.componentInstance;
    laboratoriosServiceSpy = TestBed.inject(Laboratorios) as jasmine.SpyObj<Laboratorios>;
    tiposAnalisisServiceSpy = TestBed.inject(TiposAnalisisService) as jasmine.SpyObj<TiposAnalisisService>;
    
    // Mock child component service call
    tiposAnalisisServiceSpy.getTiposAnalisis.and.returnValue(of([]));
  });

  it('debería crearse', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar laboratorios al inicio', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of(mockLabs));
    fixture.detectChanges();

    expect(component.laboratorios).toEqual(mockLabs);
    expect(component.laboratoriosFiltrados).toEqual(mockLabs);
    expect(component.isLoading).toBeFalse();
  });

  it('debería filtrar laboratorios por búsqueda', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of(mockLabs));
    fixture.detectChanges();

    component.busqueda = 'Lab 1';
    component.aplicarFiltros();
    expect(component.laboratoriosFiltrados.length).toBe(1);
    expect(component.laboratoriosFiltrados[0].nombre).toBe('Lab 1');
  });

  it('debería filtrar laboratorios por estado', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of(mockLabs));
    fixture.detectChanges();

    component.filtroEstado = 'HABILITADO';
    component.aplicarFiltros();
    expect(component.laboratoriosFiltrados.length).toBe(1);
    expect(component.laboratoriosFiltrados[0].habilitado).toBeTrue();

    component.filtroEstado = 'DESHABILITADO';
    component.aplicarFiltros();
    expect(component.laboratoriosFiltrados.length).toBe(1);
    expect(component.laboratoriosFiltrados[0].habilitado).toBeFalse();
  });

  it('debería eliminar laboratorio', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of(mockLabs));
    laboratoriosServiceSpy.deleteLaboratorio.and.returnValue(of(void 0));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarLaboratorio(1);

    expect(laboratoriosServiceSpy.deleteLaboratorio).toHaveBeenCalledWith(1);
    expect(laboratoriosServiceSpy.getLaboratorios).toHaveBeenCalledTimes(2); // Init + after delete
  });

  it('debería abrir modal para agregar', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of([]));
    fixture.detectChanges();

    // Ensure modalLaboratorio is available
    expect(component.modalLaboratorio).toBeTruthy();
    
    spyOn(component.modalLaboratorio, 'abrir');
    component.abrirModalAgregar();

    expect(component.modalLaboratorio.modo).toBe('crear');
    expect(component.modalLaboratorio.abrir).toHaveBeenCalled();
  });

  it('debería abrir modal para editar', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of([]));
    fixture.detectChanges();

    const lab = mockLabs[0];
    spyOn(component.modalLaboratorio, 'abrir');
    component.abrirModalEditar(lab);

    expect(component.modalLaboratorio.modo).toBe('editar');
    expect(component.modalLaboratorio.laboratorio).toBe(lab);
    expect(component.modalLaboratorio.abrir).toHaveBeenCalled();
  });

  it('no debería eliminar laboratorio si se cancela', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of(mockLabs));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarLaboratorio(1);

    expect(laboratoriosServiceSpy.deleteLaboratorio).not.toHaveBeenCalled();
  });

  it('debería manejar error al eliminar laboratorio', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of(mockLabs));
    laboratoriosServiceSpy.deleteLaboratorio.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.eliminarLaboratorio(1);

    expect(laboratoriosServiceSpy.deleteLaboratorio).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalled();
  });

  it('debería recargar al guardar', () => {
    laboratoriosServiceSpy.getLaboratorios.and.returnValue(of([]));
    fixture.detectChanges();

    component.onLaboratorioGuardado();
    expect(laboratoriosServiceSpy.getLaboratorios).toHaveBeenCalledTimes(2);
  });
});
