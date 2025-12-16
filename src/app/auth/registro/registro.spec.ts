import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import Registro from './registro';
import { Auth } from '../../core/services/auth';
import { Usuario } from '../../core/models';

describe('Registro', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;
  let authServiceSpy: jasmine.SpyObj<Auth>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('Auth', ['register']);

    await TestBed.configureTestingModule({
      imports: [Registro, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Auth, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener formulario inválido inicialmente', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería validar que las contraseñas coincidan', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('password456');
    expect(component.form.hasError('notMatching')).toBeTrue();

    component.form.controls['confirmPassword'].setValue('password123');
    expect(component.form.hasError('notMatching')).toBeFalse();
  });

  it('debería llamar a registrar al enviar formulario válido', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    authServiceSpy.register.and.returnValue(of(mockUser));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.controls['nombre'].setValue('Test User');
    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['telefono'].setValue('123456789');
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('password123');
    
    component.registrar();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      nombre: 'Test User',
      email: 'test@test.com',
      telefono: '123456789',
      password: 'password123'
    });
  });

  it('debería navegar al login después de un registro exitoso', async () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    authServiceSpy.register.and.returnValue(of(mockUser));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.controls['nombre'].setValue('Test User');
    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['telefono'].setValue('123456789');
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('password123');
    
    component.registrar();

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debería manejar error de registro', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));
    
    component.form.controls['nombre'].setValue('Test User');
    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['telefono'].setValue('123456789');
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('password123');
    
    component.registrar();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Error');
  });

  it('debería alternar visibilidad de contraseña', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
  });

  it('debería alternar visibilidad de confirmación de contraseña', () => {
    expect(component.showConfirmPassword).toBeFalse();
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword).toBeTrue();
  });
});
