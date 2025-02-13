import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '../ui/button';

interface DesktopNavProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function DesktopNav({ isAuthenticated, onLogout }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link to="/events" className="text-gray-600 hover:text-gray-900">
        Events
      </Link>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/profile/edit" className="text-gray-600 hover:text-gray-900">
            <User className="h-4 w-4 inline-block mr-1" />
            Profile
          </Link>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </nav>
  );
} 