import React from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileFieldsProps {
  usernameRef: React.RefObject<HTMLInputElement>;
  emailRef: React.RefObject<HTMLInputElement>;
  currentPasswordRef: React.RefObject<HTMLInputElement>;
  newPasswordRef: React.RefObject<HTMLInputElement>;
  confirmPasswordRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}

export function ProfileFields({
  usernameRef,
  emailRef,
  currentPasswordRef,
  newPasswordRef,
  confirmPasswordRef,
  isLoading,
}: ProfileFieldsProps) {
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const handlePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
    // Clear password fields when canceling password change
    if (isChangingPassword) {
      if (currentPasswordRef.current) currentPasswordRef.current.value = '';
      if (newPasswordRef.current) newPasswordRef.current.value = '';
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
    }
  };

  return (
    <>
      <Input
        label="Full name"
        name="name"
        type="text"
        ref={usernameRef}
        autoComplete="name"
      />

      <Input
        label="Email address"
        name="email"
        type="email"
        ref={emailRef}
        autoComplete="email"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePasswordToggle}
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
              required={isChangingPassword}
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              ref={newPasswordRef}
              autoComplete="new-password"
              required={isChangingPassword}
              placeholder="At least 8 characters"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              ref={confirmPasswordRef}
              autoComplete="new-password"
              required={isChangingPassword}
              placeholder="Re-enter new password"
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
    </>
  );
} 