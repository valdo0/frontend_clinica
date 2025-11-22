import { Routes } from '@angular/router';

export const ANALISIS_ROUTES: Routes = [
  {
    path: 'listar',
    loadComponent: () => import('./analisis-lista/analisis-lista')
  },
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  }
];
