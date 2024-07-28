import { ResolveFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import {
  AuthService,
  LoggerService
} from "../../../../../../shared/src/lib/services";
import { UserService } from "../../services/user/user.service";
import { firstValueFrom } from "rxjs";
import { appRoutes } from "../../../app.routes";

export const profileResolver: ResolveFn<boolean> = async () => {
  const auth = inject(AuthService);
  const userAuth = inject(UserService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  const user = await firstValueFrom(auth.authState$());

  logger.debug(`currentUser profile resolver`, user);

  if (!user) return false;

  const profileCompleted = await userAuth.hasCompletedProfile(user.uid);

  if (!profileCompleted) {
    return router.navigate([appRoutes.home])
      .then(() => false);
  }

  return true;
};
