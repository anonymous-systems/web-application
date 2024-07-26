import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { catchError, map, of, take } from "rxjs";
import { AuthService, LoggerService } from "../services";

export const RedirectAuthenticatedGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);

  const router = inject(Router);

  const logger = inject(LoggerService);

  const authenticatedRoute = route.data['authenticatedRoute'];

  const errorRoute = route.data['errorRoute'];

  return auth.authState$().pipe(
    take(1),
    map((user) => {
      const isAuthenticated = !!user;

      if (isAuthenticated) {
        router.navigate(authenticatedRoute || ['/']);
      }

      return !isAuthenticated;
    }),
    catchError((error: unknown) => {
      logger.error('Error in RedirectAuthenticatedGuard:', error);

      router.navigate(errorRoute || ['/error']);

      return of(false);
    }),
  );
};
