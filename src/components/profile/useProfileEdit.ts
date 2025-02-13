import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { SecurityService } from '../../services/auth.service';

export const useProfileEdit = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const handlePasswordVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingPassword(true);
    setError('');

    try {
      const currentPassword = currentPasswordRef.current?.value;
      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      await SecurityService.verifyPassword(currentPassword);
      setIsPasswordVerified(true);
    } catch (err: any) {
      setError(err.message || 'Failed to verify password');
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

      if (!username && !email && !newPassword) {
        throw new Error('At least one field must be changed');
      }

      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      const response = await SecurityService.updateProfile({
        name: username || undefined,
        email: email || undefined,
        current_password: currentPassword,
        new_password: newPassword || undefined,
      });

      // Get current token
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      // Re-login with updated user data
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
    handlePasswordVerification,
    handleSubmit,
  };
}; 