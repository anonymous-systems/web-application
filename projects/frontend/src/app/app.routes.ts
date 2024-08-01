import {Routes} from '@angular/router';
import {
  incompleteProfileResolver,
} from './shared/resolvers/profile/incompleteProfileResolver';

export const appRoutes = {
  error: '/error',
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  welcome: '/welcome',
};

export const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./features/sign-up/sign-up.component')
        .then((c) => c.SignUpComponent),
    resolve: {needsToCompleteProfile: incompleteProfileResolver},
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component')
        .then((c) => c.WelcomeComponent),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component')
        .then((c) => c.LayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/home.component')
            .then((c) => c.HomeComponent),
      },
      {
        path: 'error',
        loadComponent: () => import('./features/error/error.component')
            .then((c) => c.ErrorComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./features/error/error.component')
            .then((c) => c.ErrorComponent),
      },
    ],
  },
];
