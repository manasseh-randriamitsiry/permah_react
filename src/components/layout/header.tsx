import { Link } from 'react-router-dom';
import { Calendar, User, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

        {/* Desktop navigation */}
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
              <Button variant="outline" onClick={handleLogout}>
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
      </div>

      {/* Mobile navigation */}
      <div
        className={`absolute top-16 left-0 right-0 bg-white border-b md:hidden transition-all duration-200 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col space-y-4 p-4">
          <Link 
            to="/events" 
            className="text-gray-600 hover:text-gray-900 py-2"
            onClick={closeMenu}
          >
            Events
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile/edit" 
                className="text-gray-600 hover:text-gray-900 py-2 flex items-center"
                onClick={closeMenu}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-center"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full justify-center">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                <Button className="w-full justify-center">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}