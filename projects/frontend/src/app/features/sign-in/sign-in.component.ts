import {
  ChangeDetectionStrategy, Component, inject, signal,
} from '@angular/core';
import {
  MatFormField, MatFormFieldAppearance, MatLabel,
} from '@angular/material/form-field';
import {appRoutes} from '../../app.routes';
import {AuthService, LoggerService} from '@shared-library/services';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {BrandNameComponent} from '@shared-library/components';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

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
export class SignInComponent {
  private authService = inject(AuthService);

  private logger = inject(LoggerService);

  protected readonly appRoutes = appRoutes;

  readonly title = 'Sign in';

  readonly description = 'Enter your details to continue';

  readonly matFormFieldAppearance: MatFormFieldAppearance = 'outline';

  showPassword = signal(false);

  loading = signal(false);

  signInForm = new FormGroup({
    email: new FormControl<string>(
        '',
        {
          nonNullable: true,
          validators: [Validators.email, Validators.required],
        },
    ),
    password: new FormControl<string>(
        '',
        {nonNullable: true, validators: [Validators.required]},
    ),
    remember: new FormControl<boolean>(
        true,
        {nonNullable: true, validators: [Validators.required]},
    ),
  });

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

  async googleSignIn() {
    try {
      await this.authService.signInWithGoogle([appRoutes.home]);
    } catch (error: unknown) {
      this.logger.error('Error caught while signing in with Google', error);

      throw error;
    }
  }
}
