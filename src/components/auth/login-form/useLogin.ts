import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth-store';
import { SecurityService } from '../../../services/auth.service';

export function useLogin() {
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

      useAuthStore.getState().login(response.user, response.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    emailRef,
    passwordRef,
    handleSubmit,
  };
} 