import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { publicGuard } from './public.guard';
import { Auth } from '../services/auth';

describe('publicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => publicGuard(...guardParameters));

  let authServiceSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('Auth', ['isLoggedIn', 'getUser']);
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

  it('debería permitir acceso si el usuario no ha iniciado sesión', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    
    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería redirigir a /paciente/mis-solicitudes si ha iniciado sesión como PACIENTE', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getUser.and.returnValue({ rol: 'PACIENTE' } as any);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/paciente/mis-solicitudes']);
  });

  it('debería redirigir a /dashboard si ha iniciado sesión con otro rol', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getUser.and.returnValue({ rol: 'ADMIN' } as any);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
