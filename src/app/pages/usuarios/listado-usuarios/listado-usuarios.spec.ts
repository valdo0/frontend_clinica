import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import ListadoUsuarios from './listado-usuarios';
import { UsuariosService } from '../../../core/services/usuarios';
import { Usuario } from '../../../core/models';

describe('ListadoUsuarios', () => {
  let component: ListadoUsuarios;
  let fixture: ComponentFixture<ListadoUsuarios>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosService>;

  const mockUsers: Usuario[] = [
    { id: 1, nombre: 'User 1', email: 'user1@test.com', telefono: '123', rol: 'PACIENTE' },
    { id: 2, nombre: 'User 2', email: 'user2@test.com', telefono: '456', rol: 'ADMIN' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsuariosService', ['getUsuarios', 'deleteUsuario']);

    await TestBed.configureTestingModule({
      imports: [ListadoUsuarios, FormsModule],
      providers: [
        { provide: UsuariosService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoUsuarios);
    component = fixture.componentInstance;
    usuariosServiceSpy = TestBed.inject(UsuariosService) as jasmine.SpyObj<UsuariosService>;
  });

  it('debería crearse', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios al inicio', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of(mockUsers));
    fixture.detectChanges();

    expect(component.usuarios).toEqual(mockUsers);
    expect(component.usuariosFiltrados).toEqual(mockUsers);
    expect(component.isLoading).toBeFalse();
  });

  it('debería filtrar usuarios por búsqueda', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of(mockUsers));
    fixture.detectChanges();

    component.busqueda = 'User 1';
    component.aplicarFiltros();
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].nombre).toBe('User 1');
  });

  it('debería filtrar usuarios por rol', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of(mockUsers));
    fixture.detectChanges();

    component.filtroRol = 'ADMIN';
    component.aplicarFiltros();
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].rol).toBe('ADMIN');
  });

  it('debería eliminar usuario', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of(mockUsers));
    usuariosServiceSpy.deleteUsuario.and.returnValue(of(void 0));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarUsuario(1);

    expect(usuariosServiceSpy.deleteUsuario).toHaveBeenCalledWith(1);
    expect(usuariosServiceSpy.getUsuarios).toHaveBeenCalledTimes(2); // Init + after delete
  });

  it('debería abrir modal para agregar', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component.modalUsuario).toBeTruthy();
    spyOn(component.modalUsuario, 'abrir');

    component.abrirModalAgregar();

    expect(component.modalUsuario.modo).toBe('crear');
    expect(component.modalUsuario.abrir).toHaveBeenCalled();
  });

  it('debería abrir modal para editar', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of([]));
    fixture.detectChanges();

    const user = mockUsers[0];
    spyOn(component.modalUsuario, 'abrir');
    component.abrirModalEditar(user);

    expect(component.modalUsuario.modo).toBe('editar');
    expect(component.modalUsuario.usuario).toBe(user);
    expect(component.modalUsuario.abrir).toHaveBeenCalled();
  });

  it('debería establecer isAdmin en falso para no administradores', () => {
    component.isCurrentUserAdmin = false;
    usuariosServiceSpy.getUsuarios.and.returnValue(of([]));
    fixture.detectChanges();

    spyOn(component.modalUsuario, 'abrir');
    component.abrirModalAgregar();

    expect(component.modalUsuario.isAdmin).toBeFalse();
  });

  it('no debería eliminar usuario si se cancela', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of(mockUsers));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarUsuario(1);

    expect(usuariosServiceSpy.deleteUsuario).not.toHaveBeenCalled();
  });

  it('debería manejar error al eliminar usuario', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of(mockUsers));
    usuariosServiceSpy.deleteUsuario.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error'); // Suppress console error

    component.eliminarUsuario(1);

    expect(usuariosServiceSpy.deleteUsuario).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalled();
  });

  it('debería recargar al guardar', () => {
    usuariosServiceSpy.getUsuarios.and.returnValue(of([]));
    fixture.detectChanges();

    component.onUsuarioGuardado();
    expect(usuariosServiceSpy.getUsuarios).toHaveBeenCalledTimes(2);
  });

  it('debería retornar la clase correcta para el badge', () => {
    expect(component.getRolBadgeClass('admin')).toBe('bg-danger');
    expect(component.getRolBadgeClass('labmanager')).toBe('bg-warning text-dark');
    expect(component.getRolBadgeClass('paciente')).toBe('bg-success');
    expect(component.getRolBadgeClass('ADMIN')).toBe('bg-danger');
    expect(component.getRolBadgeClass('unknown')).toBe('bg-secondary');
  });
});
