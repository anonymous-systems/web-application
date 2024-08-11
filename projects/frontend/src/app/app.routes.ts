import {Routes} from '@angular/router';
import {
  incompleteProfileResolver,
} from './shared/resolvers/profile/incompleteProfileResolver';
import {RedirectAuthenticatedGuard} from '@shared-library/guards';

export const appRoutes = {
  error: '/error',
  forgotPassword: '/forgot-password',
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  welcome: '/welcome',
};

export const routes: Routes = [
  {
    path: 'forgot-password',
    // eslint-disable-next-line max-len
    loadComponent: () => import('./features/forgot-password/forgot-password.component')
        .then((c) => c.ForgotPasswordComponent),
    canActivate: [RedirectAuthenticatedGuard],
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./features/sign-in/sign-in.component')
        .then((c) => c.SignInComponent),
    canActivate: [RedirectAuthenticatedGuard],
  },
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
        // eslint-disable-next-line max-len
        loadComponent: () => import('./features/page-not-found/page-not-found.component')
            .then((c) => c.PageNotFoundComponent),
      },
    ],
  },
];
