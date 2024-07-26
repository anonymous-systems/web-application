import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { catchError, map, of, take } from "rxjs";
import { AuthService, LoggerService } from "../services";

export const RedirectAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  const router = inject(Router);

  const logger = inject(LoggerService);

  return auth.authState$().pipe(
    take(1),
    map((user) => {
      const isAuthenticated = !!user;

      if (isAuthenticated) {
        /* todo: create parameter for authenticatedRoute */
        router.navigate(['/']);
      }

      return !isAuthenticated;
    }),
    catchError((error: unknown) => {
      logger.error('Error in RedirectAuthenticatedGuard:', error);

      /* todo: create parameter for errorRoute */
      router.navigate(['/error']);

      return of(false);
    }),
  );
};
