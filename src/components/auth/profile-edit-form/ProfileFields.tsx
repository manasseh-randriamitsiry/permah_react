import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth-store';

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

  const handlePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
    // Clear password fields when canceling password change
    if (isChangingPassword) {
      if (currentPasswordRef.current) currentPasswordRef.current.value = '';
      if (newPasswordRef.current) newPasswordRef.current.value = '';
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
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
      />

      <Input
        label={t('auth.signup.email')}
        name="email"
        type="email"
        ref={emailRef}
        autoComplete="email"
        defaultValue={user?.email || ''}
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
            />
            <Input
              label={t('auth.profile.newPassword')}
              name="newPassword"
              type="password"
              ref={newPasswordRef}
              autoComplete="new-password"
              required={isChangingPassword}
              placeholder={t('auth.profile.passwordHint')}
            />
            <Input
              label={t('auth.profile.confirmPassword')}
              name="confirmPassword"
              type="password"
              ref={confirmPasswordRef}
              autoComplete="new-password"
              required={isChangingPassword}
              placeholder={t('auth.profile.confirmPasswordHint')}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('auth.profile.loading') : t('auth.profile.save')}
        </Button>
      </div>
    </>
  );
} 