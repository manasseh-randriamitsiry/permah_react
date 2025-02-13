import React from 'react';
import { useTranslation } from 'react-i18next';

export function LoginHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold">{t('auth.login.title')}</h2>
      <p className="mt-2 text-gray-600">{t('auth.login.subtitle')}</p>
    </div>
  );
} 