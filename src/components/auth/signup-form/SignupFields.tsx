import React from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface SignupFieldsProps {
  isLoading: boolean;
}

export function SignupFields({ isLoading }: SignupFieldsProps) {
  return (
    <>
      <Input
        label="Full name"
        name="username"
        type="text"
        autoComplete="name"
        required
      />

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />

      <Button type="submit" className="w-full" size="xl" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </>
  );
} 