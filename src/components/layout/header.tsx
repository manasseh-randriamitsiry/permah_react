import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';
import { useNavigate } from 'react-router-dom';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <Calendar className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">EventManager</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-lg p-2 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>

        <DesktopNav 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
      </div>

      <MobileNav 
        isAuthenticated={isAuthenticated}
        isMenuOpen={isMenuOpen}
        onLogout={handleLogout}
        onCloseMenu={closeMenu}
      />
    </header>
  );
}