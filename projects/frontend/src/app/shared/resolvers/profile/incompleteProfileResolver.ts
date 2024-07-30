import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@shared-library';
import {UserService} from '../../services/user/user.service';
import {firstValueFrom} from 'rxjs';

export const incompleteProfileResolver: ResolveFn<boolean> = async () => {
  const auth = inject(AuthService);
  const userAuth = inject(UserService);

  const user = await firstValueFrom(auth.authState$());

  if (!user) return false;

  return !(await userAuth.hasCompletedProfile(user.uid));
};
