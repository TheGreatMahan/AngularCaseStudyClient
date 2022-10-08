import { AbstractControl } from '@angular/forms';
export function ValidateInt(
  control: AbstractControl
): { invalidInt: boolean } | null {
  const PHONE_REGEXP =
  /^\d+$/;
  return !PHONE_REGEXP.test(control.value) ? { invalidInt: true } : null;
} // ValidateInt
