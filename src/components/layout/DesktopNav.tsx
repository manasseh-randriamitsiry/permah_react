import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

interface DesktopNavProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function DesktopNav({ isAuthenticated, onLogout }: DesktopNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link to="/events" className="text-gray-600 hover:text-gray-900">
        {t('nav.events')}
      </Link>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            {t('nav.dashboard')}
          </Link>
          <Link to="/profile/edit" className="text-gray-600 hover:text-gray-900">
            <User className="h-4 w-4 inline-block mr-1" />
            {t('nav.profile')}
          </Link>
          <Button variant="outline" onClick={onLogout}>
            {t('nav.logout')}
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline">{t('nav.login')}</Button>
          </Link>
          <Link to="/signup">
            <Button>{t('nav.signup')}</Button>
          </Link>
        </>
      )}
    </nav>
  );
} 