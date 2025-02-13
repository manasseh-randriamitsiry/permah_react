import React from 'react';
import { useTranslation } from 'react-i18next';

export function Resources() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
        {t('footer.resources.title')}
      </h3>
      <ul className="space-y-3 text-sm">
        <li>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('footer.resources.helpCenter')}
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('footer.resources.guidelines')}
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('footer.resources.privacy')}
          </a>
        </li>
      </ul>
    </div>
  );
} 