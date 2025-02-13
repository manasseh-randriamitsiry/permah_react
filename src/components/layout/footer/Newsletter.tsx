import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';

export function Newsletter() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
        {t('footer.newsletter.title')}
      </h3>
      <form className="space-y-3">
        <div className="flex max-w-md">
          <input
            type="email"
            placeholder={t('footer.newsletter.placeholder')}
            className="w-full rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t('footer.newsletter.subscribe')}
          >
            <Mail className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {t('footer.newsletter.description')}
        </p>
      </form>
    </div>
  );
} 