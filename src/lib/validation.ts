export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: 'auth.validation.username.required' };
  }

  if (username.length < 4) {
    return { isValid: false, error: 'auth.validation.username.tooShort' };
  }

  if (username.length > 50) {
    return { isValid: false, error: 'auth.validation.username.tooLong' };
  }

  // Allow letters, numbers, spaces, and common special characters
  const usernameRegex = /^[a-zA-Z0-9\s\-_.']+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'auth.validation.username.invalid' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'auth.validation.email.required' };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'auth.validation.email.invalid' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string, isNewPassword: boolean = true): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'auth.validation.password.required' };
  }

  if (isNewPassword) {
    if (password.length < 8) {
      return { isValid: false, error: 'auth.validation.password.tooShort' };
    }
  }

  return { isValid: true };
};

export const validatePasswordConfirmation = (password: string, confirmation: string): ValidationResult => {
  if (!confirmation) {
    return { isValid: false, error: 'auth.validation.passwordConfirmation.required' };
  }

  if (password !== confirmation) {
    return { isValid: false, error: 'auth.validation.passwordConfirmation.mismatch' };
  }

  return { isValid: true };
}; 