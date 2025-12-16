import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Navbar } from './navbar';
import { Auth } from '../../core/services/auth';
import { Usuario } from '../../core/models';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authServiceSpy: jasmine.SpyObj<Auth>;

  const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123456789' };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('Auth', ['getUser', 'logout']);

    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
      providers: [
        { provide: Auth, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar información del usuario cuando ha iniciado sesión', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();
    expect(component.user).toEqual(mockUser);
  });

  it('debería identificar rol de admin', () => {
    authServiceSpy.getUser.and.returnValue({ ...mockUser, rol: 'ADMIN' });
    fixture.detectChanges();
    expect(component.isAdmin).toBeTrue();
    expect(component.isLabManager).toBeFalse();
    expect(component.isPaciente).toBeFalse();
  });

  it('debería identificar rol de lab manager', () => {
    authServiceSpy.getUser.and.returnValue({ ...mockUser, rol: 'LABMANAGER' });
    fixture.detectChanges();
    expect(component.isLabManager).toBeTrue();
    expect(component.isAdmin).toBeFalse();
  });

  it('debería identificar rol de paciente', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);
    fixture.detectChanges();
    expect(component.isPaciente).toBeTrue();
  });

  it('debería cerrar sesión', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
