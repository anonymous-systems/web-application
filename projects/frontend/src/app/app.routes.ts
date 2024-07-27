import { Routes } from '@angular/router';

export const appRoutes = {
  error: '/error',
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  welcome: '/welcome',
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'error',
    loadComponent: () => import('./features/error/error.component')
      .then((c) => c.ErrorComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component')
      .then((c) => c.WelcomeComponent),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
