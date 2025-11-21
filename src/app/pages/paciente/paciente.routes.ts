import { Routes } from '@angular/router';

export const PACIENTE_ROUTES: Routes = [
  {
    path: 'solicitar-analisis',
    loadComponent: () => import('./solicitar-analisis/solicitar-analisis')
  },
  {
    path: 'mis-solicitudes',
    loadComponent: () => import('./mis-solicitudes/mis-solicitudes')
  },
  {
    path: '',
    redirectTo: 'mis-solicitudes',
    pathMatch: 'full'
  }
];
