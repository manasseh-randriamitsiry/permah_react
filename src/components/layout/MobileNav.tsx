import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileNavProps {
  isAuthenticated: boolean;
  isMenuOpen: boolean;
  onLogout: () => void;
  onCloseMenu: () => void;
}

export function MobileNav({ isAuthenticated, isMenuOpen, onLogout, onCloseMenu }: MobileNavProps) {
  return (
    <div
      className={`absolute top-16 left-0 right-0 bg-white border-b md:hidden transition-all duration-200 ease-in-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <nav className="flex flex-col space-y-4 p-4">
        <Link 
          to="/events" 
          className="text-gray-600 hover:text-gray-900 py-2"
          onClick={onCloseMenu}
        >
          Events
        </Link>
        {isAuthenticated ? (
          <>
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-gray-900 py-2"
              onClick={onCloseMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/profile/edit" 
              className="text-gray-600 hover:text-gray-900 py-2 flex items-center"
              onClick={onCloseMenu}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            <Button 
              variant="outline" 
              onClick={() => {
                onLogout();
                onCloseMenu();
              }}
              className="w-full justify-center"
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link to="/login" onClick={onCloseMenu}>
              <Button variant="outline" className="w-full justify-center">
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={onCloseMenu}>
              <Button className="w-full justify-center">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
} 