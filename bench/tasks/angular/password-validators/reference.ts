export function passwordStrength(control: { value: any }): null | { [key: string]: any } {
  const v: string = control?.value == null ? '' : String(control.value);
  const errors: { [key: string]: any } = {};

  if (v.length < 10) errors.minLength = true;
  if (!/[A-Z]/.test(v)) errors.uppercase = true;
  if (!/[a-z]/.test(v)) errors.lowercase = true;
  if (!/[0-9]/.test(v)) errors.digit = true;
  if (!/[^A-Za-z0-9]/.test(v)) errors.symbol = true;

  return Object.keys(errors).length === 0 ? null : errors;
}

export function matchFields(a: string, b: string) {
  return (control: { value: any }): null | { [key: string]: any } => {
    const obj = control?.value ?? {};
    return obj[a] === obj[b] ? null : { mismatch: true };
  };
}
