import {
  AbstractControl, FormControl,
  FormGroup,
  ValidationErrors, ValidatorFn,
} from "@angular/forms";
import { passwordValidators } from "./password.validator";

const confirmPasswordValidator = (
  control: AbstractControl<string>,
): null | ValidationErrors => {
  const parentForm = control?.parent as FormGroup<{
    password: FormControl<string>,
    confirmPassword: FormControl<string>,
  }>;

  const password = parentForm?.controls.password.value;

  return password === control.value ? null : { mismatch: true };
};

export const confirmPasswordValidators: ValidatorFn[] = [
  ...passwordValidators,
  confirmPasswordValidator,
];
