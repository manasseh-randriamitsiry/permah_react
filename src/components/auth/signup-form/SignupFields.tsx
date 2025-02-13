import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface SignupFieldsProps {
  isLoading: boolean;
}

export function SignupFields({ isLoading }: SignupFieldsProps) {
  const { t } = useTranslation();
  
  return (
    <>
      <Input
        label={t('auth.signup.fullName')}
        name="username"
        type="text"
        autoComplete="name"
        required
      />

      <Input
        label={t('auth.signup.email')}
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Input
        label={t('auth.signup.password')}
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />

      <Button type="submit" className="w-full" size="xl" disabled={isLoading}>
        {isLoading ? t('auth.signup.loading') : t('auth.signup.submit')}
      </Button>
    </>
  );
} 