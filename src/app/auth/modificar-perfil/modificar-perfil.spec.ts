import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import ModificarPerfil from './modificar-perfil';
import { Auth } from '../../core/services/auth';
import { ApiService } from '../../core/services/api';
import { Usuario } from '../../core/models';

describe('ModificarPerfil', () => {
  let component: ModificarPerfil;
  let fixture: ComponentFixture<ModificarPerfil>;
  let authServiceSpy: jasmine.SpyObj<Auth>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let router: Router;

  const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('Auth', ['getUser', 'updateUser']);
    const apiSpy = jasmine.createSpyObj('ApiService', ['put']);

    await TestBed.configureTestingModule({
      imports: [ModificarPerfil, RouterTestingModule, FormsModule],
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: ApiService, useValue: apiSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPerfil);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('debería crearse', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar datos del usuario al inicio', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();
    expect(component.nombre).toBe(mockUser.nombre);
    expect(component.email).toBe(mockUser.email);
  });

  it('debería redirigir al login si no hay usuario', () => {
    authServiceSpy.getUser.and.returnValue(null);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debería actualizar perfil', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();

    const updatedUser = { ...mockUser, nombre: 'Updated Name' };
    apiServiceSpy.put.and.returnValue(of(updatedUser));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.nombre = 'Updated Name';
    component.onSubmit();

    expect(apiServiceSpy.put).toHaveBeenCalledWith(`usuarios/${mockUser.id}`, jasmine.objectContaining({ nombre: 'Updated Name' }));
    expect(authServiceSpy.updateUser).toHaveBeenCalledWith(updatedUser);
  });

  it('debería manejar error de actualización', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();

    apiServiceSpy.put.and.returnValue(throwError(() => new Error('Error')));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
  });

  it('debería reiniciar formulario', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();

    component.nombre = 'Changed';
    component.resetForm();
    expect(component.nombre).toBe(mockUser.nombre);
  });
});
