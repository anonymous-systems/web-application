import {inject} from '@angular/core';
import {
  CanActivateFn, Router,
} from '@angular/router';
import {catchError, map, of, take} from 'rxjs';
import {AuthService, LoggerService} from '../services';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  const router = inject(Router);

  const logger = inject(LoggerService);

  const notAuthenticatedRoute =
    route.data['notAuthenticatedRoute'] || ['/sign-in'];

  const errorRoute = route.data['errorRoute'] || ['/error'];

  return auth.authState$().pipe(
      take(1),
      map((user) => {
        const isAuthenticated = !!user;

        if (!isAuthenticated) {
          router.navigate(
              notAuthenticatedRoute,
              {queryParams: {redirectURL: state.url}},
          );
        }

        return isAuthenticated;
      }),
      catchError((error: unknown) => {
        logger.error('Error in AuthGuard:', error);

        router.navigate(errorRoute);

        return of(false);
      }),
  );
};
