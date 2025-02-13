import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SecurityService } from '../../../services/auth.service';

export function useSignup() {
  const navigate = useNavigate();
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
      await SecurityService.signup({
        name,
        email,
        password,
      });
      
      // Redirect to login page with a success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please log in.',
          email 
        }
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleSubmit,
  };
} 