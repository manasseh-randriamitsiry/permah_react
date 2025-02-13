import React from 'react';
import { useSignup } from './signup-form/useSignup';
import { SignupHeader } from './signup-form/SignupHeader';
import { SignupError } from './signup-form/SignupError';
import { SignupFields } from './signup-form/SignupFields';

export function SignupForm() {
  const { error, isLoading, handleSubmit } = useSignup();

  return (
    <div className="mx-auto max-w-md space-y-8">
      <SignupHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SignupError error={error} />
        <SignupFields isLoading={isLoading} />
      </form>
    </div>
  );
}