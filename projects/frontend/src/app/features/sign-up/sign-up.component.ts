import {
  ChangeDetectionStrategy, Component, effect, inject, signal,
} from '@angular/core';
import {
  MatFormField,
  MatFormFieldAppearance, MatLabel,
} from '@angular/material/form-field';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SignUpForm} from '../../shared/forms/sign-up.form';
import {SIGNUP_STEP} from '../../shared/enums/signup-step';
import {appRoutes} from '../../app.routes';
import {UserService} from '../../shared/services/user/user.service';
import {signUpAnimations} from './sign-up.animations';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  SelectAvatarDialogComponent,
/* eslint-disable-next-line max-len */
} from '../../shared/dialogs/select-avatar-dialog/select-avatar-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressBar} from '@angular/material/progress-bar';
import {
  SignUpStepperComponent,
} from '../../shared/components/sign-up-stepper/sign-up-stepper.component';
import {CdkStep, CdkStepperModule} from '@angular/cdk/stepper';
import {MatInput} from '@angular/material/input';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';
import {AsyncPipe, NgStyle} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {environment} from '../../../environments/environment';
import {AuthService, LoggerService} from '@shared-library/services';
import {CompanyInformation} from '@shared-library/information';
import {stringToUsername} from '@shared-library/functions';

@Component({
  selector: 'anon-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  animations: signUpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgStyle,
    CdkStep,
    SignUpStepperComponent,
    MatProgressBar,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatMiniFabButton,
    MatIcon,
    MatCheckbox,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    AsyncPipe,
    CdkStepperModule,
  ],
})
export class SignUpComponent extends SignUpForm {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);

  readonly appRoutes = appRoutes;

  readonly companyName = CompanyInformation.name;

  readonly domain = environment.domain;


  matFormFieldAppearance: MatFormFieldAppearance = 'outline';

  selectedStep = signal(SIGNUP_STEP.EMAIL);

  routeData = toSignal(this.route.data);

  user = toSignal(this.authService.authState$());

  constructor() {
    super();

    /** Check if user needs to complete profile */
    effect(() => {
      const routeData = this.routeData();

      this.logger.debug('Route data', routeData);

      if (routeData && routeData['needsToCompleteProfile']) {
        /* eslint-disable-next-line max-len */
        this.logger.debug('SignUpComponent needs to complete profile, set selected step to profile');

        this.selectedStep.set(SIGNUP_STEP.PROFILE);
      }
    }, {allowSignalWrites: true});

    /** Assign user info on user change */
    effect(async () => {
      const user = this.user();

      if (!user) return;

      const firstName = user.displayName?.split(' ')[0] ?? '';

      const lastName = user.displayName?.split(' ')[1] ?? '';

      const username = stringToUsername(user.displayName || '');

      const firestoreUser = await this.userService.getUserById(user.uid);

      this.firstName = firestoreUser?.firstName || firstName;

      this.lastName = firestoreUser?.lastName || lastName;

      this.username = firestoreUser?.username || username;

      this.photo = firestoreUser?.photoURL || user.photoURL;
    });
  }

  selectAvatar() {
    const dialogRef = this.dialog.open(SelectAvatarDialogComponent);

    dialogRef.afterClosed().forEach((avatarNumber?: number) => {
      if (typeof avatarNumber === 'number') {
        this.photo = `assets/avatars/${avatarNumber}.webp`;
      }
    });
  }

  async onPhotoUpload(event: Event) {
    this.loading.set(true);

    try {
      const inputElement = event.target as HTMLInputElement;

      const files = inputElement.files as FileList;

      const file = files[0];

      if (!file) return;

      const photoUrl = URL.createObjectURL(file);

      this.photoFile.set(file);

      this.photo = photoUrl;
    } catch (error) {
      this.logger.error('Something went wrong uploading photo', error);
    } finally {
      this.loading.set(false);
    }
  }

  async onAgreementsCompleted() {
    this.loading.set(true);

    try {
      await this.authService.signUp(this.email, this.password)
          .then(() => {
            this.logger.debug('User account created');

            this.selectedStep.set(SIGNUP_STEP.PROFILE);
          });
    } catch (error: unknown) {
      this.logger.error(
          `Something went wrong signing up for an account`, error,
      );
    } finally {
      this.loading.set(false);
    }
  }

  async onProfileCompleted() {
    this.loading.set(true);

    try {
      const user = this.authService.currentUser();

      if (!user) return;

      const username = this.username;

      const usernameAlreadyExists =
        await this.userService.usernameExists(username);

      if (usernameAlreadyExists) {
        /* eslint-disable-next-line max-len */
        return this.logger.error(`Username already exists, please select a different username`);
      }

      let photoUrl = this.photo || null;

      const photoFile = this.photoFile();

      const needToUploadPhoto = this.photo?.startsWith('blob:');

      if (needToUploadPhoto && photoFile) {
        const uploadedPhotoUrl = await this.userService.uploadAvatar(
            user.uid, photoFile,
        );

        if (!uploadedPhotoUrl) {
          throw Error('Something went wrong uploading user avatar');
        }

        photoUrl = uploadedPhotoUrl;
      }

      await this.userService.update(
          user,
          {
            photoURL: photoUrl,
            firstName: this.firstName,
            lastName: this.lastName,
            username: username,
            displayName: `${this.firstName} ${this.lastName}`,
          },
      ).then(() => this.router.navigate([appRoutes.home]));
    } catch (error: unknown) {
      this.logger.error(`Something went wrong updating user profile`, error);
    } finally {
      this.loading.set(false);
    }
  }

  setUsername(event: Event) {
    this.username = stringToUsername((event.target as HTMLInputElement).value);
  }
}
