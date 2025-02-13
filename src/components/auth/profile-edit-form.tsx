import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileEdit } from './profile-edit-form/useProfileEdit';
import { ProfileHeader } from './profile-edit-form/ProfileHeader';
import { ProfileError } from './profile-edit-form/ProfileError';
import { ProfileFields } from './profile-edit-form/ProfileFields';
import { PasswordVerificationModal } from './password-verification-modal';

export function ProfileEditForm() {
  const {
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
  } = useProfileEdit();

  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md space-y-8">
      <ProfileHeader />

      {!isPasswordVerified && (
        <PasswordVerificationModal
          isOpen={true}
          onClose={() => navigate('/dashboard')}
          onVerify={handlePasswordVerification}
          error={error}
          isVerifying={isVerifyingPassword}
        />
      )}

      {isPasswordVerified && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfileError error={error} />
          
          <ProfileFields
            usernameRef={usernameRef}
            emailRef={emailRef}
            currentPasswordRef={currentPasswordRef}
            newPasswordRef={newPasswordRef}
            confirmPasswordRef={confirmPasswordRef}
            isLoading={isLoading}
          />
        </form>
      )}
    </div>
  );
} 