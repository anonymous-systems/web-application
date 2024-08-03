import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {appRoutes} from '../../app.routes';
import {AuthService, LoggerService} from '@shared-library/services';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {BrandNameComponent} from '@shared-library/components';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {SignInForm} from '../../shared/forms/sign-in.form';
import {UserService} from '../../shared/services/user/user.service';

@Component({
  selector: 'anon-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true,
  imports: [
    MatProgressBar, RouterLink, BrandNameComponent, ReactiveFormsModule,
    MatFormField, MatLabel, MatInput, MatIcon, MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent extends SignInForm {
  private authService = inject(AuthService);

  private usersService = inject(UserService);

  private logger = inject(LoggerService);

  protected readonly appRoutes = appRoutes;

  readonly title = 'Sign in';

  readonly description = 'Enter your details to continue';

  async signIn() {
    this.loading.set(true);

    try {
      if (this.signInForm.invalid) {
        throw new Error('Sign in form is invalid');
      }

      const email = this.signInForm.controls.email.value;

      const password = this.signInForm.controls.password.value;

      // const remember = this.signInForm.controls.remember.value;

      await this.authService.signInWithEmailAndPassword(
          email, password, [appRoutes.home],
      );
    } catch (error) {
      this.logger.error('Something went wrong signing in', error);

      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async continueWithGoogle() {
    this.loading.set(true);

    try {
      await this.usersService.signInWithGoogle([appRoutes.home]);
    } catch (error: unknown) {
      this.logger.error('Error continuing with Google', error);

      throw error;
    } finally {
      this.loading.set(false);
    }
  }
}
