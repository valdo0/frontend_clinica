import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import AgregarUsuario from './agregar-usuario';
import { UsuariosService } from '../../../core/services/usuarios';
import { Usuario } from '../../../core/models';

describe('AgregarUsuario', () => {
  let component: AgregarUsuario;
  let fixture: ComponentFixture<AgregarUsuario>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsuariosService', ['createUsuario', 'updateUsuario']);

    await TestBed.configureTestingModule({
      imports: [AgregarUsuario, FormsModule],
      providers: [
        { provide: UsuariosService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarUsuario);
    component = fixture.componentInstance;
    usuariosServiceSpy = TestBed.inject(UsuariosService) as jasmine.SpyObj<UsuariosService>;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería abrir modal en modo crear', () => {
    component.modo = 'crear';
    component.abrir();
    expect(component.isModalOpen).toBeTrue();
    expect(component.nombre).toBe('');
    expect(component.rol).toBe('PACIENTE');
  });

  it('debería abrir modal en modo editar', () => {
    const user: Usuario = { id: 1, nombre: 'User 1', email: 'test@test.com', telefono: '123', rol: 'ADMIN' };
    component.modo = 'editar';
    component.usuario = user;
    component.abrir();

    expect(component.isModalOpen).toBeTrue();
    expect(component.nombre).toBe('User 1');
    expect(component.rol).toBe('ADMIN');
  });

  it('debería crear usuario', () => {
    usuariosServiceSpy.createUsuario.and.returnValue(of({} as any));
    
    component.modo = 'crear';
    component.nombre = 'New User';
    component.email = 'new@test.com';
    component.password = 'pass';
    component.rol = 'PACIENTE';
    
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    spyOn(component.usuarioGuardado, 'emit');

    component.guardarUsuario(form);

    expect(usuariosServiceSpy.createUsuario).toHaveBeenCalledWith(jasmine.objectContaining({
      nombre: 'New User',
      email: 'new@test.com',
      password: 'pass'
    }));
    expect(component.usuarioGuardado.emit).toHaveBeenCalled();
    expect(component.isModalOpen).toBeFalse();
  });

  it('debería actualizar usuario', () => {
    usuariosServiceSpy.updateUsuario.and.returnValue(of({} as any));
    
    component.modo = 'editar';
    component.usuario = { id: 1 } as any;
    component.nombre = 'Updated User';
    
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    spyOn(component.usuarioGuardado, 'emit');

    component.guardarUsuario(form);

    expect(usuariosServiceSpy.updateUsuario).toHaveBeenCalledWith(1, jasmine.objectContaining({
      nombre: 'Updated User'
    }));
    expect(component.usuarioGuardado.emit).toHaveBeenCalled();
  });

  it('debería validar contraseña al crear', () => {
    component.modo = 'crear';
    component.password = '';
    const form = { valid: true } as any;
    
    component.guardarUsuario(form);
    
    expect(component.error).toContain('contraseña es requerida');
    expect(usuariosServiceSpy.createUsuario).not.toHaveBeenCalled();
  });

  it('debería manejar error al guardar', () => {
    usuariosServiceSpy.createUsuario.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));
    
    component.modo = 'crear';
    component.password = 'pass';
    const form = { valid: true } as any;
    component.guardarUsuario(form);

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('Error');
  });

  it('debería permitir contraseña vacía en modo editar', () => {
    usuariosServiceSpy.updateUsuario.and.returnValue(of({} as any));
    
    component.modo = 'editar';
    component.usuario = { id: 1 } as any;
    component.nombre = 'Updated User';
    component.email = 'updated@test.com';
    component.telefono = '123';
    component.rol = 'PACIENTE';
    component.password = '';
    
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    spyOn(component.usuarioGuardado, 'emit');

    component.guardarUsuario(form);

    expect(usuariosServiceSpy.updateUsuario).toHaveBeenCalledWith(1, jasmine.objectContaining({
      nombre: 'Updated User'
      // password should not be present
    }));
  });

  it('debería cerrar al hacer clic en el fondo', () => {
    component.isModalOpen = true;
    const event = { target: { classList: { contains: (cls: string) => cls === 'modal' } } } as any;
    component.onBackdropClick(event);
    expect(component.isModalOpen).toBeFalse();
  });

  it('no debería cerrar al hacer clic en el contenido', () => {
    component.isModalOpen = true;
    const event = { target: { classList: { contains: (cls: string) => false } } } as any;
    component.onBackdropClick(event);
    expect(component.isModalOpen).toBeTrue();
  });
});
