export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: 'auth.validation.username.required' };
  }

  if (username.length < 2) {
    return { isValid: false, error: 'auth.validation.username.tooShort' };
  }

  if (username.length > 255) {
    return { isValid: false, error: 'auth.validation.username.tooLong' };
  }

  // Allow letters, spaces, hyphens and apostrophes
  const usernameRegex = /^[a-zA-Z\s\-']+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'auth.validation.username.invalid' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'auth.validation.email.required' };
  }

  if (email.length > 180) {
    return { isValid: false, error: 'auth.validation.email.tooLong' };
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

    if (password.length > 4096) {
      return { isValid: false, error: 'auth.validation.password.tooLong' };
    }

    // Must contain at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      return { isValid: false, error: 'auth.validation.password.requireLetterAndNumber' };
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

export const validateVerificationCode = (code: string): ValidationResult => {
  if (!code) {
    return { isValid: false, error: 'auth.validation.verificationCode.required' };
  }

  // Must be exactly 6 digits
  const codeRegex = /^\d{6}$/;
  if (!codeRegex.test(code)) {
    return { isValid: false, error: 'auth.validation.verificationCode.invalid' };
  }

  return { isValid: true };
}; 