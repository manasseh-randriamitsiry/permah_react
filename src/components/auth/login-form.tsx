import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

export function LoginForm() {
  const navigate = useNavigate();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      console.log('Form data:', { email, password });
      await loginWithCredentials(email, password);
      navigate('/events');
    } catch (err: any) {
      console.error('Login error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
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
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />

        <Input
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