import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { useAuthStore } from '../../store/auth-store';

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">{t('brand.name')}</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('nav.menu.close') : t('nav.menu.open')}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <DesktopNav isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <MobileNav
            isAuthenticated={isAuthenticated}
            isMenuOpen={isMenuOpen}
            onLogout={handleLogout}
            onCloseMenu={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}