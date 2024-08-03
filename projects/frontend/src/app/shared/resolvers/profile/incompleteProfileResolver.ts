import {ResolveFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@shared-library/services';
import {UserService} from '../../services/user/user.service';
import {firstValueFrom} from 'rxjs';
import {appRoutes} from '../../../app.routes';

export const incompleteProfileResolver: ResolveFn<boolean> = async () => {
  const auth = inject(AuthService);

  const userAuth = inject(UserService);

  const router = inject(Router);

  const user = await firstValueFrom(auth.authState$());

  if (!user) return false;

  const hasCompletedProfile = await userAuth.hasCompletedProfile(user.uid);

  if (hasCompletedProfile) return router.navigate([appRoutes.home]);

  return true;
};
