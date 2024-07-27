import { FormControl, FormGroup } from "@angular/forms";

export interface SignUpFormGroup {
  email: FormControl<string>,
  password: FormControl<string>,
  confirmPassword: FormControl<string>,
  agreements: FormGroup<AgreementsForm>,
  profile: FormGroup<ProfileForm>,
}

export interface AgreementsForm {
  termsConditions: FormControl<boolean>,
  privacyPolicy: FormControl<boolean>,
}

export interface ProfileForm {
  firstName: FormControl<string>,
  lastName: FormControl<string>,
  username: FormControl<string>,
  photo: FormControl<string | null>,
}
