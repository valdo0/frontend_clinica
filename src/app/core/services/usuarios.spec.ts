import { TestBed } from '@angular/core/testing';
import { UsuariosService } from './usuarios';
import { ApiService } from './api';
import { of } from 'rxjs';
import { Usuario, UsuarioDTO } from '../models';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        UsuariosService,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(UsuariosService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener usuarios', () => {
    const mockUsers: Usuario[] = [];
    apiServiceSpy.get.and.returnValue(of(mockUsers));

    service.getUsuarios().subscribe(res => {
      expect(res).toEqual(mockUsers);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/usuarios');
  });

  it('debería obtener usuario por id', () => {
    const id = 1;
    const mockUser: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123' };
    apiServiceSpy.get.and.returnValue(of(mockUser));

    service.getUsuario(id).subscribe(res => {
      expect(res).toEqual(mockUser);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith(`/usuarios/${id}`);
  });

  it('debería crear usuario', () => {
    const request: UsuarioDTO = { nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123', password: 'pass' };
    const response: Usuario = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'PACIENTE', telefono: '123' };
    apiServiceSpy.post.and.returnValue(of(response));

    service.createUsuario(request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/usuarios', request);
  });

  it('debería actualizar usuario', () => {
    const id = 1;
    const request: Partial<UsuarioDTO> = { nombre: 'Updated' };
    const response: Usuario = { id: 1, nombre: 'Updated', email: 'test@test.com', rol: 'PACIENTE', telefono: '123' };
    apiServiceSpy.put.and.returnValue(of(response));

    service.updateUsuario(id, request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.put).toHaveBeenCalledWith(`/usuarios/${id}`, request);
  });

  it('debería eliminar usuario', () => {
    const id = 1;
    apiServiceSpy.delete.and.returnValue(of(void 0));

    service.deleteUsuario(id).subscribe(res => {
      expect(res).toBeUndefined();
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith(`/usuarios/${id}`);
  });
});
