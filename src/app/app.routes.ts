import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LABORATORIOS_ROUTES } from './pages/laboratorios/laboratorios.routes';
import { USUARIOS_ROUTES } from './pages/usuarios/usuarios.routes';
import { authGuard } from './core/guards/auth-guard-guard';
import { publicGuard } from './core/guards/public.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login') },
      { path: 'registro', loadComponent: () => import('./auth/registro/registro') },
      { path: 'recuperar-password', loadComponent: () => import('./auth/recuperar-password/recuperar-password') },
      // modificar-perfil should be protected, moving it to main layout or keeping here but with authGuard?
      // User said "when users are logged in they cannot see login nor register nor forgot password".
      // Modificar perfil IS for logged in users. So it should NOT be under publicGuard.
      // I will move modificar-perfil to the MainLayout children or a separate protected route.
    ],
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard'),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'LABMANAGER'] }
      },
      { 
        path: 'laboratorios', 
        children: LABORATORIOS_ROUTES,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'LABMANAGER'] }
      },
      { 
        path: 'usuarios', 
        children: USUARIOS_ROUTES,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      { 
        path: 'paciente', 
        loadChildren: () => import('./pages/paciente/paciente.routes').then(m => m.PACIENTE_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['PACIENTE'] }
      },
      // Moving modificar-perfil here as it requires auth
      { path: 'perfil', loadComponent: () => import('./auth/modificar-perfil/modificar-perfil') }
    ]
  },
];
