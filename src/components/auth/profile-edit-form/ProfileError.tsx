import React from 'react';

interface ProfileErrorProps {
  error: string;
}

export function ProfileError({ error }: ProfileErrorProps) {
  if (!error) return null;
  
  return (
    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
      {error}
    </div>
  );
} 