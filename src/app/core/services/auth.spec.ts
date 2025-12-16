import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { ApiService } from './api';
import { of } from 'rxjs';
import { LoginRequest, RegisterRequest, Usuario, RequestPasswordRecoveryDTO, ResetPasswordDTO, PasswordRecoveryResponseDTO } from '../models';

describe('Auth', () => {
  let service: Auth;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        Auth,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(Auth);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    
    // Clear local storage before each test
    localStorage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería iniciar sesión y guardar usuario en local storage', () => {
    const loginData: LoginRequest = { email: 'test@test.com', password: 'password' };
    const mockUser: Usuario = { id: 1, nombre: 'Test User', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    
    apiServiceSpy.post.and.returnValue(of(mockUser));

    service.login(loginData).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem('user_session')).toContain(JSON.stringify(mockUser));
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/login', loginData);
  });

  it('debería registrar un nuevo usuario', () => {
    const registerData: RegisterRequest = { nombre: 'Test', email: 'test@test.com', password: 'password', telefono: '123456789' };
    const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };

    apiServiceSpy.post.and.returnValue(of(mockUser));

    service.register(registerData).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/register', registerData);
  });

  it('debería retornar usuario del local storage', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test User', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    localStorage.setItem('user_session', JSON.stringify(mockUser));

    const user = service.getUser();
    expect(user).toEqual(mockUser);
  });

  it('debería retornar null si no hay usuario en local storage', () => {
    const user = service.getUser();
    expect(user).toBeNull();
  });

  it('debería cerrar sesión y eliminar usuario del local storage', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test User', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    localStorage.setItem('user_session', JSON.stringify(mockUser));

    service.logout();
    expect(localStorage.getItem('user_session')).toBeNull();
  });

  it('debería verificar si el usuario ha iniciado sesión', () => {
    expect(service.isLoggedIn()).toBeFalse();

    const mockUser: Usuario = { id: 1, nombre: 'Test User', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    localStorage.setItem('user_session', JSON.stringify(mockUser));

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('debería solicitar recuperación de contraseña', () => {
    const data: RequestPasswordRecoveryDTO = { email: 'test@test.com' };
    const response: PasswordRecoveryResponseDTO = { mensaje: 'Email sent', codigo: '123456' };
    apiServiceSpy.post.and.returnValue(of(response));

    service.requestPasswordRecovery(data).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/request-password-recovery', data);
  });

  it('debería restablecer la contraseña', () => {
    const data: ResetPasswordDTO = { email: 'test@test.com', codigo: '123456', nuevaPassword: 'newPassword' };
    const response = 'Password reset successful';
    apiServiceSpy.post.and.returnValue(of(response));

    service.resetPassword(data).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/reset-password', data);
  });

  it('debería actualizar usuario en local storage', () => {
    const initialUser: Usuario = { id: 1, nombre: 'Old Name', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    localStorage.setItem('user_session', JSON.stringify(initialUser));

    const updatedUser: Usuario = { id: 1, nombre: 'New Name', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };
    service.updateUser(updatedUser);

    expect(JSON.parse(localStorage.getItem('user_session')!)).toEqual(updatedUser);
  });
});
