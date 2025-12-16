import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import Login from './login';
import { Auth } from '../../core/services/auth';
import { Usuario } from '../../core/models';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<Auth>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('Auth', ['login']);

    await TestBed.configureTestingModule({
      imports: [Login, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Auth, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido inicialmente', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería tener el formulario válido cuando se llena correctamente', () => {
    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['password'].setValue('password');
    expect(component.form.valid).toBeTrue();
  });

  it('debería llamar al login al enviar un formulario válido', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123' };
    authServiceSpy.login.and.returnValue(of(mockUser));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['password'].setValue('password');
    component.ingresar();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });

  it('debería navegar al dashboard de paciente si el usuario es PACIENTE', async () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123' };
    authServiceSpy.login.and.returnValue(of(mockUser));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['password'].setValue('password');
    component.ingresar();

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/paciente/mis-solicitudes']);
  });

  it('debería navegar al dashboard si el usuario es ADMIN', async () => {
    const mockUser: Usuario = { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'ADMIN', telefono: '123' };
    authServiceSpy.login.and.returnValue(of(mockUser));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.controls['email'].setValue('admin@test.com');
    component.form.controls['password'].setValue('password');
    component.ingresar();

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería manejar error de login', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Error')));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.controls['email'].setValue('test@test.com');
    component.form.controls['password'].setValue('password');
    component.ingresar();

    expect(component.isLoading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
  });

  it('debería alternar visibilidad de contraseña', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
  });
});
