import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function QuickLinks() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
        {t('footer.quickLinks.title')}
      </h3>
      <ul className="space-y-3 text-sm">
        <li>
          <Link to="/events" className="text-gray-600 hover:text-blue-600">
            {t('footer.quickLinks.browseEvents')}
          </Link>
        </li>
        <li>
          <Link to="/events/new" className="text-gray-600 hover:text-blue-600">
            {t('footer.quickLinks.createEvent')}
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
            {t('footer.quickLinks.dashboard')}
          </Link>
        </li>
      </ul>
    </div>
  );
} 