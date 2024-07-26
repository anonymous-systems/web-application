import { inject } from '@angular/core';
import {
  CanActivateFn, Router,
} from '@angular/router';
import { catchError, map, of, take } from 'rxjs';
import { AuthService, LoggerService } from "../services";

export const AuthGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);

  const router = inject(Router);

  const logger = inject(LoggerService);

  return auth.authState$().pipe(
    take(1),
    map((user) => {
      const isAuthenticated = !!user;

      if (!isAuthenticated) {
        router.navigate(
          /* todo: create parameter for notAuthenticatedRoute */
          ['/sign-in'],
          { queryParams: { redirectURL: state.url } },
        );
      }

      return isAuthenticated;
    }),
    catchError((error: unknown) => {
      logger.error('Error in AuthGuard:', error);

      /* todo: create parameter for errorRoute */
      router.navigate(['/error']);

      return of(false);
    }),
  );
};
