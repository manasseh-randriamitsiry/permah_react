import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import { SecurityService } from '../../services/auth.service';

export function SignupForm() {
  const navigate = useNavigate();
  const loginWithUser = useAuthStore((state) => state.loginWithUser);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await SecurityService.signup({
        name,
        email,
        password,
      });
      
      const { user } = response.data;
      
      loginWithUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create your account</h2>
        <p className="mt-2 text-gray-600">Join our community today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Full name"
          name="username"
          type="text"
          autoComplete="name"
          required
        />

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
          autoComplete="new-password"
          required
        />

        <Button type="submit" className="w-full" size="xl" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}