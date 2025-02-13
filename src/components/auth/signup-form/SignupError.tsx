import React from 'react';

interface SignupErrorProps {
  error: string;
}

export function SignupError({ error }: SignupErrorProps) {
  if (!error) return null;
  
  return (
    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
      {error}
    </div>
  );
} 