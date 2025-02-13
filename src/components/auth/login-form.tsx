import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLogin } from './login-form/useLogin';
import { LoginHeader } from './login-form/LoginHeader';
import { LoginError } from './login-form/LoginError';
import { LoginFields } from './login-form/LoginFields';

interface LocationState {
  message?: string;
  email?: string;
}

export function LoginForm() {
  const location = useLocation();
  const state = location.state as LocationState;
  const { error, isLoading, emailRef, passwordRef, handleSubmit } = useLogin();

  // Pre-fill email if provided from signup
  React.useEffect(() => {
    if (state?.email && emailRef.current) {
      emailRef.current.value = state.email;
    }
  }, [state?.email, emailRef]);

  return (
    <div className="mx-auto max-w-md space-y-8">
      <LoginHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        {state?.message && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            {state.message}
          </div>
        )}
        
        <LoginError error={error} />
        
        <LoginFields
          emailRef={emailRef}
          passwordRef={passwordRef}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}