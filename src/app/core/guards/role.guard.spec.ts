import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { Auth } from '../services/auth';
import Swal from 'sweetalert2';

describe('roleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  let authServiceSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('Auth', ['getUser']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    authServiceSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crearse', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('debería redirigir al login si el usuario no está autenticado', () => {
    authServiceSpy.getUser.and.returnValue(null);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debería permitir acceso si el usuario tiene el rol requerido', () => {
    authServiceSpy.getUser.and.returnValue({ rol: 'ADMIN' } as any);
    const route = { data: { roles: ['ADMIN'] } } as unknown as ActivatedRouteSnapshot;

    const result = executeGuard(route, {} as RouterStateSnapshot);

    expect(result).toBeTrue();
  });

  it('debería denegar acceso y redirigir al dashboard si el usuario no tiene el rol requerido (ADMIN)', () => {
    authServiceSpy.getUser.and.returnValue({ rol: 'ADMIN' } as any);
    const route = { data: { roles: ['SUPERADMIN'] } } as unknown as ActivatedRouteSnapshot;
    
    spyOn(Swal, 'fire');

    const result = executeGuard(route, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(Swal.fire).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería denegar acceso y redirigir a mis-solicitudes si el usuario no tiene el rol requerido (PACIENTE)', () => {
    authServiceSpy.getUser.and.returnValue({ rol: 'PACIENTE' } as any);
    const route = { data: { roles: ['ADMIN'] } } as unknown as ActivatedRouteSnapshot;
    
    spyOn(Swal, 'fire');

    const result = executeGuard(route, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(Swal.fire).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/paciente/mis-solicitudes']);
  });
});
