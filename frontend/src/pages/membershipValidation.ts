export interface MembershipFormValues {
  name: string;
  durationInDays: string;
  price: string;
}

export interface MembershipFormErrors {
  name?: string;
  durationInDays?: string;
  price?: string;
  general?: string;
}

export function validateMembershipForm(
  values: MembershipFormValues
): MembershipFormErrors {
  const errors: MembershipFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Naziv je obavezan';
  } else if (values.name.length > 255) {
    errors.name = 'Naziv smije imati najviše 255 znakova';
  }

  const duration = Number(values.durationInDays);
  if (!values.durationInDays.trim()) {
    errors.durationInDays = 'Trajanje je obavezno';
  } else if (!Number.isInteger(duration) || duration < 1) {
    errors.durationInDays = 'Trajanje mora biti cijeli broj veći od 0';
  }

  const price = Number(values.price);
  if (!values.price.trim()) {
    errors.price = 'Cijena je obavezna';
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = 'Cijena mora biti veća od 0';
  }

  return errors;
}

export function isMembershipFormValid(values: MembershipFormValues): boolean {
  return Object.keys(validateMembershipForm(values)).length === 0;
}
