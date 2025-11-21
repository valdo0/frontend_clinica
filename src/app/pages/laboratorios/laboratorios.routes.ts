import { Routes } from '@angular/router';

export const LABORATORIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    loadComponent: () =>
      import('./listado-labs/listado-labs')
  },
  {
    path: 'tipos-analisis',
    loadComponent: () =>
      import('./tipos-analisis/tipos-analisis')
  },
  {
    path: 'asignar',
    loadComponent: () =>
      import('./asignar-lab/asignar-lab')
  }
];


