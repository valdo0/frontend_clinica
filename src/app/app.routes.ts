import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LABORATORIOS_ROUTES } from './pages/laboratorios/laboratorios.routes';
import { USUARIOS_ROUTES } from './pages/usuarios/usuarios.routes';
import { ANALISIS_ROUTES } from './pages/analisis/analisis.routes';
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
        path: 'analisis', 
        children: ANALISIS_ROUTES,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'LABMANAGER'] }
      },
      { 
        path: 'paciente', 
        loadChildren: () => import('./pages/paciente/paciente.routes').then(m => m.PACIENTE_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['PACIENTE'] }
      },
      { path: 'perfil', loadComponent: () => import('./auth/modificar-perfil/modificar-perfil') }
    ]
  },
];
