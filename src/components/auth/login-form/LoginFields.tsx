import React from 'react';
import { Link } from 'react-router-dom';
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
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('auth.email')}
        </label>
        <Input
          id="email"
          type="email"
          ref={emailRef}
          required
          className="w-full"
          placeholder={t('auth.login.email')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('auth.password')}
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          ref={passwordRef}
          required
          className="w-full"
          placeholder={t('auth.login.password')}
          disabled={isLoading}
        />
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">
          {t('auth.login.noAccount')}{' '}
        </span>
        <Link
          to="/signup"
          className="text-indigo-600 hover:text-indigo-500"
        >
          {t('auth.login.signupLink')}
        </Link>
      </div>
    </>
  );
} 