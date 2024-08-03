import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignInFormGroup} from '../interfaces/sign-in-form-group';
import {signal} from '@angular/core';
import {MatFormFieldAppearance} from '@angular/material/form-field';

export class SignInForm {
  signInForm = new FormGroup<SignInFormGroup>({
    email: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [Validators.email, Validators.required],
        },
    ),
    password: new FormControl(
        '',
        {nonNullable: true, validators: [Validators.required]},
    ),
    remember: new FormControl(
        true,
        {nonNullable: true, validators: [Validators.required]},
    ),
  });

  showPassword = signal(false);

  loading = signal(false);

  matFormFieldAppearance = signal<MatFormFieldAppearance>('outline');

  get emailCtrl() {
    return this.signInForm.controls.email;
  }
  get email() {
    return this.emailCtrl.value;
  }
  set email(value: string) {
    this.emailCtrl.setValue(value);
  }

  get passwordCtrl() {
    return this.signInForm.controls.password;
  }
  get password() {
    return this.passwordCtrl.value;
  }
  set password(value: string) {
    this.passwordCtrl.setValue(value);
  }

  get rememberCtrl() {
    return this.signInForm.controls.remember;
  }
  get remember() {
    return this.rememberCtrl.value;
  }
  set remember(value: boolean) {
    this.rememberCtrl.setValue(value);
  }
}
