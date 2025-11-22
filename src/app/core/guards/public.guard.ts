import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }
  if(authService.getUser()?.rol === 'PACIENTE') {
    router.navigate(['/paciente/mis-solicitudes']);
  }
  router.navigate(['/dashboard']);
  return false;
};
