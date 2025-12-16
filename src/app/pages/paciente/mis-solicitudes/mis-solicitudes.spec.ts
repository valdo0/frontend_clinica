import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import MisSolicitudes from './mis-solicitudes';
import { Auth } from '../../../core/services/auth';
import { AnalisisService } from '../../../core/services/analisis';
import { Usuario, AnalisisResponseDTO, EstadoAnalisis } from '../../../core/models';

describe('MisSolicitudes', () => {
  let component: MisSolicitudes;
  let fixture: ComponentFixture<MisSolicitudes>;
  let authServiceSpy: jasmine.SpyObj<Auth>;
  let analisisServiceSpy: jasmine.SpyObj<AnalisisService>;

  const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123' };
  const mockSolicitudes: AnalisisResponseDTO[] = [
    { 
      id: 1, 
      laboratorioNombre: 'Lab 1', 
      tipoAnalisisNombre: 'Tipo 1', 
      usuarioNombre: 'Test', 
      usuarioEmail: 'test@test.com', 
      estado: 'PENDIENTE' as EstadoAnalisis, 
      descripcion: 'Desc 1', 
      comentarios: null, 
      fechaSolicitud: '2023-01-01', 
      fechaFinalizacion: null 
    },
    { 
      id: 2, 
      laboratorioNombre: 'Lab 2', 
      tipoAnalisisNombre: 'Tipo 2', 
      usuarioNombre: 'Test', 
      usuarioEmail: 'test@test.com', 
      estado: 'TERMINADO' as EstadoAnalisis, 
      descripcion: 'Desc 2', 
      comentarios: 'Result', 
      fechaSolicitud: '2023-01-02', 
      fechaFinalizacion: '2023-01-03' 
    }
  ];

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('Auth', ['getUser']);
    const analisisSpy = jasmine.createSpyObj('AnalisisService', ['getAllByUser']);

    await TestBed.configureTestingModule({
      imports: [MisSolicitudes, RouterTestingModule, FormsModule],
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: AnalisisService, useValue: analisisSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisSolicitudes);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    analisisServiceSpy = TestBed.inject(AnalisisService) as jasmine.SpyObj<AnalisisService>;
  });

  it('debería crearse', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    analisisServiceSpy.getAllByUser.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar solicitudes al inicio', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    analisisServiceSpy.getAllByUser.and.returnValue(of(mockSolicitudes));
    fixture.detectChanges();

    expect(component.solicitudes).toEqual(mockSolicitudes);
    expect(component.isLoading).toBeFalse();
  });

  it('debería manejar error al cargar solicitudes', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    analisisServiceSpy.getAllByUser.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeTruthy();
  });

  it('debería filtrar solicitudes', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    analisisServiceSpy.getAllByUser.and.returnValue(of(mockSolicitudes));
    fixture.detectChanges();

    component.filterEstado = 'todos';
    expect(component.filteredRequests.length).toBe(2);

    component.filterEstado = 'PENDIENTE';
    expect(component.filteredRequests.length).toBe(1);
    expect(component.filteredRequests[0].estado).toBe('PENDIENTE');

    component.filterEstado = 'TERMINADO';
    expect(component.filteredRequests.length).toBe(1);
    expect(component.filteredRequests[0].estado).toBe('TERMINADO');
  });

  it('debería retornar la clase correcta para el badge', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    analisisServiceSpy.getAllByUser.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component.getEstadoBadgeClass('PENDIENTE')).toContain('bg-warning');
    expect(component.getEstadoBadgeClass('TERMINADO')).toContain('bg-success');
    expect(component.getEstadoBadgeClass('CANCELADO')).toContain('bg-danger');
  });
});
