import React from 'react';
import { useTranslation } from 'react-i18next';

export function SignupHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold">{t('auth.signup.title')}</h2>
      <p className="mt-2 text-gray-600">{t('auth.signup.subtitle')}</p>
    </div>
  );
} 