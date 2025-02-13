import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface LoginFieldsProps {
  emailRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}

export function LoginFields({ emailRef, passwordRef, isLoading }: LoginFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Input
        ref={emailRef}
        label={t('auth.login.email')}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="user@example.com"
        hint={t('auth.validation.email.hint')}
      />

      <Input
        ref={passwordRef}
        label={t('auth.login.password')}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        hint={t('auth.validation.password.hint')}
      />

      <Button type="submit" className="w-full" size="xl" disabled={isLoading}>
        {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
      </Button>
    </>
  );
} 