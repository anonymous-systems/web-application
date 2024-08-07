import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {appRoutes} from '../../app.routes';
import {AuthService, LoggerService} from '@shared-library/services';
import {SeoService} from '@shared-library/services/seo.service';
import {environment} from '../../../environments/environment';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'anon-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    NgOptimizedImage,
    MatProgressBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  readonly title = 'Forgot password';

  readonly appRoutes = appRoutes;

  forgotPasswordForm = new FormGroup({
    email: new FormControl<string>(
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        },
    ),
  });

  loading = signal(false);

  constructor(
    private auth: AuthService,
    private seoService: SeoService,
    private logger: LoggerService,
  ) {
    this.seoService.generateTags({
      title: this.title,
      // eslint-disable-next-line max-len
      description: `Authentication ${this.title} page for ${environment.domain}`,
      route: appRoutes.forgotPassword,
    });
  }

  get email() {
    return this.forgotPasswordForm.controls.email;
  }

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    try {
      if (this.email.invalid) {
        this.logger.warn(`Please enter a valid email address`);
        return;
      }

      await this.auth.sendPasswordResetEmail(this.email.value);
    } catch (error: unknown) {
      this.logger.error(
          'Something went wrong sending password reset email.',
          error,
      );
    } finally {
      this.loading.set(false);
    }
  }

  async googleLogin() {
    this.loading.set(true);

    try {
      await this.auth.googleLogin();
    } catch (error: unknown) {
      this.logger.error('Something went wrong signing in with Google.', error);
    } finally {
      this.loading.set(false);
    }
  }
}
