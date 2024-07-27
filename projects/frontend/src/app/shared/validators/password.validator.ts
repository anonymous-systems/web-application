import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { containsLetterRegExp } from "../regular-expressions/contains-letter";
import { containsDigitRegExp } from "../regular-expressions/contains-digit";
import { containsSpecialCharacterRegExp } from "../regular-expressions/contains-special-character";

const passwordMinLength = 8;

const passwordValidator = (
  control: AbstractControl<string>,
): null | ValidationErrors => {
  const password = control.value;

  const validationErrors: Record<string, boolean> = {};

  const hasCharacter = containsLetterRegExp.test(password);

  if (!hasCharacter) validationErrors['missingCharacter'] = true;

  const hasDigit = containsDigitRegExp.test(password);

  if (!hasDigit) validationErrors['missingDigit'] = true;

  const hasSpecialCharacter = containsSpecialCharacterRegExp.test(password);

  if (!hasSpecialCharacter) validationErrors['missingSpecialCharacter'] = true;

  const hasMinLength = password.length >= passwordMinLength;

  if (!hasMinLength) validationErrors['minLength'] = true;

  return JSON.stringify(validationErrors) === '{}' ? null : validationErrors;
};

export const passwordValidators: ValidatorFn[] = [
  passwordValidator,
  Validators.required,
  Validators.minLength(passwordMinLength),
];
