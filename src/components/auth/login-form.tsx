import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import { SecurityService } from '../../services/auth.service';

export function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clear any existing auth state first
      useAuthStore.getState().logout();
      
      const response = await SecurityService.login(
        emailRef.current?.value || '',
        passwordRef.current?.value || ''
      );

      useAuthStore.getState().login(response.user,response.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="mt-2 text-gray-600">Please sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Error: {error}</p>
            <p className="mt-1">Please check your credentials and try again.</p>
          </div>
        )}

        <Input
          ref={emailRef}
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />

        <Input
          ref={passwordRef}
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        <Button type="submit" className="w-full" size="xl" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}