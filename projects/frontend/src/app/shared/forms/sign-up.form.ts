import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs';
import {SignUpFormGroup} from '../interfaces/sign-up-form-group';
import {
  passwordMinLength,
  passwordValidators,
} from '../validators/password.validator';
import {
  confirmPasswordValidators,
} from '../validators/confirm-password.validator';
import {signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  containsDigitRegExp, containsLetterRegExp, containsSpecialCharacterRegExp,
} from '@shared-library/regular-expressions';

export class SignUpForm {
  signUpForm = new FormGroup<SignUpFormGroup>({
    email: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [Validators.email, Validators.required],
        },
    ),
    password: new FormControl(
        '',
        {nonNullable: true, validators: passwordValidators},
    ),
    confirmPassword: new FormControl<string>(
        '',
        {nonNullable: true, validators: confirmPasswordValidators},
    ),
    agreements: new FormGroup({
      termsConditions: new FormControl(
          false,
          {nonNullable: true, validators: Validators.requiredTrue},
      ),
      privacyPolicy: new FormControl(
          false,
          {nonNullable: true, validators: Validators.requiredTrue},
      ),
    }),
    profile: new FormGroup({
      firstName: new FormControl(
          '',
          {nonNullable: true, validators: Validators.required},
      ),
      lastName: new FormControl(
          '',
          {nonNullable: true, validators: Validators.required},
      ),
      username: new FormControl(
          '',
          {nonNullable: true, validators: Validators.required},
      ),
      photo: new FormControl<string | null>(
          null,
          {nonNullable: false},
      ),
    }),
  });

  passwordMinLength = signal(passwordMinLength);

  showPassword = signal(false);

  showConfirmPassword = signal(false);

  passwordHasCharacters = toSignal(
      this.passwordCtrl.valueChanges.pipe(
          map((password) => containsLetterRegExp.test(password)),
      ),
  );

  passwordHasDigit = toSignal(
      this.passwordCtrl.valueChanges.pipe(
          map((password) => containsDigitRegExp.test(password)),
      ),
  );

  passwordHasSpecialCharacter = toSignal(
      this.passwordCtrl.valueChanges.pipe(
          map((password) => containsSpecialCharacterRegExp.test(password)),
      ),
  );

  loading = signal(false);

  photoFile = signal<File | null>(null);

  get emailCtrl() {
    return this.signUpForm.controls.email;
  }
  get email() {
    return this.emailCtrl.value;
  }
  set email(value: string) {
    this.emailCtrl.setValue(value);
  }

  get passwordCtrl() {
    return this.signUpForm.controls.password;
  }
  get password() {
    return this.passwordCtrl.value;
  }
  set password(value: string) {
    this.passwordCtrl.setValue(value);
  }

  get confirmPasswordCtrl() {
    return this.signUpForm.controls.confirmPassword;
  }
  get confirmPassword() {
    return this.confirmPasswordCtrl.value;
  }
  set confirmPassword(value: string) {
    this.confirmPasswordCtrl.setValue(value);
  }

  get agreementsCtrl() {
    return this.signUpForm.controls.agreements;
  }
  get agreements() {
    return this.agreementsCtrl.value;
  }
  // set agreements(value: Agreements) { this.agreementsCtrl.setValue(value); }

  get profileCtrl() {
    return this.signUpForm.controls.profile;
  }
  get profile() {
    return this.profileCtrl.value;
  }
  // set profile(value: Profile) { this.profileCtrl.setValue(value); }

  get firstNameCtrl() {
    return this.profileCtrl.controls.firstName;
  }
  get firstName() {
    return this.firstNameCtrl.value;
  }
  set firstName(value: string) {
    this.firstNameCtrl.setValue(value);
  }

  get lastNameCtrl() {
    return this.profileCtrl.controls.lastName;
  }
  get lastName() {
    return this.lastNameCtrl.value;
  }
  set lastName(value: string) {
    this.lastNameCtrl.setValue(value);
  }

  get usernameCtrl() {
    return this.profileCtrl.controls.username;
  }
  get username() {
    return this.usernameCtrl.value;
  }
  set username(value: string) {
    this.usernameCtrl.setValue(value);
  }

  get photoCtrl() {
    return this.profileCtrl.controls.photo;
  }
  get photo() {
    return this.photoCtrl.value;
  }
  set photo(value: string | null) {
    this.photoCtrl.setValue(value);
  }

  clearPhoto() {
    this.photoCtrl.setValue(null);

    this.photoFile.set(null);
  }
}
