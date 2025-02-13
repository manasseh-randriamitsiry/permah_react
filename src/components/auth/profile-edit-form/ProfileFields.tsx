import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth-store';
import { validateUsername, validateEmail, validatePassword, validatePasswordConfirmation } from '../../../lib/validation';

interface ProfileFieldsProps {
  usernameRef: React.RefObject<HTMLInputElement>;
  emailRef: React.RefObject<HTMLInputElement>;
  currentPasswordRef: React.RefObject<HTMLInputElement>;
  newPasswordRef: React.RefObject<HTMLInputElement>;
  confirmPasswordRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}

export function ProfileFields({
  usernameRef,
  emailRef,
  currentPasswordRef,
  newPasswordRef,
  confirmPasswordRef,
  isLoading,
}: ProfileFieldsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const { user } = useAuthStore();

  const [errors, setErrors] = React.useState<{
    username?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'username':
        return validateUsername(value);
      case 'email':
        return validateEmail(value);
      case 'currentPassword':
        return validatePassword(value, false);
      case 'newPassword':
        return validatePassword(value);
      case 'confirmPassword':
        return validatePasswordConfirmation(newPasswordRef.current?.value || '', value);
      default:
        return { isValid: true };
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validateField(field, e.target.value);
    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? undefined : t(result.error || '')
    }));
  };

  const handlePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
    // Clear password fields and errors when canceling password change
    if (isChangingPassword) {
      if (currentPasswordRef.current) currentPasswordRef.current.value = '';
      if (newPasswordRef.current) newPasswordRef.current.value = '';
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
      setErrors(prev => ({
        ...prev,
        currentPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      }));
    }
  };

  return (
    <>
      <Input
        label={t('auth.signup.fullName')}
        name="name"
        type="text"
        ref={usernameRef}
        autoComplete="name"
        defaultValue={user?.name || ''}
        onChange={handleInputChange('username')}
        error={errors.username}
      />

      <Input
        label={t('auth.signup.email')}
        name="email"
        type="email"
        ref={emailRef}
        autoComplete="email"
        defaultValue={user?.email || ''}
        onChange={handleInputChange('email')}
        error={errors.email}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('auth.profile.password')}</span>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePasswordToggle}
          >
            {isChangingPassword 
              ? t('auth.profile.cancelPasswordChange')
              : t('auth.profile.changePassword')}
          </Button>
        </div>

        {isChangingPassword && (
          <div className="space-y-4">
            <Input
              label={t('auth.profile.currentPassword')}
              name="currentPassword"
              type="password"
              ref={currentPasswordRef}
              autoComplete="current-password"
              required={isChangingPassword}
              onChange={handleInputChange('currentPassword')}
              error={errors.currentPassword}
            />
            <Input
              label={t('auth.profile.newPassword')}
              name="newPassword"
              type="password"
              ref={newPasswordRef}
              autoComplete="new-password"
              required={isChangingPassword}
              placeholder={t('auth.profile.passwordHint')}
              onChange={handleInputChange('newPassword')}
              error={errors.newPassword}
            />
            <Input
              label={t('auth.profile.confirmPassword')}
              name="confirmPassword"
              type="password"
              ref={confirmPasswordRef}
              autoComplete="new-password"
              required={isChangingPassword}
              placeholder={t('auth.profile.confirmPasswordHint')}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || Object.keys(errors).some(key => errors[key as keyof typeof errors])}
        >
          {isLoading ? t('auth.profile.loading') : t('auth.profile.save')}
        </Button>
      </div>
    </>
  );
} 