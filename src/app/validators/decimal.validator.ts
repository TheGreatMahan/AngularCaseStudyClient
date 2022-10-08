import { AbstractControl } from '@angular/forms';
export function ValidateDecimal(
  control: AbstractControl
): { invalidDecimal: boolean } | null {
  const PHONE_REGEXP =
  /^\d+(\.\d{1,2})?$/i;
  return !PHONE_REGEXP.test(control.value) ? { invalidDecimal: true } : null;
} // ValidateDecimal
