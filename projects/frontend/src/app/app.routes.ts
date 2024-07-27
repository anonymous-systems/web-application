import { Routes } from '@angular/router';

export const appRoutes = {
  home: '/',
  error: '/error',
};

export const routes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./features/error/error.component')
      .then((c) => c.ErrorComponent),
  },
];
