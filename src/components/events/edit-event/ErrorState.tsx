import React from 'react';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-center py-8">
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{error}</p>
      </div>
    </div>
  );
} 