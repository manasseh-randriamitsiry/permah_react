import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">EventManager</span>
        </Link>

        <nav className="flex items-center space-x-4">
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
    </header>
  );
}