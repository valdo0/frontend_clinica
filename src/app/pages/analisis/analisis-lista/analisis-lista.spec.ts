import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import AnalisisLista from './analisis-lista';
import { AnalisisService } from '../../../core/services/analisis';
import { AnalisisResponseDTO, EstadoAnalisis } from '../../../core/models';

describe('AnalisisLista', () => {
  let component: AnalisisLista;
  let fixture: ComponentFixture<AnalisisLista>;
  let analisisServiceSpy: jasmine.SpyObj<AnalisisService>;

  const mockAnalisis: AnalisisResponseDTO[] = [
    { 
      id: 1, 
      laboratorioNombre: 'Lab 1', 
      tipoAnalisisNombre: 'Tipo 1', 
      usuarioNombre: 'User 1', 
      usuarioEmail: 'user1@test.com', 
      estado: 'PENDIENTE' as EstadoAnalisis, 
      descripcion: 'Desc 1', 
      comentarios: null, 
      fechaSolicitud: '2023-01-01T10:00:00', 
      fechaFinalizacion: null 
    },
    { 
      id: 2, 
      laboratorioNombre: 'Lab 2', 
      tipoAnalisisNombre: 'Tipo 2', 
      usuarioNombre: 'User 2', 
      usuarioEmail: 'user2@test.com', 
      estado: 'TERMINADO' as EstadoAnalisis, 
      descripcion: 'Desc 2', 
      comentarios: 'Result', 
      fechaSolicitud: '2023-01-02T10:00:00', 
      fechaFinalizacion: '2023-01-03T10:00:00' 
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AnalisisService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [AnalisisLista, FormsModule],
      providers: [
        { provide: AnalisisService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalisisLista);
    component = fixture.componentInstance;
    analisisServiceSpy = TestBed.inject(AnalisisService) as jasmine.SpyObj<AnalisisService>;
  });

  it('debería crearse', () => {
    analisisServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar análisis al inicio', () => {
    analisisServiceSpy.getAll.and.returnValue(of(mockAnalisis));
    fixture.detectChanges();

    expect(component.analisis).toEqual(mockAnalisis);
    expect(component.filteredAnalisis).toEqual(mockAnalisis);
    expect(component.isLoading).toBeFalse();
  });

  it('debería manejar error al cargar análisis', () => {
    analisisServiceSpy.getAll.and.returnValue(throwError(() => new Error('Error')));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
  });

  it('debería filtrar análisis', () => {
    analisisServiceSpy.getAll.and.returnValue(of(mockAnalisis));
    fixture.detectChanges();

    component.onFilterChange('PENDIENTE');
    expect(component.filteredAnalisis.length).toBe(1);
    expect(component.filteredAnalisis[0].estado).toBe('PENDIENTE');

    component.onFilterChange('TERMINADO');
    expect(component.filteredAnalisis.length).toBe(1);
    expect(component.filteredAnalisis[0].estado).toBe('TERMINADO');

    component.onFilterChange('TODOS');
    expect(component.filteredAnalisis.length).toBe(2);
  });

  it('debería formatear la fecha correctamente', () => {
    analisisServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();

    const dateStr = '2023-01-01T10:00:00';
    // Match dd/MM/yyyy HH:mm or dd-MM-yyyy HH:mm or d/M/yyyy...
    expect(component.formatDate(dateStr)).toMatch(/\d{1,2}[\/-]\d{1,2}[\/-]\d{4},? \d{1,2}:\d{2}/);
  });

  it('debería retornar la clase correcta para el badge', () => {
    analisisServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component.getEstadoBadgeClass('PENDIENTE')).toContain('bg-warning');
    expect(component.getEstadoBadgeClass('TERMINADO')).toContain('bg-success');
    expect(component.getEstadoBadgeClass('CANCELADO')).toContain('bg-danger');
  });
});
