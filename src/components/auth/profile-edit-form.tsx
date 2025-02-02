import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import { SecurityService } from '../../services/auth.service';
import { PasswordVerificationModal } from './password-verification-modal';

export function ProfileEditForm() {
  const navigate = useNavigate();
  const { user, loginWithUser } = useAuthStore();
  const [error, setError] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [showVerificationModal, setShowVerificationModal] = React.useState(true);

  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const currentPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      if (usernameRef.current) usernameRef.current.value = user.name;
      if (emailRef.current) emailRef.current.value = user.email;
    }
  }, [user]);

  const handlePasswordVerification = async (password: string) => {
    try {
      await SecurityService.verifyPassword(password);
      setIsVerified(true);
      setShowVerificationModal(false);
      setVerificationError('');
    } catch (err: any) {
      setVerificationError('Invalid password. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const name = usernameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const currentPassword = currentPasswordRef.current?.value;
    const newPassword = newPasswordRef.current?.value;

    try {
      // Only include fields that have been changed
      const updateData: {
        name?: string;
        email?: string;
        current_password?: string;
        new_password?: string;
      } = {};

      if (name && name !== user?.name) updateData.name = name;
      if (email && email !== user?.email) updateData.email = email;
      if (isChangingPassword) {
        updateData.current_password = currentPassword;
        updateData.new_password = newPassword;
      }

      const response = await SecurityService.updateProfile(updateData);
      
      // Update user in auth store
      loginWithUser(response.user);
      setSuccess('Profile updated successfully');
      
      // Reset password fields and state
      if (currentPasswordRef.current) currentPasswordRef.current.value = '';
      if (newPasswordRef.current) newPasswordRef.current.value = '';
      setIsChangingPassword(false);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      
      // Log error for debugging (without sensitive data)
      console.error('Profile update error:', {
        message: errorMessage,
        status: err.response?.status
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <PasswordVerificationModal
        isOpen={showVerificationModal}
        onVerify={handlePasswordVerification}
        onClose={() => navigate('/dashboard')}
        error={verificationError}
      />

      <div className={`mx-auto max-w-md space-y-8 ${!isVerified ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold">Edit Profile</h2>
          <p className="mt-2 text-gray-600">Update your account information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          <Input
            label="Full name"
            name="name"
            type="text"
            ref={usernameRef}
            autoComplete="name"
            required
          />

          <Input
            label="Email address"
            name="email"
            type="email"
            ref={emailRef}
            autoComplete="email"
            required
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                {isChangingPassword ? 'Cancel password change' : 'Change password'}
              </Button>
            </div>

            {isChangingPassword && (
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  ref={currentPasswordRef}
                  autoComplete="current-password"
                  required
                />
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  ref={newPasswordRef}
                  autoComplete="new-password"
                  required
                  placeholder="At least 6 characters"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
} 