import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import Dashboard from './dashboard';
import { AnalisisService } from '../../core/services/analisis';
import { AnalisisResponseDTO, EstadoAnalisis } from '../../core/models';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
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
      fechaSolicitud: new Date().toISOString(), 
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
      fechaSolicitud: new Date().toISOString(), 
      fechaFinalizacion: new Date().toISOString() 
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AnalisisService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterTestingModule],
      providers: [
        { provide: AnalisisService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    analisisServiceSpy = TestBed.inject(AnalisisService) as jasmine.SpyObj<AnalisisService>;
  });

  it('debería crearse', () => {
    analisisServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar análisis y calcular estadísticas', () => {
    analisisServiceSpy.getAll.and.returnValue(of(mockAnalisis));
    fixture.detectChanges();

    expect(component.analisis).toEqual(mockAnalisis);
    expect(component.isLoading).toBeFalse();
    
    // Check stats
    const pendientes = component.stats.find(s => s.title === 'Exámenes Pendientes');
    const terminados = component.stats.find(s => s.title === 'Resultados Listos');
    
    expect(pendientes?.value).toBe(1);
    expect(terminados?.value).toBe(1);
  });

  it('debería manejar error al cargar análisis', () => {
    analisisServiceSpy.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.stats.length).toBe(4); // Should set default stats
    expect(component.stats[0].value).toBe(0);
  });

  it('debería formatear la fecha correctamente', () => {
    analisisServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();

    const today = new Date();
    expect(component.formatDate(today.toISOString())).toMatch(/\d{2}:\d{2}/); // HH:mm

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(component.formatDate(yesterday.toISOString())).toBe('Ayer');

    const oldDate = new Date('2023-01-01');
    expect(component.formatDate(oldDate.toISOString())).toMatch(/\d{1,2}[\/-]\d{1,2}/); // dd-MM or dd/MM or d/M
  });
});
