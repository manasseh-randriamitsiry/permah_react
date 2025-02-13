import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {t('home.title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {t('home.subtitle')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/events">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              {t('home.browseEvents')}
            </Button>
          </Link>
          <Link to="/events/create">
            <Button variant="outline" className="text-blue-600 hover:bg-blue-50">
              {t('home.createEvent')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 