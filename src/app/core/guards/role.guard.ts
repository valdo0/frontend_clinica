import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const user = authService.getUser();

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as Array<string>;

  if (expectedRoles && expectedRoles.includes(user.rol)) {
    return true;
  }

  // Role not authorized
  Swal.fire({
    icon: 'error',
    title: 'Acceso Denegado',
    text: 'No tienes permisos para acceder a esta sección.',
    timer: 2000,
    showConfirmButton: false
  });
  
  router.navigate(['/dashboard']);
  return false;
};
