import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LABORATORIOS_ROUTES } from './pages/laboratorios/laboratorios.routes';
import { USUARIOS_ROUTES } from './pages/usuarios/usuarios.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login') },
      { path: 'registro', loadComponent: () => import('./auth/registro/registro') },
      { path: 'recuperar-password', loadComponent: () => import('./auth/recuperar-password/recuperar-password') },
      { path: 'modificar-perfil', loadComponent: () => import('./auth/modificar-perfil/modificar-perfil') },
    ],
  },

  {
    path: '',
    component:MainLayout,
    children:[
        { path:'dashboard',loadComponent:()=>import('./pages/dashboard/dashboard')},
        { path:'laboratorios',children:LABORATORIOS_ROUTES},
        { path:'usuarios',children:USUARIOS_ROUTES},
        { path:'paciente', loadChildren: () => import('./pages/paciente/paciente.routes').then(m => m.PACIENTE_ROUTES) }
    ]
  },
];

