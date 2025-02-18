import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SecurityService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth-store';
import { useTranslation } from 'react-i18next';

export function useSignup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

    console.log('Starting signup submission with:', { name, email });

    try {
      console.log('Starting signup process...');
      
      // First, clear the auth store state
      console.log('Clearing auth store state...');
      useAuthStore.getState().logout();
      
      // Verify storage is cleared
      const localStorageKeys = Object.keys(localStorage);
      const sessionStorageKeys = Object.keys(sessionStorage);
      console.log('Storage state after clearing:', {
        localStorage: localStorageKeys,
        sessionStorage: sessionStorageKeys
      });
      
      console.log('Proceeding with signup...');
      await SecurityService.signup({
        name,
        email,
        password,
      });
      
      console.log('Signup successful, navigating to verification page...');
      navigate('/verify-account', { 
        state: { 
          email,
          message: t('auth.signup.success')
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