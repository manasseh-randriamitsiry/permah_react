import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth-store';
import { SecurityService } from '../../../services/auth.service';

export function useProfileEdit() {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = React.useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = React.useState(false);

  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const currentPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  // Populate fields immediately when component loads
  React.useEffect(() => {
    if (user) {
      if (usernameRef.current) usernameRef.current.value = user.name || '';
      if (emailRef.current) emailRef.current.value = user.email || '';
    }
  }, [user]);

  const handlePasswordVerification = async (password: string) => {
    setIsVerifyingPassword(true);
    setError('');

    try {
      if (!password) {
        throw new Error('Current password is required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      await SecurityService.verifyPassword(password);
      
      if (currentPasswordRef.current) {
        currentPasswordRef.current.value = password;
      }
      
      setIsPasswordVerified(true);
    } catch (err: any) {
      console.error('Password verification error:', err);
      if (err.message.includes('No authentication token found') || err.message.includes('Invalid credentials')) {
        SecurityService.clearAuth();
        navigate('/login');
        return;
      }
      setError(err.message || 'Failed to verify password. Please try again.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const username = usernameRef.current?.value;
      const email = emailRef.current?.value;
      const currentPassword = currentPasswordRef.current?.value;
      const newPassword = newPasswordRef.current?.value;
      const confirmPassword = confirmPasswordRef.current?.value;

      if (!username && !email && !newPassword) {
        throw new Error('At least one field must be changed');
      }

      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      if (newPassword && newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      const response = await SecurityService.updateProfile({
        name: username || undefined,
        email: email || undefined,
        current_password: currentPassword,
        new_password: newPassword || undefined,
      });

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      login(response.user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    error,
    isLoading,
    isVerifyingPassword,
    isPasswordVerified,
    usernameRef,
    emailRef,
    currentPasswordRef,
    newPasswordRef,
    confirmPasswordRef,
    handlePasswordVerification,
    handleSubmit,
  };
} 