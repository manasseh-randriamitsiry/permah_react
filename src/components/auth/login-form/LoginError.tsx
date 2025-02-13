import React from 'react';

interface LoginErrorProps {
  error: string;
}

export function LoginError({ error }: LoginErrorProps) {
  if (!error) return null;
  
  return (
    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
      <p className="font-medium">Error: {error}</p>
      <p className="mt-1">Please check your credentials and try again.</p>
    </div>
  );
} 