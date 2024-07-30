import {FormControl, FormGroup} from '@angular/forms';

export interface SignUpFormGroup {
  email: FormControl<string>,
  password: FormControl<string>,
  confirmPassword: FormControl<string>,
  agreements: FormGroup<AgreementsFormGroup>,
  profile: FormGroup<ProfileFormGroup>,
}

export interface AgreementsFormGroup {
  termsConditions: FormControl<boolean>,
  privacyPolicy: FormControl<boolean>,
}

export interface ProfileFormGroup {
  firstName: FormControl<string>,
  lastName: FormControl<string>,
  username: FormControl<string>,
  photo: FormControl<string | null>,
}
