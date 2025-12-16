import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import RecuperarPassword from './recuperar-password';
import { Auth } from '../../core/services/auth';
import { PasswordRecoveryResponseDTO } from '../../core/models';

describe('RecuperarPassword', () => {
  let component: RecuperarPassword;
  let fixture: ComponentFixture<RecuperarPassword>;
  let authServiceSpy: jasmine.SpyObj<Auth>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('Auth', ['requestPasswordRecovery', 'resetPassword']);

    await TestBed.configureTestingModule({
      imports: [RecuperarPassword, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Auth, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarPassword);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener formulario de solicitud inválido inicialmente', () => {
    expect(component.requestForm.valid).toBeFalse();
  });

  it('debería solicitar código de recuperación', () => {
    const response: PasswordRecoveryResponseDTO = { mensaje: 'Code sent', codigo: '123456' };
    authServiceSpy.requestPasswordRecovery.and.returnValue(of(response));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.requestForm.controls['email'].setValue('test@test.com');
    component.requestRecoveryCode();

    expect(authServiceSpy.requestPasswordRecovery).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(component.step).toBe('reset');
    expect(component.generatedCode).toBe('123456');
  });

  it('debería manejar error de solicitud de recuperación', () => {
    authServiceSpy.requestPasswordRecovery.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.requestForm.controls['email'].setValue('test@test.com');
    component.requestRecoveryCode();

    expect(component.isLoading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
  });

  it('debería restablecer contraseña', async () => {
    authServiceSpy.resetPassword.and.returnValue(of('Success'));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.step = 'reset';
    component.requestForm.controls['email'].setValue('test@test.com');
    component.resetForm.controls['codigo'].setValue('123456');
    component.resetForm.controls['nuevaPassword'].setValue('password123');
    component.resetForm.controls['confirmPassword'].setValue('password123');

    component.resetPassword();

    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      codigo: '123456',
      nuevaPassword: 'password123'
    });

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debería manejar error de restablecimiento de contraseña', () => {
    authServiceSpy.resetPassword.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.step = 'reset';
    component.requestForm.controls['email'].setValue('test@test.com');
    component.resetForm.controls['codigo'].setValue('123456');
    component.resetForm.controls['nuevaPassword'].setValue('password123');
    component.resetForm.controls['confirmPassword'].setValue('password123');

    component.resetPassword();

    expect(component.isLoading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
  });

  it('debería validar que las contraseñas coincidan en el formulario de restablecimiento', () => {
    component.resetForm.controls['nuevaPassword'].setValue('password123');
    component.resetForm.controls['confirmPassword'].setValue('password456');
    expect(component.passwordsMatch).toBeFalse();

    component.resetForm.controls['confirmPassword'].setValue('password123');
    expect(component.passwordsMatch).toBeTrue();
  });

  it('debería volver al paso de solicitud', () => {
    component.step = 'reset';
    component.backToRequest();
    expect(component.step).toBe('request');
    expect(component.generatedCode).toBe('');
  });
});
