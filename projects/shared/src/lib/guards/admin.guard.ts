import {inject} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  Router, RouterStateSnapshot,
} from '@angular/router';
import {catchError, from, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {AuthService, LoggerService} from '@shared-library/services';

export const AdminGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
  const logger = inject(LoggerService);

  const auth = inject(AuthService);

  const router = inject(Router);

  const notAdminRoute =
    route.data['notAdminRoute'] || ['/error/forbidden'];

  const notAuthenticatedRoute =
    route.data['notAuthenticatedRoute'] || ['/sign-in'];

  const errorRoute = route.data['errorRoute'] || ['/error'];

  return auth.authState$().pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return from(auth.getUserToken(user)).pipe(
              map((idTokenResult) => !!idTokenResult?.claims['admin']),
              tap((isAdmin) => {
                if (!isAdmin) router.navigate(notAdminRoute);
              }),
          );
        } else {
          router.navigate(
              notAuthenticatedRoute,
              {queryParams: {'redirectURL': state.url}},
          );

          return of(false);
        }
      }),
      catchError((error) => {
        logger.error('Error in AdminGuard:', error);

        router.navigate(errorRoute);

        return of(false);
      }),
  );
};
