import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { validateUsername, validateEmail, validatePassword, validatePasswordConfirmation } from '../../../lib/validation';

interface SignupFieldsProps {
  isLoading: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function SignupFields({ isLoading, onValidationChange }: SignupFieldsProps) {
  const { t } = useTranslation();
  const [errors, setErrors] = React.useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'username':
        return validateUsername(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validatePasswordConfirmation(passwordRef.current?.value || '', value);
      default:
        return { isValid: true };
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validateField(field, e.target.value);
    setErrors(prev => {
      const newErrors = {
        ...prev,
        [field]: result.isValid ? undefined : t(result.error || '')
      };

      // If this is a password change, also validate the confirmation
      if (field === 'password' && confirmPasswordRef.current?.value) {
        const confirmResult = validatePasswordConfirmation(e.target.value, confirmPasswordRef.current.value);
        newErrors.confirmPassword = confirmResult.isValid ? undefined : t(confirmResult.error || '');
      }

      // Notify parent about validation state
      if (onValidationChange) {
        const isValid = !Object.values(newErrors).some(error => error !== undefined);
        onValidationChange(isValid);
      }

      return newErrors;
    });
  };

  return (
    <>
      <Input
        label={t('auth.signup.fullName')}
        name="username"
        type="text"
        autoComplete="name"
        required
        onChange={handleInputChange('username')}
        error={errors.username}
        hint={t('auth.validation.username.hint')}
        placeholder="John Doe"
      />

      <Input
        label={t('auth.signup.email')}
        name="email"
        type="email"
        autoComplete="email"
        required
        onChange={handleInputChange('email')}
        error={errors.email}
        hint={t('auth.validation.email.hint')}
        placeholder="user@example.com"
      />

      <Input
        label={t('auth.signup.password')}
        name="password"
        type="password"
        ref={passwordRef}
        autoComplete="new-password"
        required
        onChange={handleInputChange('password')}
        error={errors.password}
        hint={t('auth.validation.password.hint')}
        placeholder="••••••••"
      />

      <Input
        label={t('auth.signup.confirmPassword')}
        name="confirmPassword"
        type="password"
        ref={confirmPasswordRef}
        autoComplete="new-password"
        required
        onChange={handleInputChange('confirmPassword')}
        error={errors.confirmPassword}
        hint={t('auth.validation.passwordConfirmation.hint')}
        placeholder="••••••••"
      />

      <Button 
        type="submit" 
        className="w-full" 
        size="xl" 
        disabled={isLoading || Object.keys(errors).some(key => errors[key as keyof typeof errors])}
      >
        {isLoading ? t('auth.signup.loading') : t('auth.signup.submit')}
      </Button>
    </>
  );
} 