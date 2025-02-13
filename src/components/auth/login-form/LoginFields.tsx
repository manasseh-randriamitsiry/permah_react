import React from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface LoginFieldsProps {
  emailRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}

export function LoginFields({ emailRef, passwordRef, isLoading }: LoginFieldsProps) {
  return (
    <>
      <Input
        ref={emailRef}
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Input
        ref={passwordRef}
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      <Button type="submit" className="w-full" size="xl" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </>
  );
} 