import { Routes } from '@angular/router';

export const LABORATORIOS_ROUTES: Routes = [
  {
    path: 'lista',
    loadComponent: () =>
      import('./listado-labs/listado-labs')
  },
  {
    path: 'agregar',
    loadComponent: () =>
    import('./agregar-lab/agregar-lab')
  },
  {
    path: 'asignar',
    loadComponent: () =>
      import('./asignar-lab/asignar-lab')
    
  }
];
