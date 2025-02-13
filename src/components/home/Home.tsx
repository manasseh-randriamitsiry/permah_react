import React from 'react';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {t('home.title')}
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        {t('home.subtitle')}
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/events"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {t('home.browseEvents')}
        </a>
        <a href="/events/new" className="text-sm font-semibold leading-6 text-gray-900">
          {t('home.createEvent')} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
} 