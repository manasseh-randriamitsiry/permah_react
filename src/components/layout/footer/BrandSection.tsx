import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

export function BrandSection() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold">{t('brand.name')}</span>
      </div>
      <p className="text-sm text-gray-600">
        {t('brand.description')}
      </p>
    </div>
  );
} 